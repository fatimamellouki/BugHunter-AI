export function countLines(text) {
  if (!text) return 0;
  return text.replace(/\n$/, '').split('\n').length;
}

export function getSourceLine(code, line) {
  if (!code || !Number.isInteger(line) || line < 1) return null;
  const value = code.split('\n')[line - 1];
  return value === undefined ? null : value;
}

/** Pure description of the lines to highlight; CodeEditor turns it into Monaco decorations. */
export function buildLineDecorations(issueLines, selectedLine) {
  const unique = [...new Set(issueLines.filter((line) => Number.isInteger(line) && line > 0))];
  return unique.map((line) => ({
    line,
    className: line === selectedLine ? 'bh-line--selected' : 'bh-line--issue',
  }));
}

export function estimateEditorHeight(text, { min = 120, max = 420, lineHeight = 19, padding = 28 } = {}) {
  const height = countLines(text) * lineHeight + padding;
  return Math.min(max, Math.max(min, height));
}
