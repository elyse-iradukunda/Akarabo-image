import { ErrorIcon, RefreshIcon } from '../assets';
import { Button } from './Button';

export interface ErrorMessageProps {
  error?: unknown;
  message?: string;
  onRetry?: () => void;
}

export function errorMessage(error: unknown): string {
  if (!error) return 'Something went wrong.';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return 'Something went wrong.';
}

export function ErrorMessage({ error, message, onRetry }: ErrorMessageProps) {
  const text = message ?? errorMessage(error);

  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800" role="alert">
      <span className="shrink-0"><ErrorIcon size={18} /></span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium">{text}</p>
        {onRetry && (
          <div className="mt-3">
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
