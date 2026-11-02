export const EDITOR_THEME = 'bughunter-dark';

export function defineBugHunterTheme(monaco) {
  monaco.editor.defineTheme(EDITOR_THEME, {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#0b1426',
      'editor.lineHighlightBackground': '#121d38',
      'editorLineNumber.foreground': '#4b5d86',
      'editorLineNumber.activeForeground': '#a9bbe3',
      'editorGutter.background': '#0b1426',
      'editor.selectionBackground': '#2f6bff55',
    },
  });
}

export const MONACO_FONT = "'JetBrains Mono', ui-monospace, Consolas, monospace";
