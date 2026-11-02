import { RotateCcw } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';
import { ERROR_KINDS } from '../../utils/constants';
import Button from './Button';
import Notice from './Notice';

const COPY = {
  [ERROR_KINDS.VALIDATION]: { title: 'Nothing to analyze', hint: null },
  [ERROR_KINDS.NETWORK]: {
    title: 'Backend unreachable',
    hint: `Check that FastAPI is running on ${API_BASE_URL} and that its CORS settings allow this page's origin.`,
  },
  [ERROR_KINDS.TIMEOUT]: {
    title: 'The analysis timed out',
    hint: 'Try again, or analyze a shorter piece of code.',
  },
  [ERROR_KINDS.UNPROCESSABLE]: {
    title: 'The backend rejected the request',
    hint: 'The code was sent but not accepted. Check the request format in the backend docs.',
  },
  [ERROR_KINDS.SERVER]: {
    title: 'The backend hit an error',
    hint: 'Look at the FastAPI terminal for the stack trace, then try again.',
  },
  [ERROR_KINDS.HTTP]: { title: 'Unexpected backend answer', hint: null },
  [ERROR_KINDS.INVALID_RESPONSE]: {
    title: 'The response could not be read',
    hint: 'The backend answered, but not with the expected JSON.',
  },
};

export default function ErrorMessage({ error, onRetry }) {
  if (!error) return null;
  const { title, hint } = COPY[error.kind] ?? { title: 'Something went wrong', hint: null };
  const canRetry = onRetry && error.kind !== ERROR_KINDS.VALIDATION;
  return (
    <Notice
      variant="error"
      title={title}
      actions={
        canRetry && (
          <Button icon={RotateCcw} onClick={onRetry}>
            Try again
          </Button>
        )
      }
    >
      <p>{error.message}</p>
      {hint && <p className="notice__hint">{hint}</p>}
    </Notice>
  );
}
