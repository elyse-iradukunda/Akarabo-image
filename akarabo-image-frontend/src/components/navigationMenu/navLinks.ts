/**
 * Navigation model.
 *
 * Every link declares the roles that may see it, so the sidebar and the
 * route guards stay in sync with the backend's `@Roles(...)` rules.
 */
import type { ComponentType } from 'react';
import {
  CameraIcon,
  DashboardIcon,
  MoneyIcon,
  ReceiptIcon,
  CalendarIcon,
  UsersIcon,
} from '../../assets';
import type { IconProps } from '../../assets/types';
import type { Role } from '../../types/auth';

export interface NavLink {
  /** Label shown in the sidebar. */
  label: string;
  /** Route the link points to. */
  to: string;
  /** Icon rendered before the label. */
  icon: ComponentType<IconProps>;
  /** Roles allowed to see the link. Empty means "every signed-in user". */
  roles?: Role[];
  /** Only match the route exactly (used for the dashboard link). */
  end?: boolean;
}

export interface NavGroup {
  /** Group heading. */
  title: string;
  /** Links inside the group. */
  links: NavLink[];
}

export const navGroups: NavGroup[] = [
  {
    title: 'Overview',
    links: [
      {
        label: 'Dashboard',
        to: '/dashboard',
        icon: DashboardIcon,
        end: true,
      },
    ],
  },
  {
    title: 'Studio',
    links: [
      {
        label: 'Bookings',
        to: '/bookings',
        icon: CameraIcon,
        roles: ['OWNER', 'MANAGER', 'CASHIER'],
      },
      {
        label: 'Customers',
        to: '/customers',
        icon: UsersIcon,
      },
      { label: 'My tasks', to: '/reports/studio', icon: CalendarIcon, roles: ['OWNER', 'MANAGER', 'CASHIER', 'PHOTOGRAPHER'] },
      { label: 'Client services', to: '/client-services', icon: UsersIcon, roles: ['OWNER', 'MANAGER', 'CASHIER'] },
      { label: 'Assign editing task', to: '/tasks/new', icon: CameraIcon, roles: ['OWNER', 'MANAGER', 'CASHIER'] },
    ],
  },
  {
    title: 'Finance',
    links: [
      {
        label: 'Payments',
        to: '/payments',
        icon: MoneyIcon,
        roles: ['OWNER', 'MANAGER'],
      },
      {
        label: 'Expenses',
        to: '/expenses',
        icon: ReceiptIcon,
        roles: ['OWNER', 'MANAGER'],
      },
    ],
  },
  {
    title: 'Administration',
    links: [
      {
        label: 'Staff',
        to: '/staff',
        icon: UsersIcon,
        roles: ['OWNER', 'MANAGER'],
      },
    ],
  },
];

/** True when the link may be shown to the given role. */
export function canSeeLink(link: NavLink, role?: Role | null): boolean {
  if (!link.roles || link.roles.length === 0) return true;
  if (!role) return false;
  return link.roles.includes(role);
}

/** Filters the groups down to the links the role can see. */
export function visibleNavGroups(role?: Role | null): NavGroup[] {
  return navGroups
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => canSeeLink(link, role)),
    }))
    .filter((group) => group.links.length > 0);
}
