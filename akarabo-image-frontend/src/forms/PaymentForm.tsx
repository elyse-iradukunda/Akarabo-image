import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/Button';
import { ErrorMessage, errorMessage } from '../components/ErrorMessage';
import { InputField } from '../ui/InputField';
import { SelectField } from '../ui/SelectField';
import { TextAreaField } from '../ui/TextAreaField';
import { useCreatePayment } from '../hooks/usePayments';
import { paymentMethodOptions, DEFAULT_CURRENCY } from '../data/constants';
import type { PaymentMethod } from '../types/payment';
import type { Booking } from '../types/booking';

export interface PaymentFormValues {
  bookingId: string;
  amount: string;
  currency: string;
  method: PaymentMethod;
  reference: string;
  notes: string;
}

export interface PaymentFormProps {
  /** Bookings the money can be attached to. */
  bookings?: Booking[];
  /** Called after the payment is recorded. */
  onSuccess?: () => void;
  /** Cancels the form. */
  onCancel?: () => void;
}

/** Form used to record money received by the studio. */
export function PaymentForm({
  bookings = [],
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const createPayment = useCreatePayment();
  const [serverError, setServerError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormValues>({
    defaultValues: {
      bookingId: '',
      amount: '',
      currency: DEFAULT_CURRENCY,
      method: 'MOBILE_MONEY',
      reference: '',
      notes: '',
    },
  });

  const onSubmit = async (values: PaymentFormValues) => {
    setServerError(undefined);
    try {
      await createPayment.mutateAsync({
        bookingId: values.bookingId || undefined,
        amount: Number(values.amount),
        currency: values.currency.trim() || DEFAULT_CURRENCY,
        method: values.method,
        reference: values.reference?.trim() || undefined,
        notes: values.notes?.trim() || undefined,
      });
      onSuccess?.();
    } catch (error) {
      setServerError(errorMessage(error));
    }
  };

  const failure = createPayment.error ?? serverError;

  return (
    <form className="ak-form ak-form--compact ak-form--finance" onSubmit={handleSubmit(onSubmit)} noValidate>
      {failure && (
        <div className="ak-mb-3">
          <ErrorMessage message={errorMessage(failure)} />
        </div>
      )}

      <SelectField
        label="Booking (optional)"
        placeholder="Not linked to a booking"
        options={bookings.map((booking) => ({
          value: booking.id,
          label: `${booking.eventDate} · ${booking.venue}`,
        }))}
        {...register('bookingId')}
        error={errors.bookingId?.message}
      />

      <div className="ak-form__grid">
        <InputField
          label="Amount received"
          type="number"
          min={0.01}
          step={0.01}
          required
          placeholder="150000"
          {...register('amount', {
            required: 'Enter the amount received.',
            validate: (value) => {
              const parsed = Number(value);
              if (Number.isNaN(parsed) || parsed <= 0) {
                return 'Amount must be greater than zero.';
              }
              return true;
            },
          })}
          error={errors.amount?.message}
        />

        <InputField
          label="Currency"
          required
          maxLength={3}
          {...register('currency', {
            required: 'Currency is required.',
            minLength: { value: 3, message: 'Use a 3-letter code (RWF).' },
            maxLength: { value: 3, message: 'Use a 3-letter code (RWF).' },
          })}
          error={errors.currency?.message}
        />
      </div>

      <SelectField
        label="Payment method"
        required
        options={paymentMethodOptions}
        {...register('method', { required: 'Choose a payment method.' })}
        error={errors.method?.message}
      />

      <InputField
        label="Reference"
        placeholder="MP240115.1234.A1234"
        hint="Receipt or mobile-money transaction id — must be unique."
        {...register('reference', {
          maxLength: { value: 120, message: 'Reference is too long.' },
        })}
        error={errors.reference?.message}
      />

      <TextAreaField
        label="Notes"
        rows={3}
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
          Record payment
        </Button>
      </div>
    </form>
  );
}

export default PaymentForm;
