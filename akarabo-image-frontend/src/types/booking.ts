/** Studio bookings — the core of the product. */

import type { PageQuery } from './api';

/** The studio services a booking can cover. */
export type BookingServiceType = 'WEDDING' | 'BIRTHDAY' | 'SHOWER' | 'EVENT';

/** All service types, in the order they are offered. */
export const BOOKING_SERVICE_TYPES: BookingServiceType[] = [
  'WEDDING',
  'BIRTHDAY',
  'SHOWER',
  'EVENT',
];

/** Lifecycle of a booking. Bookings are cancelled, never deleted. */
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

/** All booking statuses. */
export const BOOKING_STATUSES: BookingStatus[] = [
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
];

export interface Booking {
  id: string;
  customerId: string;
  serviceType: BookingServiceType;
  /** Event day as an ISO calendar date (yyyy-mm-dd). */
  eventDate: string;
  /** Optional start time, 24-hour HH:MM. */
  startTime?: string;
  venue: string;
  expectedGuests?: number;
  /** Total agreed package price (money owed, not money received). */
  priceAmount: number;
  priceCurrency: string;
  notes?: string;
  status: BookingStatus;
  createdByUserId: string;
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelledByUserId?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  customerId: string;
  serviceType: BookingServiceType;
  /** Real calendar day, today or later. */
  eventDate: string;
  startTime?: string;
  venue: string;
  expectedGuests?: number;
  priceAmount: number;
  priceCurrency?: string;
  notes?: string;
}

export interface UpdateBookingPayload {
  serviceType?: BookingServiceType;
  eventDate?: string;
  startTime?: string;
  venue?: string;
  expectedGuests?: number;
  priceAmount?: number;
  notes?: string;
}

export interface BookingQuery extends PageQuery {
  status?: BookingStatus;
  customerId?: string;
  serviceType?: BookingServiceType;
  /** Earliest event day (inclusive, yyyy-mm-dd). */
  eventFrom?: string;
  /** Latest event day (inclusive, yyyy-mm-dd). */
  eventTo?: string;
}
