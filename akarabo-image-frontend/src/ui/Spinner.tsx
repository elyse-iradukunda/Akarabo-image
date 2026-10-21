export interface SpinnerProps {
  /** Render a larger spinner. */
  large?: boolean;
  /** Accessible label announced to screen readers. */
  label?: string;
}

/** Pure-CSS loading indicator. */
export function Spinner({ large, label = 'Loading' }: SpinnerProps) {
  return (
    <span
      className={`ak-spinner${large ? ' ak-spinner--lg' : ''}`}
      role="status"
      aria-label={label}
    />
  );
}

export default Spinner;
