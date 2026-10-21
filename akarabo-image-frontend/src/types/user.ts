/** Staff accounts managed by the owner and managers. */

import type { PageQuery } from './api';
import type { Role } from './auth';

/** A user account as returned by the API (never carries the password hash). */
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: Role;
  isActive?: boolean;
}

/** Every field optional — mirrors `PartialType(CreateUserDto)` server side. */
export interface UpdateUserPayload {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: Role;
  isActive?: boolean;
}

export interface UserQuery extends PageQuery {
  role?: Role;
  isActive?: boolean;
  search?: string;
}
