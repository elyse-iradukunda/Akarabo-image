import type { ReactNode } from 'react';

/** Presentation-level types shared by the component layer. */

/** Visual tone used by badges, alerts and status pills. */
export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

/** Sort direction for table headers. */
export type SortDirection = 'asc' | 'desc';

/** A generic table column definition. */
export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: string;
}

/** Breadcrumb trail rendered above a page title. */
export interface Crumb {
  label: string;
  to?: string;
}

/** Toast-like notification raised by a screen. */
export interface Notice {
  tone: Tone;
  message: string;
}
