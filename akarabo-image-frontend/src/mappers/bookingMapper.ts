/** Maps bookings into view models with resolved customer names. */
import type { Booking, BookingStatus } from '../types/booking';
import type { Customer } from '../types/customer';
import type { Tone } from '../types/ui';
import { formatCalendarDay, humanize } from '../util/formatters';

/** A booking enriched with the customer it belongs to. */
export interface BookingView extends Booking {
  customerName: string;
  customerPhone?: string;
}

/** Attaches customer information to a raw booking. */
export function toBookingView(
  booking: Booking,
  customers: Customer[] = [],
): BookingView {
  const customer = customers.find((item) => item.id === booking.customerId);
  return {
    ...booking,
    customerName: customer?.name ?? 'Unknown customer',
    customerPhone: customer?.phone,
  };
}

/** Tone used by the status badge. */
export function bookingStatusTone(status: BookingStatus): Tone {
  switch (status) {
    case 'CONFIRMED':
      return 'success';
    case 'COMPLETED':
      return 'info';
    case 'CANCELLED':
      return 'danger';
    case 'PENDING':
    default:
      return 'warning';
  }
}

/** Label of the status badge. */
export function bookingStatusLabel(status: BookingStatus): string {
  return humanize(status);
}

/** Label of the service type badge. */
export function serviceTypeLabel(serviceType: Booking['serviceType']): string {
  return humanize(serviceType);
}

/** Formatted event day. */
export function bookingEventDay(booking: Booking): string {
  return formatCalendarDay(booking.eventDate);
}

/** Actions available for a booking in its current status. */
export function availableBookingActions(status: BookingStatus): {
  canConfirm: boolean;
  canComplete: boolean;
  canCancel: boolean;
  canEdit: boolean;
} {
  return {
    canConfirm: status === 'PENDING',
    canComplete: status === 'CONFIRMED',
    canCancel: status === 'PENDING' || status === 'CONFIRMED',
    canEdit: status === 'PENDING' || status === 'CONFIRMED',
  };
}
