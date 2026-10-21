import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoginIcon } from '../assets';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { InputField } from '../ui/InputField';
import { useLogin } from '../hooks/useAuth';
import { errorMessage } from '../components/ErrorMessage';
import type { LoginCredentials } from '../types/auth';

type LoginFormValues = LoginCredentials;

/** Email + password form used by the login screen. */
export function LoginForm() {
  const login = useLogin();
  const [serverError, setServerError] = useState<string | undefined>();

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
    <form className="ak-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && (
        <div className="ak-mb-3">
          <ErrorMessage message={serverError} />
        </div>
      )}

      <InputField
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="owner@akarabo.rw"
        required
        {...register('email', {
          required: 'Email is required.',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Enter a valid email address.',
          },
        })}
        error={errors.email?.message}
      />

      <InputField
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        required
        {...register('password', {
          required: 'Password is required.',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters.',
          },
        })}
        error={errors.password?.message}
      />

      <Button
        type="submit"
        fullWidth
        loading={isSubmitting}
        icon={<LoginIcon size={18} />}
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}

export default LoginForm;
