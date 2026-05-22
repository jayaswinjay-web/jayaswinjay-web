import { Router } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const execAsync = promisify(exec);
const router = Router();

function getYtDlp() {
  const bin = path.join(__dirname, '..', 'node_modules', 'youtube-dl-exec', 'bin', process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');
  return bin;
}

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Video ID required' });

    const url = `https://www.youtube.com/watch?v=${id}`;
    const ytDlp = getYtDlp();

    const { stdout } = await execAsync(`"${ytDlp}" -f "bestaudio[ext=m4a]/bestaudio" -g "${url}"`, { timeout: 15000 });

    const audioUrl = stdout.trim();
    if (!audioUrl) return res.status(404).json({ error: 'No audio stream found' });

    const https = await import('https');
    https.get(audioUrl, (audioRes) => {
      const contentType = audioRes.headers['content-type'] || 'audio/mp4';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Accept-Ranges', 'bytes');
      audioRes.pipe(res);
    }).on('error', () => {
      if (!res.headersSent) res.status(500).json({ error: 'Proxy error' });
    });
  } catch (err) {
    console.error('Stream error:', err.message);
    if (!res.headersSent) res.status(500).json({ error: 'Stream failed' });
  }
});

router.get('/:id/info', async (req, res) => {
  try {
    const ytDlp = getYtDlp();
    const url = `https://www.youtube.com/watch?v=${req.params.id}`;
    const { stdout } = await execAsync(`"${ytDlp}" -f "bestaudio[ext=m4a]/bestaudio" --print-json -j "${url}"`, { timeout: 15000 });
    const data = JSON.parse(stdout);
    res.json({
      url: `/api/stream/${req.params.id}`,
      mimeType: 'audio/mp4',
      bitrate: data.abr || 128,
      contentLength: data.filesize || null
    });
  } catch (err) {
    console.error('Stream info error:', err.message);
    res.status(500).json({ error: 'Failed to get stream info' });
  }
});

export default router;
