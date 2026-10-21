import type { IconProps } from './types';

/** Dashboard icon. */
export function DashboardIcon({
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
        x="3.5"
        y="3.5"
        width="7"
        height="8"
        rx="1.8"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="13.5"
        y="3.5"
        width="7"
        height="5"
        rx="1.8"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="13.5"
        y="11.5"
        width="7"
        height="9"
        rx="1.8"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect
        x="3.5"
        y="14.5"
        width="7"
        height="6"
        rx="1.8"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default DashboardIcon;
