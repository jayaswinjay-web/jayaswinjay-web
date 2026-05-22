import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { auth } from './lib/api';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Playlist from './pages/Playlist';
import LikedSongs from './pages/LikedSongs';
import AppLayout from './components/AppLayout';

export default function App() {
  const { user, loading, setUser } = useAuthStore();

  useEffect(() => {
    auth.me().then(d => setUser(d.user)).catch(() => setUser(null));
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-bg flex items-center justify-center">
        <div className="w-6 h-6 border border-text2 border-t-transparent rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/app" /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/app" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/app" /> : <Signup />} />
      <Route path="/app" element={user ? <AppLayout /> : <Navigate to="/login" />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="library" element={<Library />} />
        <Route path="playlist/:id" element={<Playlist />} />
        <Route path="liked" element={<LikedSongs />} />
      </Route>
    </Routes>
  );
}
