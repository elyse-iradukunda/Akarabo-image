import type { IconProps } from './types';

/** Mail icon. */
export function MailIcon({
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
        x="3"
        y="5.5"
        width="18"
        height="13"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m3.8 7 7.1 5.4a1.6 1.6 0 0 0 2.2 0L20.2 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default MailIcon;
