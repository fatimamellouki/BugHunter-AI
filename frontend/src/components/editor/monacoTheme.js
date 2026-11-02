export const EDITOR_THEME = 'bughunter-light';

export function defineBugHunterTheme(monaco) {
  monaco.editor.defineTheme(EDITOR_THEME, {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '7a3dd8' },
      { token: 'number', foreground: 'b45309' },
      { token: 'string', foreground: '0f7a5c' },
      { token: 'comment', foreground: '5b6677', fontStyle: 'italic' },
    ],
    colors: {
      'editor.background': '#f7f9fc',
      'editor.foreground': '#1b2230',
      'editor.lineHighlightBackground': '#eef2f9',
      'editorLineNumber.foreground': '#5c6778',
      'editorLineNumber.activeForeground': '#1b2230',
      'editorGutter.background': '#f7f9fc',
      'editor.selectionBackground': '#2457f533',
    },
  });
}

export const MONACO_FONT = "'JetBrains Mono', ui-monospace, Consolas, monospace";
