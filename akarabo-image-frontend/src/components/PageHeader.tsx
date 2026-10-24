import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { Crumb } from '../types/ui';

export interface PageHeaderProps {
  /** Page title. */
  title: string;
  /** Optional supporting line under the title. */
  subtitle?: string;
  /** Action buttons rendered on the right. */
  actions?: ReactNode;
  /** Optional breadcrumb trail above the title. */
  crumbs?: Crumb[];
}

/** Consistent header used at the top of every screen. */
export function PageHeader({
  title,
  subtitle,
  actions,
  crumbs,
}: PageHeaderProps) {
  return (
    <header className="ak-page-header">
      <div>
        {crumbs && crumbs.length > 0 && (
          <nav className="ak-breadcrumbs" aria-label="Breadcrumb">
            {crumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} className="ak-row ak-gap-2">
                {crumb.to ? (
                  <Link to={crumb.to}>{crumb.label}</Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
                {index < crumbs.length - 1 && <span aria-hidden="true">/</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className="ak-page-header__title">{title}</h1>
        {subtitle && <p className="ak-page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="ak-page-header__actions">{actions}</div>}
    </header>
  );
}

export default PageHeader;
