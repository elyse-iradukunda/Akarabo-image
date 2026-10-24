import { forwardRef, type InputHTMLAttributes } from 'react';

export interface DateFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Visible label above the control. */
  label?: string;
  /** Marks the field as mandatory (adds the asterisk). */
  required?: boolean;
  /** Helper text rendered below the control. */
  hint?: string;
  /** Validation message — also switches the control to the error style. */
  error?: string;
}

/**
 * Date input restricted to `yyyy-mm-dd` — the exact format the API expects
 * for calendar days.
 */
export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(
  function DateField({ label, required, hint, error, id, className, ...props }, ref) {
    const fieldId = id ?? props.name;
    const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

    return (
      <div className="ak-field">
        {label && (
          <label className="ak-field__label" htmlFor={fieldId}>
            {label}
            {required && <span className="ak-field__required">*</span>}
          </label>
        )}
        <input
          id={fieldId}
          ref={ref}
          type="date"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={[
            'ak-input',
            error ? 'ak-input--error' : '',
            className ?? '',
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {error ? (
          <span className="ak-field__error" id={`${fieldId}-error`}>
            {error}
          </span>
        ) : hint ? (
          <span className="ak-field__hint" id={`${fieldId}-hint`}>
            {hint}
          </span>
        ) : null}
      </div>
    );
  },
);

export default DateField;
