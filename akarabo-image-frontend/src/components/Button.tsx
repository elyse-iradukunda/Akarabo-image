import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';

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
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-brand text-white hover:bg-brand-dark focus-visible:ring-brand',
    secondary: 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-brand',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus-visible:ring-brand',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
    success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600',
  };

  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        size === 'sm' ? 'h-8' : 'h-10',
        variants[variant],
        fullWidth ? 'w-full' : '',
        className ?? '',
      ].filter(Boolean).join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" /> : icon}
      {children}
      {!loading && iconAfter}
    </button>
  );
}

export default Button;
