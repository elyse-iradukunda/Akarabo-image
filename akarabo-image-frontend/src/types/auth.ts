/** Authentication, roles and the signed-in user. */

/** Roles recognised by the backend (`Role` enum on the Nest side). */
export type Role = 'OWNER' | 'MANAGER' | 'PHOTOGRAPHER' | 'CASHIER';

/** Every role in display order, richest first. */
export const ROLES: Role[] = ['OWNER', 'MANAGER', 'PHOTOGRAPHER', 'CASHIER'];

/** The subset of the profile returned by `POST /auth/login`. */
export interface AuthUserSummary {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  isActive: boolean;
}

/** The full profile returned by `GET /auth/me`. */
export interface AuthUser extends AuthUserSummary {
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: string;
  user: AuthUserSummary;
}

export interface LogoutResponse {
  success: true;
  message: string;
}
