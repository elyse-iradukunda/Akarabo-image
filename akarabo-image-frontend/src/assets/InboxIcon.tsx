import type { IconProps } from './types';

/** Inbox icon — empty states. */
export function InboxIcon({
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
        d="M3.5 13.5 6 5.5h12l2.5 8v4a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 13.5H9a3 3 0 0 0 6 0h5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default InboxIcon;
