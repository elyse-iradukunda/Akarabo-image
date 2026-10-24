/** Maps user accounts into view models. */
import type { User } from '../types/user';
import type { Tone } from '../types/ui';
import { formatDateTime, humanize } from '../util/formatters';
import { initials, roleLabel, roleTone } from './authMapper';

/** A user enriched with display-ready fields. */
export interface UserView extends User {
  displayName: string;
  displayEmail: string;
  displayPhone: string;
  displayRole: string;
  displayInitials: string;
  displayLastLogin: string;
}

/** Prepares a user for display. */
export function toUserView(user: User): UserView {
  return {
    ...user,
    displayName: user.fullName || 'Unnamed user',
    displayEmail: user.email || '—',
    displayPhone: user.phone || '—',
    displayRole: roleLabel(user.role),
    displayInitials: initials(user.fullName || '?'),
    displayLastLogin: user.lastLoginAt
      ? formatDateTime(user.lastLoginAt)
      : 'Never signed in',
  };
}

/** Tone used by the role badge. */
export function userRoleTone(role: User['role']): Tone {
  return roleTone(role);
}

/** Tone used by the active/inactive badge. */
export function userStatusTone(isActive: boolean): Tone {
  return isActive ? 'success' : 'neutral';
}

/** Label of the active/inactive badge. */
export function userStatusLabel(isActive: boolean): string {
  return humanize(isActive ? 'Active' : 'Deactivated');
}
