import type { ReactNode } from 'react';
import { InboxIcon } from '../assets';

export interface EmptyStateProps {
  /** Icon shown above the message. */
  icon?: ReactNode;
  /** Short title. */
  title: string;
  /** Explanation shown under the title. */
  description?: string;
  /** Optional call to action. */
  action?: ReactNode;
}

/** Placeholder shown when a list has no rows. */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="ak-empty">
      <div className="ak-empty__icon">{icon ?? <InboxIcon size={40} />}</div>
      <p className="ak-empty__title">{title}</p>
      {description && <p className="ak-small">{description}</p>}
      {action && <div className="ak-mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;
