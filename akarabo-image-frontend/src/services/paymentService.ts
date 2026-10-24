/** Payment (money received) API calls. */
import { axiosInstance } from '../util/axiosInstance';
import { cleanQuery } from '../util/apiUrl';
import type { Paginated } from '../types/api';
import type {
  CreatePaymentPayload,
  Payment,
  PaymentQuery,
} from '../types/payment';

export const paymentService = {
  async list(query: PaymentQuery = {}): Promise<Paginated<Payment>> {
    const { data } = await axiosInstance.get<Paginated<Payment>>('/payments', {
      params: cleanQuery(query as Record<string, unknown>),
    });
    return data;
  },

  async get(id: string): Promise<Payment> {
    const { data } = await axiosInstance.get<Payment>(`/payments/${id}`);
    return data;
  },

  async create(payload: CreatePaymentPayload): Promise<Payment> {
    const { data } = await axiosInstance.post<Payment>('/payments', payload);
    return data;
  },

  /** Reverses a payment with a reason — records are never deleted. */
  async reverse(id: string, reason: string): Promise<Payment> {
    const { data } = await axiosInstance.post<Payment>(
      `/payments/${id}/reverse`,
      { reason },
    );
    return data;
  },
};
