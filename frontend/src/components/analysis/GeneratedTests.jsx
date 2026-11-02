import { FlaskConical } from 'lucide-react';
import { estimateEditorHeight } from '../../utils/codeLines';
import CopyButton from '../common/CopyButton';
import EmptyState from '../common/EmptyState';
import Notice from '../common/Notice';
import CodeEditor from '../editor/CodeEditor';

export default function GeneratedTests({ tests, aiAvailable }) {
  if (tests.length === 0) {
    return (
      <EmptyState icon={FlaskConical} tone={aiAvailable ? 'neutral' : 'warning'} title="No generated tests">
        {aiAvailable
          ? 'The AI analysis finished but did not return any test.'
          : 'The AI analysis did not complete, so no test was generated.'}
      </EmptyState>
    );
  }
  return (
    <div className="generated-tests">
      <Notice variant="info" title="Generated, not executed">
        These Pytest tests were written by the AI. The backend does not run them, so there is no pass or fail result.
        Review them, then run them yourself with <code>pytest</code>.
      </Notice>
      <div className="toolbar">
        <p className="section-note">{tests.length} generated {tests.length === 1 ? 'test file' : 'test files'}</p>
        <CopyButton text={tests.join('\n\n')} label="Copy all tests" />
      </div>
      <ol className="tests-list">
        {tests.map((test, index) => (
          <li key={`test-${index}`} className="code-panel">
            <div className="code-panel__head">
              <h3 className="code-panel__title">Generated test {index + 1}</h3>
              <CopyButton text={test} label="Copy" ariaLabel={`Copy generated test ${index + 1}`} />
            </div>
            <CodeEditor
              value={test}
              readOnly
              height={estimateEditorHeight(test)}
              ariaLabel={`Generated Pytest code ${index + 1}`}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
