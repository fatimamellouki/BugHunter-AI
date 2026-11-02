import { Search } from 'lucide-react';
import { SEVERITY_LEVELS } from '../../utils/constants';
import { formatSeverity } from '../../utils/formatters';

export default function IssueFilters({ severity, onSeverityChange, query, onQueryChange, counts, total }) {
  const options = [
    { value: 'all', label: 'All', count: total },
    ...SEVERITY_LEVELS.map((level) => ({ value: level, label: formatSeverity(level), count: counts[level] })),
  ];
  if (counts.unknown > 0) options.push({ value: 'unknown', label: 'Unknown', count: counts.unknown });

  return (
    <div className="issue-filters">
      <div className="chip-group" role="group" aria-label="Filter by severity">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`chip chip--${option.value}`}
            aria-pressed={severity === option.value}
            onClick={() => onSeverityChange(option.value)}
          >
            {option.label}
            <span className="chip__count">{option.count}</span>
          </button>
        ))}
      </div>
      <div className="search-field">
        <Search size={16} aria-hidden="true" />
        <label htmlFor="issue-search" className="visually-hidden">
          Search issues by type, rule ID or message
        </label>
        <input
          id="issue-search"
          type="search"
          placeholder="Search by type or rule ID"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
    </div>
  );
}
