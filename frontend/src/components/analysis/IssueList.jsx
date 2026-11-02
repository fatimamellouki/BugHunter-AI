import { SearchX, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import IssueCard from './IssueCard';

export default function IssueList({ issues, totalCount, selectedId, onSelect, onResetFilters }) {
  if (totalCount === 0) {
    return (
      <EmptyState icon={ShieldCheck} tone="success" title="No issue detected by static analysis">
        The rules did not flag anything in this code. That does not prove the code is free of bugs.
      </EmptyState>
    );
  }
  if (issues.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No issue matches these filters"
        action={<Button onClick={onResetFilters}>Reset filters</Button>}
      >
        {totalCount} issues are hidden by the current severity filter or search.
      </EmptyState>
    );
  }
  return (
    <ul className="issue-list" aria-label="Detected issues">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} selected={issue.id === selectedId} onSelect={onSelect} />
      ))}
    </ul>
  );
}
