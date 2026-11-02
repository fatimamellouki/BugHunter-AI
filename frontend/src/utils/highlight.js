// Tiny Python tokenizer used only by the landing page demo (the real editor is Monaco).
const KEYWORDS = new Set(['def', 'for', 'in', 'if', 'is', 'return', 'not', 'None', 'else', 'or', 'and']);
const FUNCTIONS = new Set(['print', 'len']);

export function tokenizePython(line) {
  const parts = line.match(/\s+|[A-Za-z_]\w*|\d+|'[^']*'|[^\sA-Za-z_\d']+|'/g) ?? [];
  let previous = '';
  return parts.map((text) => {
    if (/^\s+$/.test(text)) return { text, kind: 'plain' };
    let kind = 'plain';
    if (KEYWORDS.has(text)) kind = 'keyword';
    else if (previous === 'def' || FUNCTIONS.has(text)) kind = 'function';
    else if (/^\d+$/.test(text)) kind = 'number';
    else if (text.startsWith("'")) kind = 'string';
    previous = text;
    return { text, kind };
  });
}
