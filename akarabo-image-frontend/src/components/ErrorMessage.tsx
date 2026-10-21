import { ErrorIcon, RefreshIcon } from '../assets';
import { Button } from './Button';

export interface ErrorMessageProps {
  /** The error to display. */
  error?: unknown;
  /** Overrides the message derived from the error. */
  message?: string;
  /** Shows a retry button. */
  onRetry?: () => void;
}

/** Turns any thrown value into a readable sentence. */
export function errorMessage(error: unknown): string {
  if (!error) return 'Something went wrong.';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return 'Something went wrong.';
}

/** Inline error panel with an optional retry action. */
export function ErrorMessage({ error, message, onRetry }: ErrorMessageProps) {
  const text = message ?? errorMessage(error);

  return (
    <div className="ak-alert ak-alert--danger" role="alert">
      <ErrorIcon size={20} />
      <div className="ak-grow">
        <p className="ak-strong">{text}</p>
        {onRetry && (
          <div className="ak-mt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={onRetry}
              icon={<RefreshIcon size={16} />}
            >
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
