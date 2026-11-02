import { ANALYSIS_STATUS } from '../../utils/constants';
import { formatAiStatus, formatValidity, pluralize } from '../../utils/formatters';
import Notice from '../common/Notice';

const STATUS_LABELS = {
  [ANALYSIS_STATUS.SUCCESS]: 'Completed',
  [ANALYSIS_STATUS.WARNING]: 'Completed with warnings',
};

export default function AnalysisSummary({ result, status }) {
  return (
    <section className="summary" aria-labelledby="summary-title">
      <h2 id="summary-title" className="visually-hidden">
        Analysis summary
      </h2>
      <dl className="summary__metrics">
        <div className="metric">
          <dt>Analysis</dt>
          <dd className={`metric__value metric__value--${status}`}>{STATUS_LABELS[status] ?? 'Unknown'}</dd>
        </div>
        <div className="metric">
          <dt>Issues detected</dt>
          <dd className="metric__value">{result.issues.length}</dd>
        </div>
        <div className="metric">
          <dt>AI analysis</dt>
          <dd className={`metric__value metric__value--${result.aiAvailable ? 'success' : 'warning'}`}>
            {formatAiStatus(result.aiStatus)}
          </dd>
        </div>
        <div className="metric">
          <dt>Syntax</dt>
          <dd className="metric__value">{formatValidity(result.valid)}</dd>
        </div>
      </dl>

      {result.summary && <p className="summary__text">{result.summary}</p>}
      {!result.summary && result.issues.length > 0 && (
        <p className="summary__text">{pluralize(result.issues.length, 'issue')} found by static analysis.</p>
      )}

      {result.warnings.length > 0 && (
        <Notice variant="warning" title="Read these before trusting the results">
          <ul className="notice__list">
            {result.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </Notice>
      )}
    </section>
  );
}
