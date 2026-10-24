import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { InputField } from '../ui/InputField';
import { TextAreaField } from '../ui/TextAreaField';
import { useCreateCustomer, useUpdateCustomer } from '../hooks/useCustomers';
import { useCreatePayment } from '../hooks/usePayments';
import { errorMessage } from '../components/ErrorMessage';
import { axiosInstance } from '../util/axiosInstance';
import { todayIso } from '../util/formatters';
import type { Customer } from '../types/customer';
import { useAuth } from '../context/AuthContext';

export interface CustomerFormValues {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  recordVisit: boolean;
  serviceDate: string;
  photosTaken?: number;
  softPhotos?: number;
  hardPhotos?: number;
  totalAmount?: number;
  needsUrgentService: boolean;
  initialPaidAmount?: number;
  paymentMethod: 'CASH' | 'MOBILE_MONEY' | 'CARD' | 'BANK_TRANSFER';
  paymentReference?: string;
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
  const { user } = useAuth();
  const isPhotographer = user?.role === 'PHOTOGRAPHER';
  const updateCustomer = useUpdateCustomer();
  const createPayment = useCreatePayment();
  const queryClient = useQueryClient();
  const isEditing = Boolean(customer);
  const [savedCustomer, setSavedCustomer] = useState<Customer | null>(null);
  const [savedStudioServiceId, setSavedStudioServiceId] = useState<string | null>(null);
  const [visitError, setVisitError] = useState<unknown>();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    defaultValues: {
      name: customer?.name ?? '',
      phone: customer?.phone ?? '',
      email: customer?.email ?? '',
      address: customer?.address ?? '',
      notes: customer?.notes ?? '',
      recordVisit: !customer,
      serviceDate: todayIso(),
      totalAmount: isPhotographer ? 0 : undefined,
      needsUrgentService: false,
      initialPaidAmount: 0,
      paymentMethod: 'CASH',
      paymentReference: '',
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
      recordVisit: !customer,
      serviceDate: todayIso(),
      totalAmount: isPhotographer ? 0 : undefined,
      needsUrgentService: false,
      initialPaidAmount: 0,
      paymentMethod: 'CASH',
      paymentReference: '',
    });
  }, [customer, reset]);

  const onSubmit = async (values: CustomerFormValues) => {
    setVisitError(undefined);
    let createdCustomer: Customer | null = savedCustomer;
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
        : savedCustomer ?? await createCustomer.mutateAsync(payload);

      if (!customer && !savedCustomer) {
        createdCustomer = result;
        setSavedCustomer(result);
      }
      if (!customer && values.recordVisit) {
        let serviceId = savedStudioServiceId;
        if (!serviceId) {
          const response = await axiosInstance.post<{ id: string }>('/studio-services', {
            customerId: result.id,
            serviceDate: values.serviceDate,
            photosTaken: Number(values.photosTaken),
            softPhotos: Number(values.softPhotos),
            hardPhotos: Number(values.hardPhotos),
            totalAmount: isPhotographer ? 0 : Number(values.totalAmount),
            needsUrgentService: values.needsUrgentService,
          });
          serviceId = response.data.id;
          setSavedStudioServiceId(serviceId);
        }
        if (Number(values.initialPaidAmount) > 0) {
          await createPayment.mutateAsync({ studioServiceId: serviceId, amount: Number(values.initialPaidAmount), method: values.paymentMethod, reference: values.paymentReference?.trim() || undefined });
        }
        await queryClient.invalidateQueries({ queryKey: ['studio-reports'] });
      }
      onSuccess?.(result);
    } catch (error) {
      // The mutation error is rendered below the form.
      if (createdCustomer) {
        setSavedCustomer(createdCustomer);
        setVisitError(error);
      }
    }
  };

  const failure =
    visitError ?? createCustomer.error ?? updateCustomer.error;
  const recordVisit = watch('recordVisit');
  const agreedAmount = watch('totalAmount');
  const customerLocked = Boolean(savedCustomer);

  return (
    <form className="ak-form ak-form--compact" onSubmit={handleSubmit(onSubmit)} noValidate>
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
          disabled={customerLocked}
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
          disabled={customerLocked}
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
        disabled={customerLocked}
      />

      <InputField
        label="Address"
        placeholder="KG 11 Ave, Kigali"
        {...register('address', {
          maxLength: { value: 300, message: 'Address is too long.' },
        })}
        error={errors.address?.message}
        disabled={customerLocked}
      />

      <TextAreaField
        label="Notes"
        rows={4}
        placeholder="Preferences, special requests, referral source…"
        {...register('notes', {
          maxLength: { value: 500, message: 'Notes are too long.' },
        })}
        error={errors.notes?.message}
        disabled={customerLocked}
      />

      {!isEditing && (
        <section className="ak-card" aria-labelledby="visit-details-title">
          <div className="ak-card__body">
          <label className="ak-row ak-gap-2 ak-small ak-strong">
            <input type="checkbox" {...register('recordVisit')} />
            Add today’s studio visit to this customer
          </label>
          {recordVisit && (
            <div className="ak-mt-4 ak-stack ak-gap-4">
              <h3 id="visit-details-title" className="ak-small ak-strong">Studio visit details</h3>
              <div className="ak-form__grid">
                <InputField label="Service date" type="date" required {...register('serviceDate', { required: recordVisit ? 'Service date is required.' : false })} error={errors.serviceDate?.message} />
                <InputField label="Photos taken" type="number" min="0" required {...register('photosTaken', { required: recordVisit ? 'Photo count is required.' : false, valueAsNumber: true, min: { value: 0, message: 'Enter zero or more.' } })} error={errors.photosTaken?.message} />
                <InputField label="Soft photos" type="number" min="0" required {...register('softPhotos', { required: recordVisit ? 'Soft photo count is required.' : false, valueAsNumber: true, min: { value: 0, message: 'Enter zero or more.' } })} error={errors.softPhotos?.message} />
                <InputField label="Hard photos" type="number" min="0" required {...register('hardPhotos', { required: recordVisit ? 'Hard photo count is required.' : false, valueAsNumber: true, min: { value: 0, message: 'Enter zero or more.' } })} error={errors.hardPhotos?.message} />
              </div>
              {!isPhotographer && <InputField label="Agreed total (RWF)" type="number" min="0" step="0.01" required {...register('totalAmount', { required: recordVisit ? 'Agreed total is required.' : false, valueAsNumber: true, min: { value: 0, message: 'Enter zero or more.' } })} error={errors.totalAmount?.message} />}
              {!isPhotographer && <>
              <div className="ak-form__grid">
                <InputField label="Amount paid now (RWF)" type="number" min="0" step="0.01" {...register('initialPaidAmount', { valueAsNumber: true, min: { value: 0, message: 'Enter zero or more.' }, validate: (value) => !value || Number(value) <= Number(agreedAmount || 0) || 'Payment cannot exceed the agreed total.' })} error={errors.initialPaidAmount?.message} />
                <label className="ak-field"><span className="ak-field__label">Payment method</span><select className="ak-select" {...register('paymentMethod')}><option value="CASH">Cash</option><option value="MOBILE_MONEY">Mobile money</option><option value="CARD">Card</option><option value="BANK_TRANSFER">Bank transfer</option></select></label>
              </div>
              {Number(watch('initialPaidAmount')) > 0 && <InputField label="Payment reference (optional)" {...register('paymentReference', { maxLength: { value: 120, message: 'Reference is too long.' } })} error={errors.paymentReference?.message} />}
              </>}
              <label className="ak-row ak-gap-2 ak-small">
                <input type="checkbox" {...register('needsUrgentService')} />
                Add this customer to the ASAP service queue
              </label>
            </div>
          )}
          {savedCustomer && <p className="ak-field__hint ak-mt-3">Customer details are saved. Submit again to retry saving the visit.</p>}
          </div>
        </section>
      )}

      <div className="ak-form__actions">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? 'Save changes' : savedCustomer ? 'Retry visit details' : 'Register customer'}
        </Button>
      </div>
    </form>
  );
}

export default CustomerForm;
