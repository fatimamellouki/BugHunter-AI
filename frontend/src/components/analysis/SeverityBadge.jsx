import { formatSeverity, normalizeSeverity } from '../../utils/formatters';

export default function SeverityBadge({ severity }) {
  const level = normalizeSeverity(severity);
  return (
    <span className={`badge badge--${level}`} data-severity={level}>
      <span className="badge__dot" aria-hidden="true" />
      {formatSeverity(level)}
    </span>
  );
}
