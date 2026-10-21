/** Studio spending. Expenses are reversed, never deleted. */

import type { PageQuery } from './api';

/** What the studio spent money on. */
export type ExpenseCategory =
  | 'TRANSPORT'
  | 'PROPS'
  | 'PRINTING'
  | 'EQUIPMENT'
  | 'RENT'
  | 'UTILITIES'
  | 'MARKETING'
  | 'OTHER';

/** All expense categories. */
export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'TRANSPORT',
  'PROPS',
  'PRINTING',
  'EQUIPMENT',
  'RENT',
  'UTILITIES',
  'MARKETING',
  'OTHER',
];

export type ExpenseStatus = 'RECORDED' | 'REVERSED';

/** All expense statuses. */
export const EXPENSE_STATUSES: ExpenseStatus[] = ['RECORDED', 'REVERSED'];

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  description: string;
  /** When the expense was incurred. */
  expenseDate: string;
  status: ExpenseStatus;
  recordedByUserId: string;
  reversedAt?: string;
  reversedByUserId?: string;
  reversalReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpensePayload {
  category: ExpenseCategory;
  amount: number;
  currency?: string;
  description: string;
  /** Defaults to the recording time when omitted. */
  expenseDate?: string;
}

export interface ExpenseQuery extends PageQuery {
  category?: ExpenseCategory;
  status?: ExpenseStatus;
  /** Only expenses recorded at/after this instant (ISO 8601). */
  dateFrom?: string;
  /** Only expenses recorded at/before this instant (ISO 8601). */
  dateTo?: string;
}
