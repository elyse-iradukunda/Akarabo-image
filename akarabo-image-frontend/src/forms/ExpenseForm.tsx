import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/Button';
import { ErrorMessage, errorMessage } from '../components/ErrorMessage';
import { DateField } from '../ui/DateField';
import { InputField } from '../ui/InputField';
import { SelectField } from '../ui/SelectField';
import { useCreateExpense } from '../hooks/useExpenses';
import { DEFAULT_CURRENCY, expenseCategoryOptions } from '../data/constants';
import { todayIso } from '../util/formatters';
import type { ExpenseCategory } from '../types/expense';

export interface ExpenseFormValues {
  category: ExpenseCategory;
  amount: string;
  currency: string;
  description: string;
  expenseDate: string;
}

export interface ExpenseFormProps {
  /** Called after the expense is recorded. */
  onSuccess?: () => void;
  /** Cancels the form. */
  onCancel?: () => void;
}

/** Form used to record studio spending. */
export function ExpenseForm({ onSuccess, onCancel }: ExpenseFormProps) {
  const createExpense = useCreateExpense();
  const [serverError, setServerError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues>({
    defaultValues: {
      category: 'TRANSPORT',
      amount: '',
      currency: DEFAULT_CURRENCY,
      description: '',
      expenseDate: todayIso(),
    },
  });

  const onSubmit = async (values: ExpenseFormValues) => {
    setServerError(undefined);
    try {
      await createExpense.mutateAsync({
        category: values.category,
        amount: Number(values.amount),
        currency: values.currency.trim() || DEFAULT_CURRENCY,
        description: values.description.trim(),
        expenseDate: values.expenseDate
          ? new Date(`${values.expenseDate}T00:00:00`).toISOString()
          : undefined,
      });
      onSuccess?.();
    } catch (error) {
      setServerError(errorMessage(error));
    }
  };

  const failure = createExpense.error ?? serverError;

  return (
    <form className="ak-form ak-form--compact ak-form--finance" onSubmit={handleSubmit(onSubmit)} noValidate>
      {failure && (
        <div className="ak-mb-3">
          <ErrorMessage message={errorMessage(failure)} />
        </div>
      )}

      <div className="ak-form__grid">
        <SelectField
          label="Category"
          required
          options={expenseCategoryOptions}
          {...register('category', { required: 'Choose a category.' })}
          error={errors.category?.message}
        />

        <DateField
          label="Expense date"
          required
          max={todayIso()}
          {...register('expenseDate', { required: 'Pick the expense date.' })}
          error={errors.expenseDate?.message}
        />
      </div>

      <div className="ak-form__grid">
        <InputField
          label="Amount spent"
          type="number"
          min={0.01}
          step={0.01}
          required
          placeholder="20000"
          {...register('amount', {
            required: 'Enter the amount spent.',
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

      <InputField
        label="Description"
        required
        placeholder="Fuel to a wedding shoot in Musanze"
        {...register('description', {
          required: 'Describe what the money was spent on.',
          maxLength: { value: 500, message: 'Description is too long.' },
        })}
        error={errors.description?.message}
      />

      <div className="ak-form__actions">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isSubmitting}>
          Record expense
        </Button>
      </div>
    </form>
  );
}

export default ExpenseForm;
