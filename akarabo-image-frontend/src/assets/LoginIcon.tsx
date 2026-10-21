import type { IconProps } from './types';

/** Sign-in icon. */
export function LoginIcon({
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
        d="M14.5 4.5H18a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M9 8.5 5.5 12 9 15.5M6 12h9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default LoginIcon;
