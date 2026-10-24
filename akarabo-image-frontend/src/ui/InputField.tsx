import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

export interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  trailingAction?: ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField({ label, required, hint, error, id, className, trailingAction, ...props }, ref) {
    const fieldId = id ?? props.name;
    const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

    return (
      <div className="flex min-w-0 flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-gray-700" htmlFor={fieldId}>
            {label}
            {required && <span className="ml-0.5 text-brand">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            id={fieldId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={[
              'w-full rounded-md border border-transparent bg-gray-100 px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15 disabled:cursor-not-allowed disabled:opacity-60',
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15' : '',
              className ?? '',
            ].filter(Boolean).join(' ')}
            {...props}
          />
          {trailingAction}
        </div>
        {error ? (
          <span className="text-xs text-red-600" id={`${fieldId}-error`} role="alert">{error}</span>
        ) : hint ? (
          <span className="text-xs text-gray-500" id={`${fieldId}-hint`}>{hint}</span>
        ) : null}
      </div>
    );
  },
);

export default InputField;
