import type { ReactNode } from 'react';
import { CheckIcon, ErrorIcon, InfoIcon, WarningIcon } from '../assets';
import type { Tone } from '../types/ui';

export interface StatusMessageProps {
  /** Visual tone of the message. */
  tone?: Tone;
  /** Message body. */
  children: ReactNode;
}

/** Inline success / warning / info banner. */
export function StatusMessage({ tone = 'info', children }: StatusMessageProps) {
  const icon =
    tone === 'success' ? (
      <CheckIcon size={20} />
    ) : tone === 'danger' ? (
      <ErrorIcon size={20} />
    ) : tone === 'warning' ? (
      <WarningIcon size={20} />
    ) : (
      <InfoIcon size={20} />
    );

  return (
    <div className={`ak-alert ak-alert--${tone}`} role="status">
      {icon}
      <div className="ak-grow">{children}</div>
    </div>
  );
}

export default StatusMessage;
