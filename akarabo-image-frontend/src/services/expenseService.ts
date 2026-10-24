/** Expense (studio spending) API calls. */
import { axiosInstance } from '../util/axiosInstance';
import { cleanQuery } from '../util/apiUrl';
import type { Paginated } from '../types/api';
import type {
  CreateExpensePayload,
  Expense,
  ExpenseQuery,
} from '../types/expense';

export const expenseService = {
  async list(query: ExpenseQuery = {}): Promise<Paginated<Expense>> {
    const { data } = await axiosInstance.get<Paginated<Expense>>('/expenses', {
      params: cleanQuery(query as Record<string, unknown>),
    });
    return data;
  },

  async get(id: string): Promise<Expense> {
    const { data } = await axiosInstance.get<Expense>(`/expenses/${id}`);
    return data;
  },

  async create(payload: CreateExpensePayload): Promise<Expense> {
    const { data } = await axiosInstance.post<Expense>('/expenses', payload);
    return data;
  },

  /** Reverses an expense with a reason — records are never deleted. */
  async reverse(id: string, reason: string): Promise<Expense> {
    const { data } = await axiosInstance.post<Expense>(
      `/expenses/${id}/reverse`,
      { reason },
    );
    return data;
  },
};
