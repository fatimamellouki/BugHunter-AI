// Illustrative data for the landing page demo. It mirrors the shape of the real report
// (rule id, type, line, severity) but nothing here is returned by the backend.
export const DEMO_SOURCE = [
  'def calculate_average(numbers=[]):',
  '    total = 0',
  '    for number in numbers:',
  '        total += number',
  '    average = total / 0',
  '    if average is 10:',
  '        return average',
  "        print('Average calculated')",
];

export const DEMO_FIX = [
  'def calculate_average(numbers=None):',
  '    numbers = numbers or []',
  '    total = 0',
  '    for number in numbers:',
  '        total += number',
  '    if not numbers:',
  '        return 0',
  '    return total / len(numbers)',
];

export const DEMO_FIX_CHANGED = [1, 2, 6, 7, 8];

export const DEMO_FINDINGS = [
  { rule: 'PY_MUTABLE_DEFAULT', type: 'MutableDefaultArgument', line: 1, severity: 'medium', message: 'Mutable default argument.' },
  { rule: 'PY_DIV_ZERO', type: 'PotentialZeroDivision', line: 5, severity: 'high', message: 'Division by zero detected.' },
  { rule: 'PY_IS_COMPARE', type: 'SuspiciousIdentityComparison', line: 6, severity: 'medium', message: 'Identity comparison with a literal.' },
  { rule: 'PY_UNREACHABLE', type: 'UnreachableCode', line: 8, severity: 'low', message: 'Code after return is never executed.' },
];

export const DEMO_STEPS = [
  { label: 'Static analysis', text: 'Rules look for known bug patterns, line by line.' },
  { label: 'AI review', text: 'Explanation, root causes, a proposed fix and tests.' },
];
