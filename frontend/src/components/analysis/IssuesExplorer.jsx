import { useMemo, useState } from 'react';
import { buildLineDecorations } from '../../utils/codeLines';
import { countBySeverity, filterIssues, sortIssues } from '../../utils/formatters';
import CodeEditor from '../editor/CodeEditor';
import IssueDetail from './IssueDetail';
import IssueFilters from './IssueFilters';
import IssueList from './IssueList';

/** Static-analysis findings: filters, list, selected issue and the analyzed code with highlighted lines. */
export default function IssuesExplorer({ issues, originalCode }) {
  const [severity, setSeverity] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const counts = useMemo(() => countBySeverity(issues), [issues]);
  const visible = useMemo(() => sortIssues(filterIssues(issues, { severity, query })), [issues, severity, query]);
  const selected = visible.find((issue) => issue.id === selectedId) ?? null;

  const decorations = useMemo(
    () =>
      buildLineDecorations(
        visible.map((issue) => issue.line),
        selected?.line,
      ),
    [visible, selected],
  );

  const resetFilters = () => {
    setSeverity('all');
    setQuery('');
  };

  return (
    <div className="issues-explorer">
      <div className="issues-explorer__column">
        <p className="section-note">Detected by rule-based static analysis.</p>
        {issues.length > 0 && (
          <IssueFilters
            severity={severity}
            onSeverityChange={setSeverity}
            query={query}
            onQueryChange={setQuery}
            counts={counts}
            total={issues.length}
          />
        )}
        <IssueList
          issues={visible}
          totalCount={issues.length}
          selectedId={selected?.id ?? null}
          onSelect={setSelectedId}
          onResetFilters={resetFilters}
        />
      </div>
      <div className="issues-explorer__column">
        <IssueDetail issue={selected} code={originalCode} />
        <div className="code-panel">
          <p className="code-panel__title">Analyzed code</p>
          <CodeEditor
            value={originalCode}
            readOnly
            height={380}
            ariaLabel="Analyzed code with issue lines highlighted"
            decorations={decorations}
            revealLine={selected?.line ?? null}
          />
        </div>
      </div>
    </div>
  );
}
