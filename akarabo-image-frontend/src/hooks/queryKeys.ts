/**
 * Central registry of query keys.
 *
 * Keeping them in one place makes cache invalidation predictable: a mutation
 * in one module can safely refresh a list owned by another.
 */
import type { BookingQuery } from '../types/booking';
import type { CustomerQuery } from '../types/customer';
import type { ExpenseQuery } from '../types/expense';
import type { PaymentQuery } from '../types/payment';
import type { UserQuery } from '../types/user';

export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  bookings: {
    all: ['bookings'] as const,
    list: (query: BookingQuery = {}) =>
      ['bookings', 'list', query] as const,
    detail: (id: string) => ['bookings', 'detail', id] as const,
  },
  customers: {
    all: ['customers'] as const,
    list: (query: CustomerQuery = {}) =>
      ['customers', 'list', query] as const,
    detail: (id: string) => ['customers', 'detail', id] as const,
  },
  payments: {
    all: ['payments'] as const,
    list: (query: PaymentQuery = {}) =>
      ['payments', 'list', query] as const,
    detail: (id: string) => ['payments', 'detail', id] as const,
  },
  expenses: {
    all: ['expenses'] as const,
    list: (query: ExpenseQuery = {}) =>
      ['expenses', 'list', query] as const,
    detail: (id: string) => ['expenses', 'detail', id] as const,
  },
  users: {
    all: ['users'] as const,
    list: (query: UserQuery = {}) => ['users', 'list', query] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },
};
