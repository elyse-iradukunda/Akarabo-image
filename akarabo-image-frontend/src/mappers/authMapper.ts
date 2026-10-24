/** Maps the authentication payloads into the shape the app stores. */
import type { AuthUser, AuthUserSummary, Role } from '../types/auth';
import type { Tone } from '../types/ui';

/** Fills a login summary into a full profile (the login payload is partial). */
export function toAuthUser(summary: AuthUserSummary): AuthUser {
  return {
    id: summary.id,
    fullName: summary.fullName,
    email: summary.email,
    phone: summary.phone,
    role: summary.role,
    isActive: summary.isActive,
    createdAt: '',
    updatedAt: '',
  };
}

/** Human-readable role label. */
export function roleLabel(role: Role): string {
  switch (role) {
    case 'OWNER':
      return 'Owner';
    case 'MANAGER':
      return 'Manager';
    case 'PHOTOGRAPHER':
      return 'Photographer';
    case 'CASHIER':
      return 'Cashier';
    default:
      return role;
  }
}

/** Tone used for the role badge. */
export function roleTone(role: Role): Tone {
  switch (role) {
    case 'OWNER':
      return 'danger';
    case 'MANAGER':
      return 'info';
    case 'CASHIER':
      return 'success';
    case 'PHOTOGRAPHER':
      return 'warning';
    default:
      return 'neutral';
  }
}

/** Initials used by the avatar chip. */
export function initials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}
