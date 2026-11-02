import { ERROR_KINDS } from '../utils/constants';
import { normalizeSeverity } from '../utils/formatters';
import { validateCode } from '../utils/validators';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');
export const DEBUG_URL = `${API_BASE_URL}/api/debug`;
const DEFAULT_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS) || 90_000;

export class ApiError extends Error {
  constructor(kind, message, { status = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

/* ---------- Response normalisation ---------- */

const STATIC_FIELDS = ['status', 'valid', 'issues', 'summary', 'ai_status'];
const AI_FIELDS = ['explanation', 'root_causes', 'corrected_code', 'tests'];

const asText = (value) => (typeof value === 'string' && value.trim() ? value : null);
const asTextList = (value) => (Array.isArray(value) ? value.filter((item) => asText(item)) : []);

function normalizeIssue(raw, index) {
  const ruleId = asText(raw.rule_id) ?? 'UNKNOWN_RULE';
  const line = Number.isInteger(raw.line) && raw.line > 0 ? raw.line : null;
  return {
    id: `${ruleId}-${line ?? 'x'}-${index}`,
    ruleId,
    type: asText(raw.type) ?? 'Unknown issue',
    line,
    severity: normalizeSeverity(raw.severity),
    message: asText(raw.message) ?? '',
  };
}

function collectWarnings(raw, { aiAvailable, aiStatus, aiError, valid, status }) {
  const warnings = [];
  if (valid === false) {
    warnings.push('The backend reports that this code is not syntactically valid. Results may be incomplete.');
  }
  if (status && status !== 'success') {
    warnings.push(`The backend returned the global status "${status}".`);
  }
  if (!aiAvailable) {
    warnings.push(
      aiError
        ? `AI analysis unavailable: ${aiError}`
        : `AI analysis did not complete (status: ${aiStatus ?? 'unknown'}). Static analysis results are still shown.`,
    );
  }
  const expected = aiAvailable ? [...STATIC_FIELDS, ...AI_FIELDS] : STATIC_FIELDS;
  const missing = expected.filter((key) => (key === 'issues' ? !Array.isArray(raw.issues) : raw[key] === undefined));
  if (missing.length > 0) {
    warnings.push(`Partial response: missing field(s) ${missing.join(', ')}.`);
  }
  return warnings;
}

/** Turns any backend payload into an object whose fields always exist. */
export function normalizeResponse(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new ApiError(ERROR_KINDS.INVALID_RESPONSE, 'The backend returned an unexpected response format.');
  }
  const status = asText(raw.status);
  const aiStatus = asText(raw.ai_status);
  const aiError = asText(raw.ai_error);
  const valid = typeof raw.valid === 'boolean' ? raw.valid : null;
  const aiAvailable = aiStatus === 'success' && !aiError;

  const issues = (Array.isArray(raw.issues) ? raw.issues : [])
    .filter((item) => item && typeof item === 'object')
    .map(normalizeIssue);

  return {
    status,
    valid,
    summary: asText(raw.summary),
    issues,
    aiStatus,
    aiAvailable,
    aiError,
    explanation: asText(raw.explanation),
    rootCauses: asTextList(raw.root_causes),
    correctedCode: asText(raw.corrected_code),
    tests: asTextList(raw.tests),
    warnings: collectWarnings(raw, { aiAvailable, aiStatus, aiError, valid, status }),
  };
}

/* ---------- HTTP ---------- */

function extractErrorDetail(body) {
  if (!body || typeof body !== 'object') return null;
  const { detail, message, error } = body;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    const parts = detail
      .map((item) => {
        if (typeof item === 'string') return item;
        if (!item || typeof item.msg !== 'string') return null;
        const location = Array.isArray(item.loc) ? item.loc.filter((part) => part !== 'body').join('.') : '';
        return location ? `${location}: ${item.msg}` : item.msg;
      })
      .filter(Boolean);
    return parts.length > 0 ? parts.join('; ') : null;
  }
  return asText(message) ?? asText(error);
}

async function buildHttpError(response) {
  let body = null;
  try {
    body = await response.json();
  } catch {
    // The error body is optional; the HTTP status is enough.
  }
  const detail = extractErrorDetail(body);
  const suffix = detail ? ` ${detail}` : '';
  if (response.status === 422) {
    return new ApiError(ERROR_KINDS.UNPROCESSABLE, `The backend rejected the request (HTTP 422).${suffix}`, { status: 422 });
  }
  if (response.status >= 500) {
    return new ApiError(ERROR_KINDS.SERVER, `The backend failed while analyzing the code (HTTP ${response.status}).${suffix}`, {
      status: response.status,
    });
  }
  return new ApiError(ERROR_KINDS.HTTP, `The backend answered with HTTP ${response.status}.${suffix}`, {
    status: response.status,
  });
}

async function readJson(response) {
  try {
    return await response.json();
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    throw new ApiError(ERROR_KINDS.INVALID_RESPONSE, 'The backend returned a response that is not valid JSON.');
  }
}

function toApiError(error, timeoutMs) {
  if (error instanceof ApiError) return error;
  if (error?.name === 'AbortError') {
    return new ApiError(ERROR_KINDS.TIMEOUT, `The analysis took longer than ${Math.round(timeoutMs / 1000)} seconds and was cancelled.`);
  }
  return new ApiError(ERROR_KINDS.NETWORK, `Could not reach the backend at ${API_BASE_URL}.`);
}

/**
 * Sends Python code to POST /api/debug and returns the normalised analysis.
 * Throws an ApiError whose `kind` tells the UI which message to show.
 */
export async function analyzeCode(code, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const check = validateCode(code);
  if (!check.valid) throw new ApiError(ERROR_KINDS.VALIDATION, check.error);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(DEBUG_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ code, language: 'python' }),
      signal: controller.signal,
    });
    if (!response.ok) throw await buildHttpError(response);
    return normalizeResponse(await readJson(response));
  } catch (error) {
    throw toApiError(error, timeoutMs);
  } finally {
    clearTimeout(timer);
  }
}
