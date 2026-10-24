/** Money received by the studio. Payments are reversed, never deleted. */

import type { PageQuery } from './api';

/** How the money physically arrived. */
export type PaymentMethod = 'CASH' | 'MOBILE_MONEY' | 'CARD' | 'BANK_TRANSFER';

/** All payment methods. */
export const PAYMENT_METHODS: PaymentMethod[] = [
  'CASH',
  'MOBILE_MONEY',
  'CARD',
  'BANK_TRANSFER',
];

export type PaymentStatus = 'COMPLETED' | 'REVERSED';

/** All payment statuses. */
export const PAYMENT_STATUSES: PaymentStatus[] = ['COMPLETED', 'REVERSED'];

export interface Payment {
  id: string;
  bookingId?: string;
  studioServiceId?: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  /** External receipt / mobile-money transaction id. */
  reference?: string;
  notes?: string;
  status: PaymentStatus;
  recordedByUserId: string;
  reversedAt?: string;
  reversedByUserId?: string;
  reversalReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentPayload {
  bookingId?: string;
  studioServiceId?: string;
  amount: number;
  currency?: string;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
}

export interface PaymentQuery extends PageQuery {
  status?: PaymentStatus;
  method?: PaymentMethod;
  bookingId?: string;
  /** Only payments recorded at/after this instant (ISO 8601). */
  dateFrom?: string;
  /** Only payments recorded at/before this instant (ISO 8601). */
  dateTo?: string;
}
