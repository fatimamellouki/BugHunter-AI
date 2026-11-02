export const SEVERITY_LEVELS = ['critical', 'high', 'medium', 'low'];

export const ANALYSIS_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};

export const ERROR_KINDS = {
  VALIDATION: 'validation',
  NETWORK: 'network',
  TIMEOUT: 'timeout',
  UNPROCESSABLE: 'http_422',
  SERVER: 'server',
  HTTP: 'http',
  INVALID_RESPONSE: 'invalid_response',
};

export const EXAMPLE_CODE = `def calculate_average(numbers=[]):
    total = 0
    for number in numbers:
        total += number
    average = total / 0
    if average is 10:
        return average
        print('Average calculated')
    return average


def find_user(users, username):
    for user in users:
        if user['name'] is username:
            return user
    return None
`;
