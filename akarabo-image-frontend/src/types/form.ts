/** Shared form primitives used by every screen form. */

/** Status of an asynchronous form submission. */
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

/** Validation feedback attached to a single field. */
export type FieldState = 'idle' | 'valid' | 'invalid';

/** Generic status object returned by mutation hooks. */
export interface MutationStatus {
  status: FormStatus;
  message?: string;
}

/** A select option rendered by `SelectField`. */
export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

/** Requested but not yet delivered — used by list screens. */
export type AsyncState = 'idle' | 'loading' | 'success' | 'error';
