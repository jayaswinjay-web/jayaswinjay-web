import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { auth } from '../lib/api';

const links = [
  { to: '/app', label: 'Home', end: true },
  { to: '/app/search', label: 'Search' },
  { to: '/app/library', label: 'Library' },
  { to: '/app/liked', label: 'Liked Songs' }
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await auth.logout(); } catch {}
    logout();
    navigate('/');
  };

  return (
    <aside className="w-60 bg-surface h-full flex flex-col shrink-0 border-r border-white/[0.04] pb-24">
      <div className="p-5">
        <h1 className="text-lg font-bold tracking-tight">JAY VIBEZ</h1>
      </div>
      <nav className="flex-1 px-2 space-y-0.5">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-white/[0.08] text-text' : 'text-text2 hover:text-text hover:bg-white/[0.04]'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/[0.04] space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-surface3 flex items-center justify-center text-xs font-medium text-text2">
            {user?.username?.[0]?.toUpperCase() || 'J'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{user?.username}</p>
            <p className="text-xs text-text2 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 bg-red-500/5 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}
