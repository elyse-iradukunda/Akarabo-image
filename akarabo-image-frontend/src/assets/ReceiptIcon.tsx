import type { IconProps } from './types';

/** Receipt icon — studio spending. */
export function ReceiptIcon({
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
        d="M5.5 3.5h13v17l-2.2-1.6-2.2 1.6-2.1-1.6L9.9 20.5l-2.2-1.6-2.2 1.6v-17Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 8.5h6M9 12h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default ReceiptIcon;
