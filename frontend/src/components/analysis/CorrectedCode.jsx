import { DiffEditor } from '@monaco-editor/react';
import { FileX } from 'lucide-react';
import { useState } from 'react';
import { countLines } from '../../utils/codeLines';
import CopyButton from '../common/CopyButton';
import EmptyState from '../common/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';
import Notice from '../common/Notice';
import CodeEditor from '../editor/CodeEditor';
import { defineBugHunterTheme, EDITOR_THEME, MONACO_FONT } from '../editor/monacoTheme';

const VIEWS = [
  { id: 'compare', label: 'Compare with original' },
  { id: 'corrected', label: 'Corrected code only' },
];

export default function CorrectedCode({ originalCode, correctedCode, aiAvailable }) {
  const [view, setView] = useState('compare');

  if (!correctedCode) {
    return (
      <EmptyState icon={FileX} tone={aiAvailable ? 'neutral' : 'warning'} title="No corrected code available">
        {aiAvailable
          ? 'The AI analysis finished but did not return a corrected version.'
          : 'The AI analysis did not complete, so no correction was proposed.'}
      </EmptyState>
    );
  }

  const identical = correctedCode.trim() === originalCode.trim();
  return (
    <div className="corrected-code">
      <div className="toolbar">
        <div className="segmented" role="group" aria-label="Code view">
          {VIEWS.map((option) => (
            <button
              key={option.id}
              type="button"
              className="segmented__option"
              aria-pressed={view === option.id}
              onClick={() => setView(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <CopyButton text={correctedCode} label="Copy Code" ariaLabel="Copy corrected code" />
      </div>

      <p className="section-note">AI suggestion. Your original code is never replaced. Review every change before using it.</p>
      {identical && <Notice variant="info">The corrected code is identical to your original code.</Notice>}

      {view === 'compare' ? (
        <div className="code-panel">
          <p className="code-panel__title">Original (left) and corrected (right)</p>
          <div className="code-editor" style={{ height: Math.min(560, Math.max(260, countLines(correctedCode) * 19 + 40)) }}>
            <DiffEditor
              language="python"
              theme={EDITOR_THEME}
              original={originalCode}
              modified={correctedCode}
              beforeMount={defineBugHunterTheme}
              loading={<LoadingSpinner label="Loading diff…" />}
              options={{
                readOnly: true,
                originalEditable: false,
                renderSideBySide: true,
                minimap: { enabled: false },
                fontFamily: MONACO_FONT,
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      ) : (
        <div className="code-panel">
          <p className="code-panel__title">Corrected code</p>
          <CodeEditor value={correctedCode} readOnly height={420} ariaLabel="Corrected Python code" />
        </div>
      )}
    </div>
  );
}
