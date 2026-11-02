import { useCallback, useRef, useState } from 'react';
import { analyzeCode } from '../services/api';
import { ANALYSIS_STATUS, ERROR_KINDS, EXAMPLE_CODE } from '../utils/constants';
import { validateCode } from '../utils/validators';

/**
 * State machine of an analysis: idle -> loading -> success | warning | error.
 * `analyze` can be injected (tests); it defaults to the real API service.
 */
export function useCodeAnalysis({ initialCode = EXAMPLE_CODE, analyze = analyzeCode } = {}) {
  const [code, setCode] = useState(initialCode);
  const [status, setStatus] = useState(ANALYSIS_STATUS.IDLE);
  const [result, setResult] = useState(null);
  const [submittedCode, setSubmittedCode] = useState('');
  const [error, setError] = useState(null);
  const latestRequest = useRef(0);

  const runAnalysis = useCallback(async () => {
    const check = validateCode(code);
    if (!check.valid) {
      setError({ kind: ERROR_KINDS.VALIDATION, message: check.error });
      setStatus(ANALYSIS_STATUS.ERROR);
      return ANALYSIS_STATUS.ERROR;
    }

    const requestId = ++latestRequest.current;
    const snapshot = code;
    setStatus(ANALYSIS_STATUS.LOADING);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyze(snapshot);
      if (requestId !== latestRequest.current) return null;
      const finalStatus = analysis.warnings.length > 0 ? ANALYSIS_STATUS.WARNING : ANALYSIS_STATUS.SUCCESS;
      setResult(analysis);
      setSubmittedCode(snapshot);
      setStatus(finalStatus);
      return finalStatus;
    } catch (caught) {
      if (requestId !== latestRequest.current) return null;
      setError({ kind: caught.kind ?? ERROR_KINDS.NETWORK, message: caught.message ?? 'Unexpected error.' });
      setStatus(ANALYSIS_STATUS.ERROR);
      return ANALYSIS_STATUS.ERROR;
    }
  }, [code, analyze]);

  const reset = useCallback(() => {
    latestRequest.current += 1;
    setStatus(ANALYSIS_STATUS.IDLE);
    setResult(null);
    setSubmittedCode('');
    setError(null);
  }, []);

  const dismissError = useCallback(() => {
    setError(null);
    setStatus((current) => (current === ANALYSIS_STATUS.ERROR ? ANALYSIS_STATUS.IDLE : current));
  }, []);

  const loadExample = useCallback(() => {
    setCode(EXAMPLE_CODE);
    dismissError();
  }, [dismissError]);

  const clearCode = useCallback(() => {
    setCode('');
    dismissError();
  }, [dismissError]);

  return {
    code,
    setCode,
    status,
    result,
    submittedCode,
    error,
    isLoading: status === ANALYSIS_STATUS.LOADING,
    runAnalysis,
    reset,
    dismissError,
    loadExample,
    clearCode,
  };
}
