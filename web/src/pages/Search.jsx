import { useState, useEffect, useRef } from 'react';
import { search as searchApi } from '../lib/api';
import SongCard from '../components/SongCard';
import { SearchSkeleton } from '../components/Skeleton';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const d = await searchApi.suggestions(query);
        setSuggestions(d.suggestions.slice(0, 5));
      } catch {}
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const doSearch = async (q, next) => {
    setLoading(true);
    setSearched(true);
    try {
      const d = await searchApi.query(q || query, next);
      if (next) {
        setResults(prev => [...prev, ...d.songs]);
      } else {
        setResults(d.songs);
      }
      setNextPage(d.nextPage);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) doSearch();
  };

  const handleSuggestionClick = (s) => {
    setQuery(s);
    doSearch(s);
  };

  return (
    <div className="p-6 animate-fadeIn">
      <form onSubmit={handleSubmit} className="relative mb-6">
        <input
          type="text"
          placeholder="Search any song, artist, or album..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-surface border border-white/[0.08] rounded-xl px-5 py-3.5 pl-11 text-sm text-text placeholder-text2 focus:outline-none focus:border-accent/40 transition-colors"
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-text2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        {suggestions.length > 0 && query && !searched && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface2 border border-white/[0.08] rounded-xl overflow-hidden z-10">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSuggestionClick(s)}
                className="w-full text-left px-4 py-2.5 text-sm text-text2 hover:text-text hover:bg-white/[0.03] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </form>

      {loading ? (
        <SearchSkeleton />
      ) : results.length > 0 ? (
        <div>
          <div className="space-y-0.5">
            {results.map((song, i) => (
              <SongCard key={song.id + i} song={song} queue={results} />
            ))}
          </div>
          {nextPage && (
            <div className="text-center mt-6">
              <button
                onClick={() => doSearch(query, nextPage)}
                className="bg-surface2 hover:bg-surface3 text-sm text-text px-6 py-2.5 rounded-full transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      ) : searched ? (
        <div className="text-center py-20">
          <p className="text-text2">No results found for "{query}"</p>
        </div>
      ) : null}
    </div>
  );
}
