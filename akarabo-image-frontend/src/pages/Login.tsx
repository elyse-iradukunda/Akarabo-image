import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Logo } from '../assets';
import { LoginForm } from '../forms/LoginForm';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  from?: string;
}

/** Sign-in screen — the only page reachable without a session. */
export function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  // Already signed in? Go straight to the intended page.
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(state?.from ?? '/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, state?.from]);

  if (isAuthenticated) {
    return <Navigate to={state?.from ?? '/dashboard'} replace />;
  }

  return (
    <div className="ak-auth">
      <div className="ak-auth__card">
        <div className="ak-auth__brand">
          <Logo size={52} color="#b3122f" />
          <h1 className="ak-auth__title">Akarabo Image</h1>
          <p className="ak-auth__subtitle">
            Studio management for bookings, customers and finances.
          </p>
        </div>

        <LoginForm />

        <div className="ak-auth__hint">
          <p>
            <strong>Demo account</strong>
          </p>
          <p className="ak-mt-2 ak-mono">owner@akarabo.rw</p>
          <p className="ak-mono">ChangeMe123!</p>
        </div>

        <p className="ak-auth__footer">
          Akarabo Image · Studio Manager
        </p>
      </div>
    </div>
  );
}

export default Login;
