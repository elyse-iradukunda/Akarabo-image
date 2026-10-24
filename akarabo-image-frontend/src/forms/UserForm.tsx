import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/Button';
import { ErrorMessage, errorMessage } from '../components/ErrorMessage';
import { InputField } from '../ui/InputField';
import { SelectField } from '../ui/SelectField';
import { useCreateUser, useUpdateUser } from '../hooks/useUsers';
import { roleOptions } from '../data/constants';
import type { Role } from '../types/auth';
import type { User } from '../types/user';

export interface UserFormValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
}

export interface UserFormProps {
  /** When present the form edits this staff account. */
  user?: User;
  /**
   * Roles the actor may assign. Defaults to every role — the backend only
   * lets the owner hand out the owner role.
   */
  availableRoles?: Role[];
  /** Called after a successful create or update. */
  onSuccess?: (user: User) => void;
  /** Cancels the form. */
  onCancel?: () => void;
}

/** Create / edit form for staff accounts. */
export function UserForm({
  user,
  availableRoles,
  onSuccess,
  onCancel,
}: UserFormProps) {
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const isEditing = Boolean(user);
  const [serverError, setServerError] = useState<string | undefined>();

  const roleChoices = availableRoles
    ? roleOptions.filter((option) => availableRoles.includes(option.value))
    : roleOptions;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    defaultValues: {
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      password: '',
      role: user?.role ?? 'PHOTOGRAPHER',
    },
  });

  useEffect(() => {
    reset({
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      password: '',
      role: user?.role ?? 'PHOTOGRAPHER',
    });
  }, [user, reset]);

  const onSubmit = async (values: UserFormValues) => {
    setServerError(undefined);
    const password = values.password.trim();

    try {
      if (user) {
        const result = await updateUser.mutateAsync({
          id: user.id,
          payload: {
            fullName: values.fullName.trim(),
            email: values.email.trim(),
            phone: values.phone.trim() || undefined,
            role: values.role,
            ...(password ? { password } : {}),
          },
        });
        onSuccess?.(result);
      } else {
        const result = await createUser.mutateAsync({
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim() || undefined,
          password,
          role: values.role,
        });
        onSuccess?.(result);
      }
    } catch (error) {
      setServerError(errorMessage(error));
    }
  };

  const failure = createUser.error ?? updateUser.error ?? serverError;

  return (
    <form className="ak-form ak-form--compact" onSubmit={handleSubmit(onSubmit)} noValidate>
      {failure && (
        <div className="ak-mb-3">
          <ErrorMessage message={errorMessage(failure)} />
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

      <div className="ak-form__grid">
        <SelectField
          label="Role"
          required
          options={roleChoices}
          {...register('role', { required: 'Choose a role.' })}
          error={errors.role?.message}
        />

        <InputField
          label={isEditing ? 'New password' : 'Password'}
          type="password"
          autoComplete="new-password"
          required={!isEditing}
          placeholder={isEditing ? 'Leave blank to keep current' : 'S3cret!Pass'}
          hint={isEditing ? 'Only fill this in to reset the password.' : undefined}
          {...register('password', {
            required: isEditing ? false : 'Password is required.',
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
      </div>

      <div className="ak-form__actions">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? 'Save changes' : 'Create staff account'}
        </Button>
      </div>
    </form>
  );
}

export default UserForm;
