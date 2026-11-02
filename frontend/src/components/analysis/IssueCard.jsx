import { formatLine } from '../../utils/formatters';
import SeverityBadge from './SeverityBadge';

export default function IssueCard({ issue, selected, onSelect }) {
  return (
    <li>
      <button
        type="button"
        className={`issue-card${selected ? ' issue-card--selected' : ''}`}
        aria-pressed={selected}
        onClick={() => onSelect(issue.id)}
      >
        <span className="issue-card__top">
          <SeverityBadge severity={issue.severity} />
          <span className="issue-card__line">{formatLine(issue.line)}</span>
        </span>
        <span className="issue-card__type">{issue.type}</span>
        <code className="issue-card__rule">{issue.ruleId}</code>
        {issue.message && <span className="issue-card__message">{issue.message}</span>}
      </button>
    </li>
  );
}
