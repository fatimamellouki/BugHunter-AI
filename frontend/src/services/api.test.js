import { jsonResponse, RAW_AI_UNAVAILABLE_RESPONSE, RAW_FULL_RESPONSE } from '../test/fixtures';
import { ERROR_KINDS } from '../utils/constants';
import { analyzeCode, ApiError, DEBUG_URL, normalizeResponse } from './api';

const mockFetch = (impl) => vi.stubGlobal('fetch', vi.fn(impl));

describe('analyzeCode - request', () => {
  it('posts the code and language as JSON to /api/debug', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(RAW_FULL_RESPONSE));
    vi.stubGlobal('fetch', fetchMock);

    await analyzeCode('def f():\n    pass');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(DEBUG_URL);
    expect(url.endsWith('/api/debug')).toBe(true);
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(options.body)).toEqual({ code: 'def f():\n    pass', language: 'python' });
  });

  it('rejects empty code without calling the network', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(analyzeCode('   ')).rejects.toMatchObject({ kind: ERROR_KINDS.VALIDATION });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('analyzeCode - responses', () => {
  it('returns a normalized analysis for a complete response', async () => {
    mockFetch(async () => jsonResponse(RAW_FULL_RESPONSE));
    const result = await analyzeCode('x = 1');

    expect(result.issues).toHaveLength(4);
    expect(result.issues[1]).toMatchObject({ ruleId: 'PY_DIV_ZERO', type: 'PotentialZeroDivision', line: 5, severity: 'high' });
    expect(result.aiAvailable).toBe(true);
    expect(result.rootCauses).toHaveLength(2);
    expect(result.tests).toHaveLength(2);
    expect(result.warnings).toEqual([]);
  });

  it('flags a warning when the AI part is unavailable but keeps static results', async () => {
    mockFetch(async () => jsonResponse(RAW_AI_UNAVAILABLE_RESPONSE));
    const result = await analyzeCode('x = 1');

    expect(result.issues).toHaveLength(2);
    expect(result.aiAvailable).toBe(false);
    expect(result.correctedCode).toBeNull();
    expect(result.warnings.join(' ')).toContain('LLM provider timeout');
  });
});

describe('analyzeCode - errors', () => {
  it('maps HTTP 422 and extracts the FastAPI detail', async () => {
    mockFetch(async () =>
      jsonResponse({ detail: [{ loc: ['body', 'code'], msg: 'Field required', type: 'missing' }] }, 422),
    );
    const error = await analyzeCode('x = 1').catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error.kind).toBe(ERROR_KINDS.UNPROCESSABLE);
    expect(error.status).toBe(422);
    expect(error.message).toContain('code: Field required');
  });

  it('maps HTTP 500 even when the body is not JSON', async () => {
    mockFetch(async () => new Response('Internal Server Error', { status: 500 }));
    const error = await analyzeCode('x = 1').catch((e) => e);

    expect(error.kind).toBe(ERROR_KINDS.SERVER);
    expect(error.status).toBe(500);
  });

  it('maps other HTTP errors', async () => {
    mockFetch(async () => jsonResponse({ detail: 'Not found' }, 404));
    const error = await analyzeCode('x = 1').catch((e) => e);
    expect(error.kind).toBe(ERROR_KINDS.HTTP);
    expect(error.message).toContain('Not found');
  });

  it('maps a rejected fetch to a network error', async () => {
    mockFetch(async () => {
      throw new TypeError('Failed to fetch');
    });
    const error = await analyzeCode('x = 1').catch((e) => e);
    expect(error.kind).toBe(ERROR_KINDS.NETWORK);
    expect(error.message).toContain('Could not reach the backend');
  });

  it('maps a request that exceeds the timeout', async () => {
    mockFetch(
      (_url, { signal }) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
        }),
    );
    const error = await analyzeCode('x = 1', { timeoutMs: 20 }).catch((e) => e);
    expect(error.kind).toBe(ERROR_KINDS.TIMEOUT);
  });

  it('maps malformed JSON to an invalid response error', async () => {
    mockFetch(async () => new Response('{not json', { status: 200 }));
    const error = await analyzeCode('x = 1').catch((e) => e);
    expect(error.kind).toBe(ERROR_KINDS.INVALID_RESPONSE);
  });
});

describe('normalizeResponse', () => {
  it('rejects payloads that are not objects', () => {
    expect(() => normalizeResponse(null)).toThrow(ApiError);
    expect(() => normalizeResponse([])).toThrow(ApiError);
    expect(() => normalizeResponse('ok')).toThrow(ApiError);
  });

  it('fills missing fields with safe values and reports a partial response', () => {
    const result = normalizeResponse({ status: 'success', ai_status: 'success' });

    expect(result.issues).toEqual([]);
    expect(result.tests).toEqual([]);
    expect(result.rootCauses).toEqual([]);
    expect(result.correctedCode).toBeNull();
    expect(result.explanation).toBeNull();
    expect(result.valid).toBeNull();
    expect(result.warnings.join(' ')).toContain('Partial response');
  });

  it('warns when the backend says the code is not valid', () => {
    const result = normalizeResponse({ ...RAW_FULL_RESPONSE, valid: false });
    expect(result.valid).toBe(false);
    expect(result.warnings.join(' ')).toContain('not syntactically valid');
  });

  it('never invents a severity and tolerates a missing line', () => {
    const result = normalizeResponse({
      ...RAW_FULL_RESPONSE,
      issues: [{ rule_id: 'R', type: 'T', severity: 'blocker', message: 'm' }, 'garbage', null],
    });
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0]).toMatchObject({ severity: 'unknown', line: null });
  });

  it('ignores blank tests and root causes', () => {
    const result = normalizeResponse({ ...RAW_FULL_RESPONSE, tests: ['', '  ', 'def test_a(): pass'], root_causes: [null, 'cause'] });
    expect(result.tests).toEqual(['def test_a(): pass']);
    expect(result.rootCauses).toEqual(['cause']);
  });
});
