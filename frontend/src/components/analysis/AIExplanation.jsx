import { Bot } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import RootCauses from './RootCauses';

export default function AIExplanation({ explanation, rootCauses, aiAvailable, aiError }) {
  const hasContent = Boolean(explanation) || rootCauses.length > 0;
  return (
    <div className="ai-explanation">
      <p className="section-note">
        Written by a language model. Treat it as informed commentary: only the issues listed by static analysis are
        confirmed by rules.
      </p>

      {hasContent ? (
        <>
          {explanation && <p className="ai-explanation__text">{explanation}</p>}
          <RootCauses causes={rootCauses} />
        </>
      ) : (
        <EmptyState icon={Bot} tone={aiAvailable ? 'neutral' : 'warning'} title="No AI explanation available">
          {aiAvailable
            ? 'The AI analysis finished but returned no explanation.'
            : aiError ?? 'The AI analysis did not complete, so there is nothing to explain yet.'}
        </EmptyState>
      )}

      <div className="ai-role">
        <h3>How the AI is used</h3>
        <p>
          Static analysis finds the issues. The AI then explains them, suggests root causes, proposes a corrected
          version and drafts Pytest tests. None of its output is applied to your code automatically.
        </p>
      </div>
    </div>
  );
}
