import Editor from '@monaco-editor/react';
import { useCallback, useEffect, useRef } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import { defineBugHunterTheme, EDITOR_THEME, MONACO_FONT } from './monacoTheme';

/**
 * Monaco wrapper used for the editable input and for every read-only code view.
 * `decorations` is [{ line, className }]; `revealLine` scrolls a line into view.
 */
export default function CodeEditor({
  value,
  onChange,
  ariaLabel,
  readOnly = false,
  height = '100%',
  decorations = [],
  revealLine = null,
  wordWrap = 'off',
}) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const collectionRef = useRef(null);

  const syncDecorations = useCallback(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;
    const lineCount = editor.getModel()?.getLineCount() ?? 0;
    const items = decorations
      .filter(({ line }) => line <= lineCount)
      .map(({ line, className }) => ({
        range: new monaco.Range(line, 1, line, 1),
        options: { isWholeLine: true, className },
      }));
    if (collectionRef.current) collectionRef.current.set(items);
    else collectionRef.current = editor.createDecorationsCollection(items);
    if (revealLine && revealLine <= lineCount) editor.revealLineInCenterIfOutsideViewport(revealLine);
  }, [decorations, revealLine]);

  useEffect(() => {
    syncDecorations();
  }, [syncDecorations, value]);

  const handleMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    syncDecorations();
  };

  return (
    <div className="code-editor" style={{ height }}>
      <Editor
        language="python"
        theme={EDITOR_THEME}
        value={value}
        onChange={(next) => onChange?.(next ?? '')}
        beforeMount={defineBugHunterTheme}
        onMount={handleMount}
        loading={<LoadingSpinner label="Loading editor…" />}
        options={{
          ariaLabel,
          readOnly,
          domReadOnly: readOnly,
          minimap: { enabled: false },
          fontFamily: MONACO_FONT,
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
          wordWrap,
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: readOnly ? 'none' : 'line',
        }}
      />
    </div>
  );
}
