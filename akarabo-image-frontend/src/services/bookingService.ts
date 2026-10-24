/** Studio booking API calls. */
import { axiosInstance } from '../util/axiosInstance';
import { cleanQuery } from '../util/apiUrl';
import type { Paginated } from '../types/api';
import type {
  Booking,
  BookingQuery,
  CreateBookingPayload,
  UpdateBookingPayload,
} from '../types/booking';

export const bookingService = {
  async list(query: BookingQuery = {}): Promise<Paginated<Booking>> {
    const { data } = await axiosInstance.get<Paginated<Booking>>('/bookings', {
      params: cleanQuery(query as Record<string, unknown>),
    });
    return data;
  },

  async get(id: string): Promise<Booking> {
    const { data } = await axiosInstance.get<Booking>(`/bookings/${id}`);
    return data;
  },

  async create(payload: CreateBookingPayload): Promise<Booking> {
    const { data } = await axiosInstance.post<Booking>('/bookings', payload);
    return data;
  },

  async update(id: string, payload: UpdateBookingPayload): Promise<Booking> {
    const { data } = await axiosInstance.patch<Booking>(
      `/bookings/${id}`,
      payload,
    );
    return data;
  },

  /** PENDING → CONFIRMED. */
  async confirm(id: string): Promise<Booking> {
    const { data } = await axiosInstance.post<Booking>(`/bookings/${id}/confirm`);
    return data;
  },

  /** CONFIRMED → COMPLETED (the event happened). */
  async complete(id: string): Promise<Booking> {
    const { data } = await axiosInstance.post<Booking>(
      `/bookings/${id}/complete`,
    );
    return data;
  },

  /** PENDING/CONFIRMED → CANCELLED with a mandatory reason. */
  async cancel(id: string, reason: string): Promise<Booking> {
    const { data } = await axiosInstance.post<Booking>(
      `/bookings/${id}/cancel`,
      { reason },
    );
    return data;
  },
};
