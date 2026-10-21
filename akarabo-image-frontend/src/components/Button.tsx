import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'success';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
 
  variant?: ButtonVariant;
  
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  icon?: ReactNode;
  iconAfter?: ReactNode;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconAfter,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'ak-button',
        `ak-button--${variant}`,
        size === 'sm' ? 'ak-button--sm' : '',
        fullWidth ? 'ak-button--block' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="ak-spinner" aria-hidden="true" />
      ) : (
        icon
      )}
      {children}
      {!loading && iconAfter}
    </button>
  );
}

export default Button;
