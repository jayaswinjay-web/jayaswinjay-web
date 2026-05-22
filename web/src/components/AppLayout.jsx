import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Player from './Player';
import AudioProvider from './AudioProvider';
import { useAuthStore } from '../store/authStore';
import { auth } from '../lib/api';

const navLinks = [
  { to: '/app', label: 'Home', end: true },
  { to: '/app/search', label: 'Search' },
  { to: '/app/library', label: 'Library' },
  { to: '/app/liked', label: 'Liked Songs' }
];

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await auth.logout(); } catch {}
    logout();
    navigate('/');
  };

  return (
    <AudioProvider>
      <div className="h-screen flex flex-col bg-bg">
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:flex">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-y-auto pb-36 md:pb-24 pt-12 md:pt-0 relative">
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden fixed top-3 left-3 z-30 w-9 h-9 flex items-center justify-center bg-surface border border-white/[0.06] rounded-lg text-text2 hover:text-text"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <Outlet />
          </main>
        </div>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
            <aside className="absolute top-0 left-0 bottom-0 w-64 bg-surface flex flex-col border-r border-white/[0.06] animate-slideIn">
              <div className="flex items-center justify-between p-5">
                <h1 className="text-lg font-bold tracking-tight">JAY VIBEZ</h1>
                <button onClick={() => setDrawerOpen(false)} className="text-text2 hover:text-text">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <nav className="flex-1 px-2 space-y-0.5">
                {navLinks.map(l => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.end}
                    onClick={() => setDrawerOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        isActive ? 'bg-white/[0.08] text-text' : 'text-text2 hover:text-text hover:bg-white/[0.04]'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </nav>
              <div className="p-3 border-t border-white/[0.06] space-y-2">
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
                  onClick={() => { setDrawerOpen(false); handleLogout(); }}
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
          </div>
        )}

        <div className="md:hidden">
          <MobileNav />
        </div>
        <Player />
      </div>
    </AudioProvider>
  );
}
