import { Router } from 'express';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateToken, verifyToken } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();
const USERS_FILE = path.join(__dirname, '../data/users.json');

function getUsers() {
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')); }
  catch { return []; }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' });
  
  const users = getUsers();
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already registered' });
  if (users.find(u => u.username === username)) return res.status(400).json({ error: 'Username taken' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), username, email, password: hashedPassword, playlists: [], likes: [], createdAt: new Date().toISOString() };
  users.push(user);
  saveUsers(users);

  const token = generateToken(user);
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 30 * 24 * 60 * 60 * 1000 });
  res.json({ user: { id: user.id, username: user.username, email: user.email } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

  const token = generateToken(user);
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 30 * 24 * 60 * 60 * 1000 });
  res.json({ user: { id: user.id, username: user.username, email: user.email } });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

router.get('/me', verifyToken, (req, res) => {
  const users = getUsers();
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: { id: user.id, username: user.username, email: user.email, playlists: user.playlists || [], likes: user.likes || [] } });
});

router.put('/profile', verifyToken, async (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  if (username) users[idx].username = username;
  if (password) users[idx].password = await bcrypt.hash(password, 10);
  saveUsers(users);
  res.json({ user: { id: users[idx].id, username: users[idx].username, email: users[idx].email } });
});

router.post('/playlists', verifyToken, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Playlist name required' });
  const users = getUsers();
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  if (!users[idx].playlists) users[idx].playlists = [];
  users[idx].playlists.push({ id: Date.now().toString(), name, songs: [], createdAt: new Date().toISOString() });
  saveUsers(users);
  res.json({ playlists: users[idx].playlists });
});

router.post('/playlists/:id/songs', verifyToken, (req, res) => {
  const { song } = req.body;
  const users = getUsers();
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  const pl = users[idx].playlists?.find(p => p.id === req.params.id);
  if (!pl) return res.status(404).json({ error: 'Playlist not found' });
  if (!pl.songs.find(s => s.id === song.id)) pl.songs.push(song);
  saveUsers(users);
  res.json({ playlists: users[idx].playlists });
});

router.delete('/playlists/:id/songs/:songId', verifyToken, (req, res) => {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  const pl = users[idx].playlists?.find(p => p.id === req.params.id);
  if (!pl) return res.status(404).json({ error: 'Playlist not found' });
  pl.songs = pl.songs.filter(s => s.id !== req.params.songId);
  saveUsers(users);
  res.json({ playlists: users[idx].playlists });
});

router.post('/likes', verifyToken, (req, res) => {
  const { song } = req.body;
  const users = getUsers();
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  if (!users[idx].likes) users[idx].likes = [];
  if (!users[idx].likes.find(s => s.id === song.id)) users[idx].likes.push(song);
  saveUsers(users);
  res.json({ likes: users[idx].likes });
});

router.delete('/likes/:songId', verifyToken, (req, res) => {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  users[idx].likes = (users[idx].likes || []).filter(s => s.id !== req.params.songId);
  saveUsers(users);
  res.json({ likes: users[idx].likes });
});

export default router;
