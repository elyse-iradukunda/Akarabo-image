import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { InputField } from '../ui/InputField';
import { TextAreaField } from '../ui/TextAreaField';
import { useCreateCustomer, useUpdateCustomer } from '../hooks/useCustomers';
import { errorMessage } from '../components/ErrorMessage';
import type { Customer } from '../types/customer';

export interface CustomerFormValues {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface CustomerFormProps {
  /** When present the form edits this customer instead of creating one. */
  customer?: Customer;
  /** Called after a successful create or update. */
  onSuccess?: (customer: Customer) => void;
  /** Cancels the form. */
  onCancel?: () => void;
}

/** Registration / edit form for studio customers. */
export function CustomerForm({
  customer,
  onSuccess,
  onCancel,
}: CustomerFormProps) {
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const isEditing = Boolean(customer);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    defaultValues: {
      name: customer?.name ?? '',
      phone: customer?.phone ?? '',
      email: customer?.email ?? '',
      address: customer?.address ?? '',
      notes: customer?.notes ?? '',
    },
  });

  // Re-sync the form when the edited customer changes.
  useEffect(() => {
    reset({
      name: customer?.name ?? '',
      phone: customer?.phone ?? '',
      email: customer?.email ?? '',
      address: customer?.address ?? '',
      notes: customer?.notes ?? '',
    });
  }, [customer, reset]);

  const onSubmit = async (values: CustomerFormValues) => {
    const payload = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email?.trim() || undefined,
      address: values.address?.trim() || undefined,
      notes: values.notes?.trim() || undefined,
    };

    try {
      const result = customer
        ? await updateCustomer.mutateAsync({ id: customer.id, payload })
        : await createCustomer.mutateAsync(payload);
      onSuccess?.(result);
    } catch {
      // The mutation error is rendered below the form.
    }
  };

  const failure =
    createCustomer.error ?? updateCustomer.error;

  return (
    <form className="ak-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {failure && (
        <div className="ak-mb-3">
          <ErrorMessage message={errorMessage(failure)} />
        </div>
      )}

      <div className="ak-form__grid">
        <InputField
          label="Customer name"
          placeholder="Aline Uwase"
          required
          {...register('name', {
            required: 'Customer name is required.',
            maxLength: { value: 200, message: 'Name is too long.' },
          })}
          error={errors.name?.message}
        />

        <InputField
          label="Phone number"
          type="tel"
          placeholder="+250788111222"
          required
          {...register('phone', {
            required: 'Phone number is required.',
            maxLength: { value: 30, message: 'Phone number is too long.' },
          })}
          error={errors.phone?.message}
        />
      </div>

      <InputField
        label="Email address"
        type="email"
        placeholder="aline@example.rw"
        {...register('email', {
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Enter a valid email address.',
          },
        })}
        error={errors.email?.message}
      />

      <InputField
        label="Address"
        placeholder="KG 11 Ave, Kigali"
        {...register('address', {
          maxLength: { value: 300, message: 'Address is too long.' },
        })}
        error={errors.address?.message}
      />

      <TextAreaField
        label="Notes"
        rows={4}
        placeholder="Preferences, special requests, referral source…"
        {...register('notes', {
          maxLength: { value: 500, message: 'Notes are too long.' },
        })}
        error={errors.notes?.message}
      />

      <div className="ak-form__actions">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? 'Save changes' : 'Register customer'}
        </Button>
      </div>
    </form>
  );
}

export default CustomerForm;
