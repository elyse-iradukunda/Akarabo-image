/**
 * Role-based capability checks.
 *
 * The backend enforces the same rules with `@Roles(...)`; these helpers keep
 * the UI honest by hiding actions the user could never perform.
 */
import type { Role } from '../types/auth';

/** Owner and manager administer staff accounts. */
export function canManageUsers(role?: Role | null): boolean {
  return role === 'OWNER' || role === 'MANAGER';
}

/** Only the owner can activate or deactivate a staff account. */
export function canManageUserAccess(role?: Role | null): boolean {
  return role === 'OWNER';
}

/** Manager and owner create customers and bookings. */
export function canManageCustomers(role?: Role | null): boolean {
  return role === 'MANAGER' || role === 'OWNER';
}

/** Cashiers can register customers; customer edits stay with management. */
export function canRegisterCustomers(role?: Role | null): boolean {
  return role === 'CASHIER' || role === 'PHOTOGRAPHER' || canManageCustomers(role);
}

/** Manager and owner create, edit, confirm, complete or cancel bookings. */
export function canManageBookings(role?: Role | null): boolean {
  return role === 'MANAGER' || role === 'OWNER';
}

/** Only the owner and manager can access financial records and actions. */
export function canRecordPayments(role?: Role | null): boolean {
  return role === 'MANAGER' || role === 'OWNER';
}

/** Only the owner and manager can access financial records and actions. */
export function canRecordExpenses(role?: Role | null): boolean {
  return role === 'MANAGER' || role === 'OWNER';
}

/** Reversing a financial record is a manager/owner action. */
export function canReverseFinance(role?: Role | null): boolean {
  return role === 'MANAGER' || role === 'OWNER';
}

/** Every signed-in role may browse customers and bookings. */
export function canViewDirectory(role?: Role | null): boolean {
  return Boolean(role);
}
