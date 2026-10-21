import type { IconProps } from './types';

/** Sign-out icon. */
export function LogoutIcon({
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
      <path
        d="M9.5 4.5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M15 8.5 18.5 12 15 15.5M18 12H9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default LogoutIcon;
