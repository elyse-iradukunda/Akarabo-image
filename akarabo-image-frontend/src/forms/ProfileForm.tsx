import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/Button';
import { ErrorMessage, errorMessage } from '../components/ErrorMessage';
import { InputField } from '../ui/InputField';
import { useUpdateUser } from '../hooks/useUsers';
import { useRefreshProfile } from '../hooks/useAuth';
import type { User } from '../types/user';

export interface ProfileFormValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface ProfileFormProps {
  /** The account being edited — normally the signed-in user. */
  account: User;
  /** Called after the profile is saved. */
  onSuccess?: () => void;
}

/**
 * Lets the signed-in user update their own contact details and password.
 *
 * The backend only allows this for managers and the owner, so the screen
 * hides the form for the other roles.
 */
export function ProfileForm({ account, onSuccess }: ProfileFormProps) {
  const updateUser = useUpdateUser();
  const refreshProfile = useRefreshProfile();
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: account.fullName,
      email: account.email,
      phone: account.phone ?? '',
      password: '',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setServerError(undefined);
    setSaved(false);
    const password = values.password.trim();

    try {
      await updateUser.mutateAsync({
        id: account.id,
        payload: {
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim() || undefined,
          ...(password ? { password } : {}),
        },
      });

      // Keep the session (name, email) in sync with the new details.
      await refreshProfile();
      setSaved(true);
      onSuccess?.();
    } catch (error) {
      setServerError(errorMessage(error));
    }
  };

  const failure = updateUser.error ?? serverError;

  return (
    <form className="ak-form ak-form--compact" onSubmit={handleSubmit(onSubmit)} noValidate>
      {failure && (
        <div className="ak-mb-3">
          <ErrorMessage message={errorMessage(failure)} />
        </div>
      )}

      {saved && !failure && (
        <div className="ak-mb-3">
          <p className="ak-small" style={{ color: 'var(--color-success)' }}>
            Your profile has been updated.
          </p>
        </div>
      )}

      <InputField
        label="Full name"
        required
        placeholder="Akarabo Manager"
        {...register('fullName', {
          required: 'Full name is required.',
          maxLength: { value: 120, message: 'Name is too long.' },
        })}
        error={errors.fullName?.message}
      />

      <div className="ak-form__grid">
        <InputField
          label="Email address"
          type="email"
          required
          placeholder="manager@akarabo.rw"
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
          label="Phone number"
          type="tel"
          placeholder="+250788123456"
          {...register('phone', {
            pattern: {
              value: /^\+?[0-9][0-9\s-]{6,19}$/,
              message: 'Enter a valid phone number.',
            },
          })}
          error={errors.phone?.message}
        />
      </div>

      <InputField
        label="New password"
        type="password"
        autoComplete="new-password"
        placeholder="Leave blank to keep current"
        hint="Fill this in only when you want to change your password."
        {...register('password', {
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters.',
          },
          maxLength: {
            value: 72,
            message: 'Password must be at most 72 characters.',
          },
        })}
        error={errors.password?.message}
      />

      <div className="ak-form__actions">
        <Button type="submit" loading={isSubmitting}>
          Save profile
        </Button>
      </div>
    </form>
  );
}

export default ProfileForm;
