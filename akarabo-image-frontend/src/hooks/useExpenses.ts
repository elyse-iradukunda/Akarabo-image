/** Expense queries and mutations. */
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import { expenseService } from '../services/expenseService';
import type {
  CreateExpensePayload,
  Expense,
  ExpenseQuery,
} from '../types/expense';
import type { Paginated } from '../types/api';
import { queryKeys } from './queryKeys';

/** Paginated expenses matching the given filters. */
export function useExpenses(
  query: ExpenseQuery = {},
  options: { enabled?: boolean } = {},
): UseQueryResult<Paginated<Expense>> {
  return useQuery({
    queryKey: queryKeys.expenses.list(query),
    queryFn: () => expenseService.list(query),
    enabled: options.enabled ?? true,
  });
}

/** A single expense. */
export function useExpense(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.expenses.detail(id ?? ''),
    queryFn: () => expenseService.get(id as string),
    enabled: Boolean(id),
  });
}

/** Registers studio spending. */
export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExpensePayload) =>
      expenseService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
    },
  });
}

/** Reverses an expense with a reason — records are never deleted. */
export function useReverseExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      expenseService.reverse(id, reason),
    onSuccess: (expense) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.expenses.detail(expense.id),
      });
    },
  });
}
