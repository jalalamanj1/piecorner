import express from 'express';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, 'src', 'data', 'menuData.json');
const DIST_DIR = join(__dirname, 'dist');

const PORT = Number(process.env.PORT) || 3999;

const app = express();
app.use(express.json({ limit: '100mb' }));

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/menu-data', (_req, res) => {
  try {
    if (!existsSync(DATA_FILE)) return res.status(404).json({ error: 'not found' });
    res.json(JSON.parse(readFileSync(DATA_FILE, 'utf8')));
  } catch (err) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

app.post('/api/save', (req, res) => {
  const { data } = req.body ?? {};
  if (!data || typeof data !== 'object' || !data.config || !Array.isArray(data.menuItems)) {
    return res.status(400).json({ error: 'invalid payload' });
  }
  try {
    mkdirSync(dirname(DATA_FILE), { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

if (existsSync(join(DIST_DIR, 'index.html'))) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(join(DIST_DIR, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Pie Corner server running on http://localhost:${PORT}`);
});
