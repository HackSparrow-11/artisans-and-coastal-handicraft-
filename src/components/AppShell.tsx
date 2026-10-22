import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Menu, RotateCcw, ShoppingBag, X } from 'lucide-react';
import { useApp } from '../store';
import type { DemoRole } from '../types';

const roleNames: Record<DemoRole, string> = {
  artisan: 'Artisan · Laxmi',
  buyer: 'Buyer · Explore',
  worker: 'Worker · Sunita',
  coordinator: 'SHG Coordinator · Annapurna',
};

const roleRoutes: Record<DemoRole, string> = {
  artisan: '/artisan',
  buyer: '/marketplace',
  worker: '/worker',
  coordinator: '/coordinator',
};

export function AppHeader() {
  const { data, setRole, notify, resetDemo } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = data.cart.reduce((sum, line) => sum + line.quantity, 0);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const switchRole = (next: DemoRole) => {
    setRole(next);
    navigate(roleRoutes[next]);
    notify(`Demo role switched to ${roleNames[next]}.`, 'info');
  };

  return (
    <header className="app-header">
      <div className="header-inner">
        <Link to="/" className="brand-lockup" aria-label="KalaSetu home">
          <span className="brand-mark"><span /></span>
          <span className="brand-type"><strong>KalaSetu</strong><small>craft, connected</small></span>
        </Link>

        <nav className={`primary-nav${mobileOpen ? ' nav-open' : ''}`} aria-label="Main navigation">
          <NavLink to="/marketplace" className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}>Marketplace</NavLink>
          <NavLink to="/artisan" className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}>For artisans</NavLink>
          <NavLink to="/collaboration" className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}>Local skills</NavLink>
          <NavLink to="/coordinator" className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}>Community review</NavLink>
        </nav>

        <div className="header-actions">
          <label className="role-select-wrap" aria-label="Switch demo role">
            <span className="role-select-dot" />
            <select value={data.role} onChange={(event) => switchRole(event.target.value as DemoRole)} aria-label="Demo role">
              <option value="artisan">Artisan · Laxmi</option>
              <option value="buyer">Buyer · Explore</option>
              <option value="worker">Worker · Sunita</option>
              <option value="coordinator">SHG Coordinator · Annapurna</option>
            </select>
          </label>
          <Link to="/cart" className="cart-link" aria-label={`Shopping bag, ${cartCount} items`}>
            <ShoppingBag size={17} /><span>Bag</span>{cartCount > 0 && <b>{cartCount}</b>}
          </Link>
          <button className="reset-button" onClick={resetDemo} title="Restore original demo data" aria-label="Reset demo data"><RotateCcw size={15} /><span>Reset</span></button>
          <button className="mobile-menu-toggle" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
      <div className="header-underline" />
    </header>
  );
}

export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <Link to="/" className="footer-brand"><span className="brand-mark small-mark"><span /></span><strong>KalaSetu</strong></Link>
        <p>Made with care. Shared with the world.</p>
        <Link to="/marketplace" className="footer-link">Explore the marketplace <ArrowUpRight size={14} /></Link>
      </div>
      <div className="footer-note">A working prototype · All payments, AI, camera capture and verification are simulated locally.</div>
    </footer>
  );
}

export function ToastRegion() {
  const { toast } = useApp();
  if (!toast) return null;
  return <div className={`toast toast-${toast.kind}`} role={toast.kind === 'error' ? 'alert' : 'status'} aria-live="polite"><span className="toast-dot" />{toast.message}</div>;
}
