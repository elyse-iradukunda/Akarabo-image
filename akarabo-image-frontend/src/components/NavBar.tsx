import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogoutIcon, MenuIcon, ProfileIcon, XIcon } from '../assets';
import { useAuth } from '../context/AuthContext';
import { useLogout } from '../hooks/useAuth';
import { initials, roleLabel } from '../mappers/authMapper';
import { Badge } from './Badge';

export interface NavBarProps {
  /** Toggles the mobile navigation drawer. */
  onToggleMenu?: () => void;
}

/** Top bar: page context, profile and sign-out. */
export function NavBar({ onToggleMenu }: NavBarProps) {
  const { user } = useAuth();
  const logout = useLogout();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="ak-topbar">
      <div className="ak-row ak-gap-3">
        <button
          type="button"
          className="ak-button ak-button--ghost ak-button--sm ak-sidebar-toggle"
          onClick={onToggleMenu}
          aria-label="Toggle navigation"
        >
          <MenuIcon size={20} />
        </button>
        <span className="ak-topbar__title">Akarabo Image</span>
      </div>

      <div className="ak-topbar__actions">
        {user && (
          <div className="ak-row ak-gap-3">
            <Link
              to="/profile"
              className="ak-row ak-gap-2"
              onClick={() => setMenuOpen(false)}
            >
              <span className="ak-avatar">{initials(user.fullName)}</span>
              <span className="ak-small ak-strong ak-nowrap">{user.fullName}</span>
              <Badge tone="info">{roleLabel(user.role)}</Badge>
            </Link>
          </div>
        )}

        <button
          type="button"
          className="ak-button ak-button--ghost ak-button--sm"
          onClick={handleLogout}
          title="Sign out"
        >
          <LogoutIcon size={18} />
          <span className="ak-nowrap">Sign out</span>
        </button>
      </div>

      {menuOpen && (
        <div className="ak-modal__backdrop" onClick={() => setMenuOpen(false)}>
          <div
            className="ak-modal"
            role="dialog"
            aria-label="Profile"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="ak-modal__header">
              <h2 className="ak-modal__title">My account</h2>
              <button
                type="button"
                className="ak-button ak-button--ghost ak-button--sm"
                onClick={() => setMenuOpen(false)}
                aria-label="Close"
              >
                <XIcon size={18} />
              </button>
            </header>
            <div className="ak-modal__body">
              <Link
                to="/profile"
                className="ak-row ak-gap-3 ak-mb-4"
                onClick={() => setMenuOpen(false)}
              >
                <ProfileIcon size={20} />
                <span className="ak-strong">Profile</span>
              </Link>
              <p className="ak-tiny ak-subtle">
                Current path: {location.pathname}
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default NavBar;
