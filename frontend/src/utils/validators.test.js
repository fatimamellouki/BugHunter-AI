import { EMPTY_CODE_MESSAGE, validateCode } from './validators';

describe('validateCode', () => {
  it.each([['empty string', ''], ['spaces and newlines', '  \n\t '], ['undefined', undefined], ['a number', 42]])(
    'rejects %s',
    (_label, value) => {
      expect(validateCode(value)).toEqual({ valid: false, error: EMPTY_CODE_MESSAGE });
    },
  );

  it('accepts non-empty code', () => {
    expect(validateCode('x = 1')).toEqual({ valid: true, error: null });
  });
});
