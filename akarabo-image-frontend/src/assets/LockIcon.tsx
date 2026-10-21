import type { IconProps } from './types';

/** Padlock icon. */
export function LockIcon({
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
      <rect
        x="4.5"
        y="10"
        width="15"
        height="10"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8 10V7.5a4 4 0 1 1 8 0V10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default LockIcon;
