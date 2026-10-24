import { NavLink as RouterNavLink } from 'react-router-dom';
import type { NavLink as NavLinkModel } from './navLinks';

export interface NavItemProps {
  /** The link to render. */
  link: NavLinkModel;
  /** Called after the link is activated (used to close the mobile menu). */
  onNavigate?: () => void;
}

/** A single entry of the sidebar navigation. */
export function NavItem({ link, onNavigate }: NavItemProps) {
  const Icon = link.icon;

  return (
    <RouterNavLink
      to={link.to}
      end={link.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `ak-nav-item${isActive ? ' ak-nav-item--active' : ''}`
      }
    >
      <span className="ak-nav-item__icon">
        <Icon size={18} />
      </span>
      <span>{link.label}</span>
    </RouterNavLink>
  );
}

export default NavItem;
