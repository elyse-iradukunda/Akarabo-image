import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { NavigationMenu } from '../components/navigationMenu';

/**
 * The signed-in application shell: sidebar, top bar and the routed screen.
 */
export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="ak-app">
      <NavigationMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && <button type="button" className="ak-sidebar-scrim" aria-label="Close navigation menu" onClick={() => setMenuOpen(false)} />}

      <div className="ak-main">
        <NavBar onToggleMenu={() => setMenuOpen((open) => !open)} />
        <main className="ak-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
