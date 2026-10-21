import { Spinner } from './Spinner';

export interface LoadingBlockProps {
  /** Message shown under the spinner. */
  message?: string;
}

/** Full-width loading placeholder for list screens. */
export function LoadingBlock({ message = 'Loading…' }: LoadingBlockProps) {
  return (
    <div className="ak-loading-block">
      <Spinner large />
      <span className="ak-small">{message}</span>
    </div>
  );
}

export default LoadingBlock;
