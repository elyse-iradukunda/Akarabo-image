/**
 * Static reference data used to build select fields and filter bars.
 *
 * The values mirror the backend enums; the labels are the human-readable
 * versions used across the UI.
 */
import {
  BOOKING_SERVICE_TYPES,
  type BookingServiceType,
} from '../types/booking';
import { BOOKING_STATUSES, type BookingStatus } from '../types/booking';
import { EXPENSE_CATEGORIES, type ExpenseCategory } from '../types/expense';
import { EXPENSE_STATUSES, type ExpenseStatus } from '../types/expense';
import { PAYMENT_METHODS, type PaymentMethod } from '../types/payment';
import { PAYMENT_STATUSES, type PaymentStatus } from '../types/payment';
import { ROLES, type Role } from '../types/auth';
import type { SelectOption } from '../types/form';

/** Turns `MOBILE_MONEY` into `Mobile Money`. */
function label(value: string): string {
  const words = value.toLowerCase().split('_').filter(Boolean);
  const [first = '', ...rest] = words;
  return [first.charAt(0).toUpperCase() + first.slice(1), ...rest].join(' ');
}

function toOptions<T extends string>(values: T[]): SelectOption<T>[] {
  return values.map((value) => ({ value, label: label(value) }));
}

export const serviceTypeOptions: SelectOption<BookingServiceType>[] = toOptions(
  BOOKING_SERVICE_TYPES,
);

export const bookingStatusOptions: SelectOption<BookingStatus>[] =
  toOptions(BOOKING_STATUSES);

export const paymentMethodOptions: SelectOption<PaymentMethod>[] =
  toOptions(PAYMENT_METHODS);

export const paymentStatusOptions: SelectOption<PaymentStatus>[] =
  toOptions(PAYMENT_STATUSES);

export const expenseCategoryOptions: SelectOption<ExpenseCategory>[] =
  toOptions(EXPENSE_CATEGORIES);

export const expenseStatusOptions: SelectOption<ExpenseStatus>[] =
  toOptions(EXPENSE_STATUSES);

export const roleOptions: SelectOption<Role>[] = toOptions(ROLES);

/** Default page size used by every list screen. */
export const DEFAULT_PAGE_SIZE = 10;

/** Choices offered in the "rows per page" selector. */
export const PAGE_SIZE_OPTIONS: number[] = [10, 20, 50];

/** Currency the studio books in by default. */
export const DEFAULT_CURRENCY = 'RWF';
