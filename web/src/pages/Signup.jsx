import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await auth.signup({ username, email, password });
      setUser(data.user);
      navigate('/app');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-5">
          <div className="text-center mb-6">
            <div className="h-8 w-36 skeleton rounded mx-auto mb-3" />
            <div className="h-4 w-28 skeleton rounded mx-auto" />
          </div>
          <div className="skeleton h-12 w-full rounded-xl" />
          <div className="skeleton h-12 w-full rounded-xl" />
          <div className="skeleton h-12 w-full rounded-xl" />
          <div className="skeleton h-12 w-full rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fadeIn">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1.5">JAY VIBEZ</h1>
          <p className="text-sm text-text2">Create your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-text placeholder-text2 focus:outline-none focus:border-accent/40 transition-colors"
              required
              minLength={2}
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-text placeholder-text2 focus:outline-none focus:border-accent/40 transition-colors"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-text placeholder-text2 focus:outline-none focus:border-accent/40 transition-colors"
              required
              minLength={6}
            />
          </div>
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-accent hover:bg-accent-hover text-white rounded-full py-3 text-sm font-medium transition-colors"
          >
            Create Account
          </button>
        </form>
        <p className="text-center text-sm text-text2 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:text-text2 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
