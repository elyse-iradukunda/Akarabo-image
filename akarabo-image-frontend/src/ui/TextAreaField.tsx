import { forwardRef, type TextareaHTMLAttributes } from 'react';

export interface TextAreaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visible label above the control. */
  label?: string;
  /** Marks the field as mandatory (adds the asterisk). */
  required?: boolean;
  /** Helper text rendered below the control. */
  hint?: string;
  /** Validation message — also switches the control to the error style. */
  error?: string;
}

/** Labelled multi-line input. */
export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  TextAreaFieldProps
>(function TextAreaField(
  { label, required, hint, error, id, className, ...props },
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
      <textarea
        id={fieldId}
        ref={ref}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={[
          'ak-textarea',
          error ? 'ak-textarea--error' : '',
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
});

export default TextAreaField;
