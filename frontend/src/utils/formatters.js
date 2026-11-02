import { SEVERITY_LEVELS } from './constants';

const SEVERITY_LABELS = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  unknown: 'Unknown',
};

export function normalizeSeverity(value) {
  const key = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return SEVERITY_LEVELS.includes(key) ? key : 'unknown';
}

export function formatSeverity(value) {
  return SEVERITY_LABELS[normalizeSeverity(value)];
}

export function countBySeverity(issues) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0, unknown: 0 };
  issues.forEach((issue) => {
    counts[normalizeSeverity(issue.severity)] += 1;
  });
  return counts;
}

function severityRank(severity) {
  const index = SEVERITY_LEVELS.indexOf(normalizeSeverity(severity));
  return index === -1 ? SEVERITY_LEVELS.length : index;
}

/** Most severe first, then by line number (unknown lines last). */
export function sortIssues(issues) {
  return [...issues].sort((a, b) => {
    const bySeverity = severityRank(a.severity) - severityRank(b.severity);
    if (bySeverity !== 0) return bySeverity;
    return (a.line ?? Infinity) - (b.line ?? Infinity);
  });
}

export function filterIssues(issues, { severity = 'all', query = '' } = {}) {
  const needle = query.trim().toLowerCase();
  return issues.filter((issue) => {
    if (severity !== 'all' && normalizeSeverity(issue.severity) !== severity) return false;
    if (!needle) return true;
    return [issue.type, issue.ruleId, issue.message].some((field) =>
      String(field ?? '').toLowerCase().includes(needle),
    );
  });
}

export function formatLine(line) {
  return line == null ? 'Line unknown' : `Line ${line}`;
}

export function formatAiStatus(aiStatus) {
  if (!aiStatus) return 'Unknown';
  if (aiStatus === 'success') return 'Completed';
  return aiStatus.charAt(0).toUpperCase() + aiStatus.slice(1);
}

export function formatValidity(valid) {
  if (valid === true) return 'Valid syntax';
  if (valid === false) return 'Invalid syntax';
  return 'Unknown';
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
