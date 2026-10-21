import type { ReactNode } from 'react';

export interface StatCardProps {
  /** Small caption above the value. */
  label: string;
  /** The main number or short text. */
  value: ReactNode;
  /** Optional supporting line under the value. */
  meta?: ReactNode;
  /** Optional icon rendered in the corner. */
  icon?: ReactNode;
}

/** Single metric tile used on the dashboard. */
export function StatCard({ label, value, meta, icon }: StatCardProps) {
  return (
    <article className="ak-stat">
      <div className="ak-row ak-between ak-items-start">
        <p className="ak-stat__label">{label}</p>
        {icon && <span className="ak-subtle">{icon}</span>}
      </div>
      <p className="ak-stat__value">{value}</p>
      {meta && <p className="ak-stat__meta">{meta}</p>}
    </article>
  );
}

export default StatCard;
