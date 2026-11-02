import {
  countBySeverity,
  filterIssues,
  formatAiStatus,
  formatLine,
  formatSeverity,
  formatValidity,
  normalizeSeverity,
  pluralize,
  sortIssues,
} from './formatters';

const issues = [
  { id: 'a', ruleId: 'PY_LOW', type: 'Style', line: 9, severity: 'low', message: 'Minor' },
  { id: 'b', ruleId: 'PY_DIV_ZERO', type: 'PotentialZeroDivision', line: 5, severity: 'high', message: 'Division by zero' },
  { id: 'c', ruleId: 'PY_X', type: 'Weird', line: null, severity: 'unknown', message: '' },
  { id: 'd', ruleId: 'PY_MED', type: 'Mutable', line: 1, severity: 'medium', message: 'Default arg' },
  { id: 'e', ruleId: 'PY_CRIT', type: 'Injection', line: 3, severity: 'critical', message: 'Dangerous' },
];

describe('severity helpers', () => {
  it('normalizes known severities regardless of case', () => {
    expect(normalizeSeverity('HIGH')).toBe('high');
    expect(normalizeSeverity(' medium ')).toBe('medium');
  });

  it('maps anything else to unknown instead of inventing a level', () => {
    expect(normalizeSeverity('blocker')).toBe('unknown');
    expect(normalizeSeverity(undefined)).toBe('unknown');
    expect(formatSeverity('blocker')).toBe('Unknown');
  });

  it('formats labels', () => {
    expect(formatSeverity('critical')).toBe('Critical');
    expect(formatSeverity('low')).toBe('Low');
  });

  it('counts issues per severity', () => {
    expect(countBySeverity(issues)).toEqual({ critical: 1, high: 1, medium: 1, low: 1, unknown: 1 });
  });
});

describe('sortIssues', () => {
  it('orders by severity, then by line, with unknown last and without mutating the input', () => {
    const snapshot = [...issues];
    expect(sortIssues(issues).map((issue) => issue.id)).toEqual(['e', 'b', 'd', 'a', 'c']);
    expect(issues).toEqual(snapshot);
  });
});

describe('filterIssues', () => {
  it('returns everything by default', () => {
    expect(filterIssues(issues)).toHaveLength(5);
  });

  it('filters by severity', () => {
    expect(filterIssues(issues, { severity: 'high' }).map((i) => i.id)).toEqual(['b']);
  });

  it('searches type, rule id and message case-insensitively', () => {
    expect(filterIssues(issues, { query: 'zerodivision' }).map((i) => i.id)).toEqual(['b']);
    expect(filterIssues(issues, { query: 'py_med' }).map((i) => i.id)).toEqual(['d']);
    expect(filterIssues(issues, { query: 'DANGEROUS' }).map((i) => i.id)).toEqual(['e']);
  });

  it('combines severity and search', () => {
    expect(filterIssues(issues, { severity: 'low', query: 'zero' })).toEqual([]);
  });
});

describe('text formatters', () => {
  it('formats lines, validity, AI status and plurals', () => {
    expect(formatLine(5)).toBe('Line 5');
    expect(formatLine(null)).toBe('Line unknown');
    expect(formatValidity(true)).toBe('Valid syntax');
    expect(formatValidity(false)).toBe('Invalid syntax');
    expect(formatValidity(null)).toBe('Unknown');
    expect(formatAiStatus('success')).toBe('Completed');
    expect(formatAiStatus('error')).toBe('Error');
    expect(formatAiStatus(null)).toBe('Unknown');
    expect(pluralize(1, 'issue')).toBe('1 issue');
    expect(pluralize(3, 'issue')).toBe('3 issues');
  });
});
