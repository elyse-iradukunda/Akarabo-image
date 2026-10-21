/** Shared props for every icon component in this folder. */
import type { SVGProps } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'width'> {
  /** Width and height of the square icon box. Defaults to 20. */
  size?: number;
  /** Stroke colour. Defaults to `currentColor`. */
  color?: string;
}
