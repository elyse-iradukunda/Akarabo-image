import type { IconProps } from './types';

/** Akarabo Image — the studio mark (an aperture / lens iris). */
export function Logo({ size = 32, color = 'currentColor', ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Akarabo Image logo"
      {...props}
    >
      <circle cx="16" cy="16" r="15" fill={color} />
      <path
        d="M16 6.5 22.6 10l3 7.4-3 7.4L16 28l-6.6-3.2-3-7.4 3-7.4L16 6.5Z"
        stroke="#fff"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="4.6" stroke="#fff" strokeWidth="1.7" />
    </svg>
  );
}

export default Logo;
