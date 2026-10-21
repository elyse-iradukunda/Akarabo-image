/**
 * Presentation helpers shared across screens.
 *
 * Every formatter is defensive: the API may omit optional fields, and a
 * missing value must never crash a screen.
 */
import { format, isValid, parseISO } from 'date-fns';

/** `1_200_000` → `RWF 1,200,000`. Falls back to a plain number. */
export function formatMoney(amount?: number, currency?: string): string {
  if (amount === undefined || amount === null || Number.isNaN(amount)) {
    return currency ? `${currency} —` : '—';
  }
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
  return currency ? `${currency} ${formatted}` : formatted;
}

/** Formats an ISO timestamp as `12 Jun 2026`. */
export function formatDate(value?: string): string {
  if (!value) return '—';
  const date = parseISO(value);
  return isValid(date) ? format(date, 'dd MMM yyyy') : '—';
}

/** Formats an ISO timestamp as `12 Jun 2026, 14:30`. */
export function formatDateTime(value?: string): string {
  if (!value) return '—';
  const date = parseISO(value);
  return isValid(date) ? format(date, 'dd MMM yyyy, HH:mm') : '—';
}

/** Formats a `yyyy-mm-dd` calendar day as `12 Jun 2026`. */
export function formatCalendarDay(value?: string): string {
  if (!value) return '—';
  const date = parseISO(value);
  return isValid(date) ? format(date, 'dd MMM yyyy') : value;
}

/** `MOBILE_MONEY` → `Mobile Money`. */
export function humanize(value?: string): string {
  if (!value) return '—';
  const words = value
    .toLowerCase()
    .split('_')
    .filter(Boolean);
  if (words.length === 0) return value;
  const [first = '', ...rest] = words;
  const label = first.charAt(0).toUpperCase() + first.slice(1);
  return [label, ...rest].join(' ');
}

/** Truncates long text (venue names, notes) for table cells. */
export function truncate(value?: string, max = 60): string {
  if (!value) return '—';
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

/** Today's calendar day as `yyyy-mm-dd` (matches the API's date format). */
export function todayIso(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/** Builds a `yyyy-mm-dd` string from a `Date`. */
export function toIsoDay(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
