/** Studio clients the bookings are made for. */

import type { PageQuery } from './api';

/** A studio customer. Customers are deactivated, never deleted. */
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  isActive: boolean;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerPayload {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface UpdateCustomerPayload {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface CustomerQuery extends PageQuery {
  isActive?: boolean;
  search?: string;
}
