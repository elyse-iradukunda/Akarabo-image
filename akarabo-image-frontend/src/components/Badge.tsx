import type { ReactNode } from 'react';
import type { Tone } from '../types/ui';

export interface BadgeProps {
  /** Visual tone. */
  tone?: Tone;
  /** Badge content. */
  children: ReactNode;
  /** Optional leading dot. */
  dot?: boolean;
}

/** Small coloured pill used for statuses and roles. */
export function Badge({ tone = 'neutral', children, dot }: BadgeProps) {
  return (
    <span className={`ak-badge ak-badge--${tone}`}>
      {dot && (
        <span
          aria-hidden="true"
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'currentColor',
            display: 'inline-block',
          }}
        />
      )}
      {children}
    </span>
  );
}

export default Badge;
