import { useState, useEffect } from 'react';
import { search as searchApi } from '../lib/api';
import SongCard from '../components/SongCard';
import { SongSkeleton } from '../components/Skeleton';
import { useAuthStore } from '../store/authStore';

const greetings = ['Good Morning', 'Good Afternoon', 'Good Evening'];

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

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

  return (
    <div className="p-6 space-y-10 animate-fadeIn">
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
