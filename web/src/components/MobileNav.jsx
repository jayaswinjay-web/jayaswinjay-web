import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { auth } from '../lib/api';

const links = [
  { to: '/app', label: 'Home', end: true },
  { to: '/app/search', label: 'Search' },
  { to: '/app/library', label: 'Library' },
  { to: '/app/liked', label: 'Liked' }
];

export default function MobileNav() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await auth.logout(); } catch {}
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed bottom-16 left-0 right-0 bg-surface border-t border-white/[0.04] z-40 flex">
      {links.map(l => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] transition-colors ${
              isActive ? 'text-accent' : 'text-text2 hover:text-text'
            }`
          }
        >
          {l.label}
        </NavLink>
      ))}
      <button
        onClick={handleLogout}
        className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] text-red-400 hover:text-red-300 transition-colors"
      >
        Sign Out
      </button>
    </nav>
  );
}
