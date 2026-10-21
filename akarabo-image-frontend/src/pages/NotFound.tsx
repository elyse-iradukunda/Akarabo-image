import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../assets';
import { PageHeader } from '../components/PageHeader';

/** Shown when a route does not exist. */
export function NotFound() {
  const location = useLocation();

  return (
    <>
      <PageHeader
        title="Page not found"
        subtitle={`We could not find anything at ${location.pathname}.`}
      />

      <div className="ak-card">
        <div className="ak-card__body ak-center ak-stack ak-gap-3">
          <Logo size={64} color="#b3122f" />
          <p className="ak-strong" style={{ fontSize: 'var(--text-2xl)' }}>
            404
          </p>
          <p className="ak-small ak-muted">
            The page may have been moved, or the link might be out of date.
          </p>
          <div className="ak-row ak-gap-3 ak-mt-3">
            <Link to="/dashboard" className="ak-button ak-button--primary">
              Back to dashboard
            </Link>
            <Link to="/bookings" className="ak-button ak-button--secondary">
              View bookings
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFound;
