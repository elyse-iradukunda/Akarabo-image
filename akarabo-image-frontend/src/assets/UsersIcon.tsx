import type { IconProps } from './types';

/** Users icon — studio customers and staff. */
export function UsersIcon({
  size = 20,
  color = 'currentColor',
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      style={{ color }}
      {...props}
    >
      <circle cx="9" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 19.5a6 6 0 0 1 12 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M16.5 5.2a3.4 3.4 0 0 1 0 6.6M17.5 14.4a6 6 0 0 1 3.5 5.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default UsersIcon;
