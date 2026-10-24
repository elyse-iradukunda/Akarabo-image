import { forwardRef, type SelectHTMLAttributes } from 'react';
import type { SelectOption } from '../types/form';

export interface SelectFieldProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Visible label above the control. */
  label?: string;
  /** Marks the field as mandatory (adds the asterisk). */
  required?: boolean;
  /** Helper text rendered below the control. */
  hint?: string;
  /** Validation message — also switches the control to the error style. */
  error?: string;
  /** Options rendered in the dropdown. */
  options: SelectOption<string>[];
  /** Placeholder for the empty option. */
  placeholder?: string;
}

/** Labelled select used by every form in the app. */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    {
      label,
      required,
      hint,
      error,
      id,
      options,
      placeholder,
      className,
      ...props
    },
    ref,
  ) {
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
        <select
          id={fieldId}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={[
            'ak-select',
            error ? 'ak-select--error' : '',
            className ?? '',
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
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

export default SelectField;
