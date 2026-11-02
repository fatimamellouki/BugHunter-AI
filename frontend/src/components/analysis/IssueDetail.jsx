import { MousePointerClick } from 'lucide-react';
import { getSourceLine } from '../../utils/codeLines';
import { formatLine } from '../../utils/formatters';
import SeverityBadge from './SeverityBadge';

export default function IssueDetail({ issue, code }) {
  if (!issue) {
    return (
      <div className="issue-detail issue-detail--empty">
        <MousePointerClick size={18} aria-hidden="true" />
        <p>Select an issue to see its details and locate it in the code.</p>
      </div>
    );
  }
  const sourceLine = getSourceLine(code, issue.line);
  return (
    <div className="issue-detail" aria-live="polite">
      <div className="issue-detail__head">
        <SeverityBadge severity={issue.severity} />
        <h3>{issue.type}</h3>
      </div>
      <dl className="issue-detail__facts">
        <div>
          <dt>Rule</dt>
          <dd>
            <code>{issue.ruleId}</code>
          </dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{formatLine(issue.line)}</dd>
        </div>
      </dl>
      {issue.message && <p>{issue.message}</p>}
      {sourceLine !== null && <pre className="issue-detail__source">{sourceLine.trim() || '(blank line)'}</pre>}
    </div>
  );
}
