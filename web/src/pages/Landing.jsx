import { Link } from 'react-router-dom';

const features = [
  { title: 'Unlimited Music', desc: 'Every song on YouTube, ad-free. Search any track and play instantly.' },
  { title: 'High Resolution Audio', desc: 'High-quality audio streaming for the best listening experience.' },
  { title: 'Cross-Platform', desc: 'Web and Android app with seamless sync. Your music everywhere.' },
  { title: 'Smart Queue', desc: 'Intelligent queue management, shuffle, repeat modes.' },
  { title: 'Unlimited Playlists', desc: 'Create unlimited playlists, save favorites, organize your library.' },
  { title: 'Your Privacy', desc: 'No tracking. No ads. Your data stays yours with cookie-based auth.' }
];

const stats = [
  { value: '100M+', label: 'Songs Available' },
  { value: '0', label: 'Ads' },
  { value: 'Hi-Res', label: 'Audio Quality' },
  { value: '24/7', label: 'Uptime' }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-white">
            JAY VIBEZ
          </span>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-text2 hover:text-white transition-colors">Sign in</Link>
            <Link to="/signup" className="text-sm bg-accent text-white px-5 py-2 rounded-full hover:bg-accent-hover transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-36 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-white/[0.06] rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-xs text-text2 tracking-wide uppercase">Ad-Free Music Streaming</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Every Song.
            <br />
            <span className="text-accent">Zero Ads.</span>
          </h1>
          <p className="text-lg text-text2 max-w-2xl mx-auto mb-10 leading-relaxed">
            JAY VIBEZ gives you access to every song on YouTube in high quality, 
            with no advertisements, no tracking, and no limits.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/signup" className="bg-accent hover:bg-accent-hover text-white px-8 py-3.5 rounded-full text-base font-medium transition-colors">
              Start Listening Free
            </Link>
            <Link to="/login" className="border border-white/[0.12] hover:border-white/[0.24] text-white px-8 py-3.5 rounded-full text-base font-medium transition-colors">
              Sign In
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map(s => (
              <div key={s.label}>
                <p className="text-3xl font-bold tracking-tight">{s.value}</p>
                <p className="text-sm text-text2 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-4">Everything you expect. And more.</h2>
          <p className="text-text2 text-center mb-16 max-w-xl mx-auto">
            Features designed to replace your current streaming service.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(f => (
              <div key={f.title} className="bg-surface rounded-xl p-6 border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                </div>
                <h3 className="text-base font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-text2 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-6">Ready to switch?</h2>
          <p className="text-text2 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of users who have replaced their music streaming service with JAY VIBEZ.
          </p>
          <Link to="/signup" className="bg-accent hover:bg-accent-hover text-white px-10 py-4 rounded-full text-base font-medium transition-colors inline-block">
            Get Started Free
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/[0.04] py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-sm text-text2">JAY VIBEZ</span>
          <span className="text-sm text-text2">Powered by YouTube</span>
        </div>
      </footer>
    </div>
  );
}
