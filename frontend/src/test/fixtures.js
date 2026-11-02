// Backend-shaped payloads used by the tests. They follow the confirmed contract of POST /api/debug.

export const RAW_FULL_RESPONSE = {
  status: 'success',
  valid: true,
  issues: [
    { rule_id: 'PY_MUTABLE_DEFAULT', type: 'MutableDefaultArgument', line: 1, severity: 'medium', message: 'Mutable default argument.' },
    { rule_id: 'PY_DIV_ZERO', type: 'PotentialZeroDivision', line: 5, severity: 'high', message: 'Division by zero detected.' },
    { rule_id: 'PY_IS_COMPARE', type: 'SuspiciousIdentityComparison', line: 6, severity: 'medium', message: 'Identity comparison with a literal.' },
    { rule_id: 'PY_UNREACHABLE', type: 'UnreachableCode', line: 8, severity: 'low', message: 'Code after return is never executed.' },
  ],
  summary: '4 problem(s) detected.',
  ai_status: 'success',
  explanation: 'The function divides by zero and compares values with "is".',
  root_causes: ['Hard-coded zero divisor', 'Identity operator used instead of equality'],
  corrected_code: 'def calculate_average(numbers=None):\n    return 0\n',
  tests: ['import pytest\n\ndef test_one():\n    assert True', 'def test_two():\n    assert 1 == 1'],
  ai_error: null,
};

export const RAW_NO_ISSUES_RESPONSE = {
  ...RAW_FULL_RESPONSE,
  issues: [],
  summary: 'No problem detected.',
  explanation: 'Nothing suspicious.',
  root_causes: [],
  corrected_code: 'x = 1\n',
  tests: [],
};

export const RAW_AI_UNAVAILABLE_RESPONSE = {
  status: 'success',
  valid: true,
  issues: RAW_FULL_RESPONSE.issues.slice(0, 2),
  summary: '2 problem(s) detected.',
  ai_status: 'error',
  explanation: null,
  root_causes: [],
  corrected_code: null,
  tests: [],
  ai_error: 'LLM provider timeout',
};

export function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
