import { buildLineDecorations, countLines, estimateEditorHeight, getSourceLine } from './codeLines';

describe('codeLines', () => {
  it('counts lines and ignores one trailing newline', () => {
    expect(countLines('')).toBe(0);
    expect(countLines('a')).toBe(1);
    expect(countLines('a\nb\n')).toBe(2);
  });

  it('returns a source line or null', () => {
    expect(getSourceLine('a\nb\nc', 2)).toBe('b');
    expect(getSourceLine('a\nb', 9)).toBeNull();
    expect(getSourceLine('a', null)).toBeNull();
  });

  it('builds decorations: unique valid lines, selected one flagged', () => {
    expect(buildLineDecorations([5, 5, 1, null, 0], 5)).toEqual([
      { line: 5, className: 'bh-line--selected' },
      { line: 1, className: 'bh-line--issue' },
    ]);
  });

  it('keeps the editor height within bounds', () => {
    expect(estimateEditorHeight('a')).toBe(120);
    expect(estimateEditorHeight('x\n'.repeat(500))).toBe(420);
  });
});
