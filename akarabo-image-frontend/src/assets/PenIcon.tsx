import type { IconProps } from './types';

/** Pen icon — edit actions. */
export function PenIcon({
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
        d="M4 20h4L20 8a2.5 2.5 0 0 0-3.5-3.5L4.5 16.5 4 20Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m14.5 6.5 3 3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default PenIcon;
