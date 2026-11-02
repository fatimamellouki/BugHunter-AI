export const EMPTY_CODE_MESSAGE = 'Write or paste some Python code before starting an analysis.';

export function validateCode(code) {
  if (typeof code !== 'string' || code.trim().length === 0) {
    return { valid: false, error: EMPTY_CODE_MESSAGE };
  }
  return { valid: true, error: null };
}
