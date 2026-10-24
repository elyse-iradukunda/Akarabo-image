import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../components/Button';
import { ErrorMessage, errorMessage } from '../components/ErrorMessage';
import { InputField } from '../ui/InputField';
import { useLogin } from '../hooks/useAuth';
import type { LoginCredentials } from '../types/auth';

type LoginFormValues = LoginCredentials;

export function LoginForm() {
  const login = useLogin();
  const [serverError, setServerError] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(undefined);
    try {
      await login(values);
    } catch (error) {
      setServerError(errorMessage(error));
    }
  };

  return (
    <form className="mt-6 space-y-3.5" onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && <ErrorMessage message={serverError} />}

      <InputField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="Enter your email"
        required
        {...register('email', {
          required: 'Email is required.',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Enter a valid email address.',
          },
        })}
        error={errors.email?.message}
        className="h-9 rounded-md bg-gray-100 px-3 text-xs placeholder:text-gray-400 focus:bg-white"
      />

      <InputField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        placeholder="Enter your password"
        required
        {...register('password', {
          required: 'Password is required.',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters.',
          },
        })}
        error={errors.password?.message}
        className="h-9 rounded-md bg-gray-100 px-3 pr-10 text-xs placeholder:text-gray-400 focus:bg-white"
        trailingAction={(
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute inset-y-0 right-0 flex w-9 items-center justify-center rounded-r-md text-gray-400 transition hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" /><path d="M9.9 5.2A10.9 10.9 0 0112 5c5 0 8.5 4.2 9.5 7-.3.9-1.1 2.1-2.3 3.3M6.2 6.2C3.9 7.7 2.8 9.8 2.5 12c.6 1.7 2.1 3.7 4.5 5.1A10 10 0 0012 19c1 0 2-.2 2.9-.5" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M2.5 12s3.3-7 9.5-7 9.5 7 9.5 7-3.3 7-9.5 7-9.5-7-9.5-7z" /><circle cx="12" cy="12" r="2.5" /></svg>
            )}
          </button>
        )}
      />

      <div className="flex justify-end">
        <Link to="/forgot-password" className="text-xs font-medium text-brand transition hover:text-brand-dark focus:outline-none focus-visible:underline">Forgot Password?</Link>
      </div>

      <Button type="submit" fullWidth loading={isSubmitting} className="h-9 rounded-md text-xs">
        {isSubmitting ? 'Signing in…' : 'Login'}
      </Button>

      <div className="flex items-center gap-3 py-1 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />
        <span>or Login with</span>
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-gray-200 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-600" aria-hidden="true" fill="currentColor"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.2 10.13 24v-8.44H7.08v-3.49h3.05V9.4c0-3.04 1.79-4.73 4.55-4.73 1.32 0 2.7.24 2.7.24v2.98h-1.52c-1.5 0-1.97.94-1.97 1.9v2.28h3.35l-.54 3.49h-2.81V24C19.61 23.2 24 18.1 24 12.07" /></svg>
          Facebook
        </button>
        <button type="button" className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-gray-200 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.27c0-.78-.07-1.53-.2-2.27H12v4.3h6.44a5.5 5.5 0 01-2.39 3.61v2.96h3.87c2.27-2.09 3.58-5.17 3.58-8.6z" /><path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.95-2.93l-3.87-2.96c-1.08.72-2.46 1.15-4.08 1.15-3.14 0-5.8-2.12-6.75-4.97H1.25v3.05A12 12 0 0012 24z" /><path fill="#FBBC05" d="M5.25 14.29a7.2 7.2 0 010-4.58V6.66h-4a12 12 0 000 10.68l4-3.05z" /><path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.59 1.8L20.03 3.1A11.94 11.94 0 0012 0 12 12 0 001.25 6.66l4 3.05C6.2 6.87 8.86 4.75 12 4.75z" /></svg>
          Google
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
