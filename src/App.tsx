import { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import { B_URL, Ic, icons } from './utils';
import './app.css';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart, activeSeason } = useAppContext();
  const nav: Array<{ to: string; ic: string; l: string; badge?: number }> = [
    { to: '/about', ic: icons.info, l: 'About' },
    { to: '/faq', ic: icons.help, l: 'FAQ' },
    { to: '/field-rentals', ic: icons.map, l: 'Field Rentals' },
    { to: '/sponsorship', ic: icons.star, l: 'Sponsorship' },
    ...(activeSeason ? [{ to: '/register', ic: icons.clip, l: 'Register' }] : []),
    ...(cart.length ? [{ to: '/cart', ic: icons.cart, l: 'Cart', badge: cart.length }] : []),
    { to: '/admin', ic: icons.gear, l: 'Admin' },
  ];

  return (
    <div>
      <header className="H">
        <Link to="/" className="H-logo">
          <img
            src={B_URL + 'static/maa-large.jpg'}
            alt="MAA"
            style={{ height: 30, width: 'auto', borderRadius: 3 }}
          />
          <span className="g">MAA</span>
          <span className="H-full"> Meadow Athletic Association</span>
        </Link>
        <nav className="H-nav">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'on' : '')}>
              <Ic d={n.ic} s={14} />
              {n.l}
              {n.badge && n.badge > 0 && <span className="hbadge">{n.badge}</span>}
            </NavLink>
          ))}
          <button>
            <Ic d={icons.user} s={14} />
            Josh S.
          </button>
        </nav>
        <button className="H-ham" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>
      {menuOpen && <div className="H-mob-overlay" onClick={() => setMenuOpen(false)} />}
      <nav className={`H-mob${menuOpen ? ' open' : ''}`}>
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) => (isActive ? 'on' : '')}
            onClick={() => setMenuOpen(false)}
          >
            <Ic d={n.ic} s={16} />
            {n.l}
            {n.badge && n.badge > 0 && <span className="hbadge">{n.badge}</span>}
          </NavLink>
        ))}
        <button onClick={() => setMenuOpen(false)}>
          <Ic d={icons.user} s={16} />
          Josh S.
        </button>
      </nav>
      <Outlet />
    </div>
  );
}
