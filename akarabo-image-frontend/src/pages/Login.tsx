import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Logo } from '../assets';
import { LoginForm } from '../forms/LoginForm';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  from?: string;
}

export function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(state?.from ?? '/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, state?.from]);

  if (isAuthenticated) {
    return <Navigate to={state?.from ?? '/dashboard'} replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-gray-800 sm:p-6">
      <section className="w-full max-w-xs rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/70 sm:p-8">
            <Link to="/" className="mb-7 inline-flex items-center gap-2.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"><Logo size={30} color="#5ca832" /><span className="text-sm font-semibold tracking-tight text-gray-900">Akarabo Image</span></Link>
            <h1 className="text-xl font-semibold tracking-tight text-gray-900">Welcome Back</h1>
            <p className="mt-1 text-xs text-gray-500">Please login to your account</p>
            <LoginForm />
      </section>
    </main>
  );
}

export default Login;
