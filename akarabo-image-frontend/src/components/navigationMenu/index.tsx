import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LogoutIcon, Logo } from '../../assets';
import { useAuth } from '../../context/AuthContext';
import { useLogout } from '../../hooks/useAuth';
import { roleLabel } from '../../mappers/authMapper';
import { NavGroups } from './NavGroups';
import { visibleNavGroups } from './navLinks';

export interface NavigationMenuProps {
  /** True when the mobile drawer is open. */
  open?: boolean;
  /** Called when the drawer should close. */
  onClose?: () => void;
}

/** The application sidebar: brand, links and the signed-in staff card. */
export function NavigationMenu({ open = false, onClose }: NavigationMenuProps) {
  const { user } = useAuth();
  const logout = useLogout();
  const groups = useMemo(() => visibleNavGroups(user?.role), [user?.role]);

  return (
    <aside className={`ak-sidebar${open ? ' ak-sidebar--open' : ''}`}>
      <div className="ak-sidebar__brand">
        <Link to="/dashboard" onClick={onClose}>
          <Logo size={34} color="#b3122f" />
        </Link>
        <div>
          <p className="ak-sidebar__brand-name">Akarabo Image</p>
          <p className="ak-sidebar__brand-tag">Studio Manager</p>
        </div>
      </div>

      <nav className="ak-sidebar__nav" aria-label="Main navigation">
        <NavGroups groups={groups} onNavigate={onClose} />
      </nav>

      <div className="ak-sidebar__footer">
        {user && (
          <div className="ak-sidebar__account">
          <Link to="/profile" className="ak-row ak-gap-3 ak-sidebar__account-link" onClick={onClose}>
            <span className="ak-avatar">{user.fullName.charAt(0).toUpperCase()}</span>
            <div className="ak-truncate">
              <p className="ak-small ak-strong ak-truncate" style={{ color: '#fff' }}>
                {user.fullName}
              </p>
              <p className="ak-tiny ak-truncate">{roleLabel(user.role)}</p>
            </div>
          </Link>
          <button type="button" className="ak-sidebar__signout" onClick={() => void logout()}>
            <LogoutIcon size={17} />
            <span>Sign out</span>
          </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export default NavigationMenu;
