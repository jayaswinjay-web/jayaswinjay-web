import { Router } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const execAsync = promisify(exec);
const router = Router();

function getYtDlp() {
  return path.join(__dirname, '..', 'node_modules', 'youtube-dl-exec', 'bin', 'yt-dlp.exe');
}

function parseDuration(d) {
  if (!d) return '0:00';
  if (typeof d === 'number') {
    const m = Math.floor(d / 60);
    const s = Math.floor(d % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
  return d;
}

router.get('/', async (req, res) => {
  try {
    const { q, next } = req.query;
    if (!q) return res.status(400).json({ error: 'Query required' });

    const ytDlp = getYtDlp();
    const limit = next ? 50 : 50;
    const page = next || 1;

    const { stdout } = await execAsync(
      `"${ytDlp}" "ytsearch${limit}:${q.replace(/"/g, '')}" --flat-playlist --dump-json --no-warnings --ignore-errors`,
      { timeout: 20000, maxBuffer: 1024 * 1024 * 5 }
    );

    const lines = stdout.trim().split('\n').filter(Boolean);
    const songs = lines.map(line => {
      try {
        const item = JSON.parse(line);
        return {
          id: item.id || item.url?.match(/v=([^&]+)/)?.[1] || '',
          title: item.title || 'Unknown',
          artist: item.channel || item.uploader || 'Unknown',
          thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
          duration: parseDuration(item.duration),
          isHiRes: false,
          source: 'youtube'
        };
      } catch { return null; }
    }).filter(Boolean);

    res.json({ songs, nextPage: null });
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ error: 'Search failed' });
  }
});

router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ suggestions: [] });

    const ytDlp = getYtDlp();
    const { stdout } = await execAsync(
      `"${ytDlp}" "ytsearch5:${q.replace(/"/g, '')}" --flat-playlist --dump-json --no-warnings --ignore-errors`,
      { timeout: 10000, maxBuffer: 1024 * 1024 }
    );

    const suggestions = stdout.trim().split('\n').filter(Boolean).map(line => {
      try { return JSON.parse(line).title; } catch { return null; }
    }).filter(Boolean);

    res.json({ suggestions });
  } catch {
    res.json({ suggestions: [] });
  }
});

router.get('/song/:id', async (req, res) => {
  try {
    const ytDlp = getYtDlp();
    const url = `https://www.youtube.com/watch?v=${req.params.id}`;
    const { stdout } = await execAsync(
      `"${ytDlp}" -f "bestaudio[ext=m4a]/bestaudio" --print-json -j "${url}"`,
      { timeout: 15000 }
    );

    const item = JSON.parse(stdout);
    res.json({
      song: {
        id: item.id,
        title: item.title,
        artist: item.channel || item.uploader || 'Unknown',
        thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${item.id}/maxresdefault.jpg`,
        duration: item.duration || 0,
        isHiRes: (item.abr || 0) >= 256,
        formats: [{ itag: 0, bitrate: item.abr, mimeType: 'audio/mp4' }],
        description: item.description?.slice(0, 500)
      }
    });
  } catch (err) {
    console.error('Song info error:', err.message);
    res.status(500).json({ error: 'Failed to get song info' });
  }
});

export default router;
