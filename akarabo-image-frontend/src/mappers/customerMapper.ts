/** Maps customers into view models. */
import type { Customer } from '../types/customer';
import type { Tone } from '../types/ui';
import { humanize, truncate } from '../util/formatters';

/** A customer enriched with display-ready fields. */
export interface CustomerView extends Customer {
  displayName: string;
  displayPhone: string;
  displayEmail: string;
  shortAddress: string;
}

/** Prepares a customer for display. */
export function toCustomerView(customer: Customer): CustomerView {
  return {
    ...customer,
    displayName: customer.name || 'Unnamed customer',
    displayPhone: customer.phone || '—',
    displayEmail: customer.email || '—',
    shortAddress: customer.address ? truncate(customer.address, 40) : '—',
  };
}

/** Tone used by the active/inactive badge. */
export function customerStatusTone(isActive: boolean): Tone {
  return isActive ? 'success' : 'neutral';
}

/** Label of the active/inactive badge. */
export function customerStatusLabel(isActive: boolean): string {
  return isActive ? 'Active' : 'Deactivated';
}

/** Human-readable label for a customer type marker. */
export function customerKindLabel(customer: Customer): string {
  return humanize(customer.isActive ? 'Active' : 'Inactive');
}
