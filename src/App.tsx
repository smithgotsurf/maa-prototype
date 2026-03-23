import { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import { B_URL, Ic, icons } from './utils';


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
      <header className="navbar bg-neutral text-neutral-content sticky top-0 z-50 px-4">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost gap-2 text-lg normal-case">
            <img
              src={B_URL + 'static/maa-large.jpg'}
              alt="MAA"
              className="h-[30px] w-auto rounded-sm"
            />
            <span className="text-primary font-bold">MAA</span>
            <span className="hidden xl:inline text-sm font-normal opacity-80">
              Meadow Athletic Association
            </span>
          </Link>
        </div>
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `btn btn-ghost btn-sm gap-1 ${isActive ? 'bg-white/10' : ''}`
              }
            >
              <Ic d={n.ic} s={14} />
              {n.l}
              {n.badge && n.badge > 0 && (
                <span className="badge badge-primary badge-sm">{n.badge}</span>
              )}
            </NavLink>
          ))}
          <button className="btn btn-ghost btn-sm gap-1">
            <Ic d={icons.user} s={14} />
            Josh S.
          </button>
        </nav>
        <button
          className="btn btn-ghost lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
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
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMenuOpen(false)} />
      )}
      <nav
        className={`fixed top-0 right-0 h-full w-64 bg-base-100 text-base-content z-50 shadow-xl flex flex-col p-4 gap-1 transition-transform duration-200 lg:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `btn btn-ghost btn-sm justify-start gap-2 ${isActive ? 'btn-active' : ''}`
            }
            onClick={() => setMenuOpen(false)}
          >
            <Ic d={n.ic} s={16} />
            {n.l}
            {n.badge && n.badge > 0 && (
              <span className="badge badge-primary badge-sm">{n.badge}</span>
            )}
          </NavLink>
        ))}
        <button className="btn btn-ghost btn-sm justify-start gap-2" onClick={() => setMenuOpen(false)}>
          <Ic d={icons.user} s={16} />
          Josh S.
        </button>
      </nav>
      <Outlet />
    </div>
  );
}
