/** Maps payments into view models. */
import type { Payment, PaymentMethod, PaymentStatus } from '../types/payment';
import type { Tone } from '../types/ui';
import { formatDateTime, humanize } from '../util/formatters';

/** A payment enriched with display-ready fields. */
export interface PaymentView extends Payment {
  displayAmount: string;
  displayMethod: string;
  displayDate: string;
}

/** Prepares a payment for display. */
export function toPaymentView(payment: Payment): PaymentView {
  return {
    ...payment,
    displayAmount: new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
    }).format(payment.amount),
    displayMethod: humanize(payment.method),
    displayDate: formatDateTime(payment.createdAt),
  };
}

/** Tone used by the status badge. */
export function paymentStatusTone(status: PaymentStatus): Tone {
  return status === 'COMPLETED' ? 'success' : 'danger';
}

/** Label of the status badge. */
export function paymentStatusLabel(status: PaymentStatus): string {
  return humanize(status);
}

/** Label of the method badge. */
export function paymentMethodLabel(method: PaymentMethod): string {
  return humanize(method);
}
