import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoadingBlock } from '../ui/LoadingBlock';
import type { Role } from '../types/auth';

export interface ProtectedRouteProps {
  /** The screen to render once the checks pass. */
  children: ReactNode;
  /** Roles allowed to open the route. Empty means "every signed-in user". */
  roles?: Role[];
}

/**
 * Route guard.
 *
 * Unauthenticated visitors are sent to the login page (remembering where they
 * wanted to go); authenticated users without the required role are sent to
 * the dashboard.
 */
export function ProtectedRoute({ children, roles = [] }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingBlock message="Checking your session…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles.length > 0 && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
