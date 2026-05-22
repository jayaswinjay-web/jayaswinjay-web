import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { search as searchApi } from '../lib/api';
import SongCard from '../components/SongCard';
import { SongSkeleton } from '../components/Skeleton';
import { useAuthStore } from '../store/authStore';

const greetings = ['Good Morning', 'Good Afternoon', 'Good Evening'];

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? greetings[0] : hour < 18 ? greetings[1] : greetings[2];

  useEffect(() => {
    Promise.all([
      searchApi.query('popular music 2026'),
      searchApi.query('new songs 2026')
    ]).then(([trend, releases]) => {
      setTrending(trend.songs.slice(0, 12));
      setNewReleases(releases.songs.slice(0, 12));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/app/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fadeIn">
      <form onSubmit={handleSearch} className="md:hidden relative mb-2">
        <input
          type="text"
          placeholder="Search any song, artist..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface border border-white/[0.08] rounded-xl px-4 py-3 pl-10 text-sm text-text placeholder-text2 focus:outline-none focus:border-accent/40 transition-colors"
        />
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
      </form>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{greeting}, {user?.username || 'Listener'}</h1>
        <p className="text-sm text-text2 mt-1">Discover something new today</p>
      </div>

      <section>
        <h2 className="text-base font-semibold mb-3 tracking-tight">Trending</h2>
        <div className="space-y-0.5">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SongSkeleton key={i} />)
          ) : (
            trending.map((song, i) => (
              <SongCard key={song.id} song={song} queue={trending} />
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-3 tracking-tight">New Releases</h2>
        <div className="space-y-0.5">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SongSkeleton key={i} />)
          ) : (
            newReleases.map((song, i) => (
              <SongCard key={song.id} song={song} queue={newReleases} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
