/** Maps expenses into view models. */
import type { Expense, ExpenseCategory, ExpenseStatus } from '../types/expense';
import type { Tone } from '../types/ui';
import { formatDateTime, humanize } from '../util/formatters';

/** An expense enriched with display-ready fields. */
export interface ExpenseView extends Expense {
  displayAmount: string;
  displayCategory: string;
  displayDate: string;
}

/** Prepares an expense for display. */
export function toExpenseView(expense: Expense): ExpenseView {
  return {
    ...expense,
    displayAmount: new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
    }).format(expense.amount),
    displayCategory: humanize(expense.category),
    displayDate: formatDateTime(expense.expenseDate ?? expense.createdAt),
  };
}

/** Tone used by the status badge. */
export function expenseStatusTone(status: ExpenseStatus): Tone {
  return status === 'RECORDED' ? 'info' : 'danger';
}

/** Label of the status badge. */
export function expenseStatusLabel(status: ExpenseStatus): string {
  return humanize(status);
}

/** Label of the category badge. */
export function expenseCategoryLabel(category: ExpenseCategory): string {
  return humanize(category);
}
