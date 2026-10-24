/** Studio customer API calls. */
import { axiosInstance } from '../util/axiosInstance';
import { cleanQuery } from '../util/apiUrl';
import type { Paginated } from '../types/api';
import type {
  CreateCustomerPayload,
  Customer,
  CustomerQuery,
  UpdateCustomerPayload,
} from '../types/customer';

export const customerService = {
  async list(query: CustomerQuery = {}): Promise<Paginated<Customer>> {
    const { data } = await axiosInstance.get<Paginated<Customer>>('/customers', {
      params: cleanQuery(query as Record<string, unknown>),
    });
    return data;
  },

  async get(id: string): Promise<Customer> {
    const { data } = await axiosInstance.get<Customer>(`/customers/${id}`);
    return data;
  },

  async create(payload: CreateCustomerPayload): Promise<Customer> {
    const { data } = await axiosInstance.post<Customer>('/customers', payload);
    return data;
  },

  async update(id: string, payload: UpdateCustomerPayload): Promise<Customer> {
    const { data } = await axiosInstance.patch<Customer>(
      `/customers/${id}`,
      payload,
    );
    return data;
  },

  /** Deactivates a customer — blocks new bookings, never deletes the row. */
  async deactivate(id: string): Promise<Customer> {
    const { data } = await axiosInstance.post<Customer>(
      `/customers/${id}/deactivate`,
    );
    return data;
  },

  async reactivate(id: string): Promise<Customer> {
    const { data } = await axiosInstance.post<Customer>(
      `/customers/${id}/reactivate`,
    );
    return data;
  },
};
