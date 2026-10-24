import type { IconProps } from './types';

/** Camera icon — studio bookings. */
export function CameraIcon({
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
        d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.9a1 1 0 0 0 .83-.45l.94-1.4A1 1 0 0 1 10 3.7h4a1 1 0 0 1 .83.45l.94 1.4a1 1 0 0 0 .83.45h1.9A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="13"
        r="3.4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default CameraIcon;
