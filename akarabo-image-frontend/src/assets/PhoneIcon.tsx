import type { IconProps } from './types';

/** Phone icon. */
export function PhoneIcon({
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
        d="M6.2 3.8h3l1.6 4-2 1.3a11 11 0 0 0 5.1 5.1l1.3-2 4 1.6v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.2 6a2 2 0 0 1 2-2.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default PhoneIcon;
