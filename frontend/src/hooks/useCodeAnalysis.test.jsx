import { act, renderHook } from '@testing-library/react';
import { normalizeResponse, ApiError } from '../services/api';
import { RAW_AI_UNAVAILABLE_RESPONSE, RAW_FULL_RESPONSE } from '../test/fixtures';
import { ANALYSIS_STATUS, ERROR_KINDS, EXAMPLE_CODE } from '../utils/constants';
import { useCodeAnalysis } from './useCodeAnalysis';

describe('useCodeAnalysis', () => {
  it('starts idle with the example code loaded', () => {
    const { result } = renderHook(() => useCodeAnalysis({ analyze: vi.fn() }));
    expect(result.current.status).toBe(ANALYSIS_STATUS.IDLE);
    expect(result.current.code).toBe(EXAMPLE_CODE);
    expect(result.current.result).toBeNull();
  });

  it('refuses empty code, sets an error and does not call the API', async () => {
    const analyze = vi.fn();
    const { result } = renderHook(() => useCodeAnalysis({ analyze, initialCode: '' }));

    let outcome;
    await act(async () => {
      outcome = await result.current.runAnalysis();
    });

    expect(outcome).toBe(ANALYSIS_STATUS.ERROR);
    expect(result.current.error.kind).toBe(ERROR_KINDS.VALIDATION);
    expect(analyze).not.toHaveBeenCalled();
  });

  it('goes through loading and ends in success, keeping the submitted code', async () => {
    let resolve;
    const analyze = vi.fn(() => new Promise((r) => (resolve = r)));
    const { result } = renderHook(() => useCodeAnalysis({ analyze, initialCode: 'x = 1' }));

    let promise;
    act(() => {
      promise = result.current.runAnalysis();
    });
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolve(normalizeResponse(RAW_FULL_RESPONSE));
      await promise;
    });

    expect(analyze).toHaveBeenCalledWith('x = 1');
    expect(result.current.status).toBe(ANALYSIS_STATUS.SUCCESS);
    expect(result.current.result.issues).toHaveLength(4);
    expect(result.current.submittedCode).toBe('x = 1');
  });

  it('ends in warning when the analysis carries warnings', async () => {
    const analyze = vi.fn().mockResolvedValue(normalizeResponse(RAW_AI_UNAVAILABLE_RESPONSE));
    const { result } = renderHook(() => useCodeAnalysis({ analyze, initialCode: 'x = 1' }));

    await act(async () => {
      await result.current.runAnalysis();
    });
    expect(result.current.status).toBe(ANALYSIS_STATUS.WARNING);
    expect(result.current.result).not.toBeNull();
  });

  it('stores the error and keeps the code when the API fails', async () => {
    const analyze = vi.fn().mockRejectedValue(new ApiError(ERROR_KINDS.SERVER, 'boom', { status: 500 }));
    const { result } = renderHook(() => useCodeAnalysis({ analyze, initialCode: 'keep me' }));

    await act(async () => {
      await result.current.runAnalysis();
    });
    expect(result.current.status).toBe(ANALYSIS_STATUS.ERROR);
    expect(result.current.error).toEqual({ kind: ERROR_KINDS.SERVER, message: 'boom' });
    expect(result.current.code).toBe('keep me');
  });

  it('ignores the answer of a request cancelled by reset()', async () => {
    let resolve;
    const analyze = vi.fn(() => new Promise((r) => (resolve = r)));
    const { result } = renderHook(() => useCodeAnalysis({ analyze, initialCode: 'x = 1' }));

    let promise;
    act(() => {
      promise = result.current.runAnalysis();
    });
    act(() => result.current.reset());
    let outcome;
    await act(async () => {
      resolve(normalizeResponse(RAW_FULL_RESPONSE));
      outcome = await promise;
    });

    expect(outcome).toBeNull();
    expect(result.current.status).toBe(ANALYSIS_STATUS.IDLE);
    expect(result.current.result).toBeNull();
  });

  it('clears and reloads the example code', () => {
    const { result } = renderHook(() => useCodeAnalysis({ analyze: vi.fn() }));
    act(() => result.current.clearCode());
    expect(result.current.code).toBe('');
    act(() => result.current.loadExample());
    expect(result.current.code).toBe(EXAMPLE_CODE);
  });
});
