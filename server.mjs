// Publish server for Pie Corner admin panel.
// Receives the current config + menu + uploaded images and commits them
// to the GitHub repository, which triggers the Pages redeploy workflow.
//
// Run with: npm run server   (starts on http://localhost:3999)

import express from 'express';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = process.env.PORT || 3999;
const ROOT = resolve(join(fileURLToPath(import.meta.url), '..'));
const IMAGE_DIR = join(ROOT, 'public', 'images');

app.use(express.json({ limit: '40mb' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

function runGit(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
}

function safeImagePath(p) {
  const base = join(IMAGE_DIR);
  const target = normalize(join(base, p));
  if (!target.startsWith(base + sep) && target !== base) {
    throw new Error('image path is not inside public/images');
  }
  const rel = target.slice(base.length + 1).split(sep).join('/');
  if (!/^[A-Za-z0-9_\-.]+$/.test(rel)) throw new Error('invalid image filename');
  return rel;
}

app.get('/api/health', (req, res) => {
  let status = 'ok';
  let branch = null;
  let dirty = false;
  let repo = null;
  try {
    branch = runGit(['rev-parse', '--abbrev-ref', 'HEAD']).trim();
    repo = runGit(['remote', 'get-url', 'origin']).trim();
    dirty = runGit(['status', '--porcelain']).trim().length > 0;
  } catch {
    status = 'error';
  }
  res.json({ ok: status === 'ok', repo, branch, dirty, serverTime: new Date().toISOString() });
});

app.post('/api/save', (req, res) => {
  const { config, menuData, images = [], commitMessage } = req.body || {};
  if (!config || !menuData) {
    return res.status(400).json({ ok: false, error: 'config and menuData are required' });
  }

  const filesChanged = [];

  try {
    writeFileSync(
      join(ROOT, 'src', 'restaurantConfig.json'),
      JSON.stringify(config, null, 2) + '\n',
      'utf8'
    );
    filesChanged.push('src/restaurantConfig.json');

    writeFileSync(
      join(ROOT, 'src', 'menuData.json'),
      JSON.stringify(menuData, null, 2) + '\n',
      'utf8'
    );
    filesChanged.push('src/menuData.json');

    if (!existsSync(IMAGE_DIR)) mkdirSync(IMAGE_DIR, { recursive: true });

    for (const img of images || []) {
      if (!img || typeof img.path !== 'string' || typeof img.base64 !== 'string') continue;
      const rel = safeImagePath(img.path);
      const buf = Buffer.from(img.base64, 'base64');
      writeFileSync(join(IMAGE_DIR, rel), buf);
      filesChanged.push(`public/images/${rel}`);
    }
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }

  let pushed = false;
  let committed = false;
  let message = 'no changes';

  try {
    const status = runGit(['status', '--porcelain']).trim();
    if (status.length === 0) {
      message = 'no changes to commit';
    } else {
      const msg = (commitMessage && commitMessage.trim())
        ? commitMessage.trim()
        : 'Update menu from admin panel';
      runGit(['add', '-A']);
      runGit(['commit', '-m', msg]);
      committed = true;
      const pushOut = runGit(['push', 'origin', 'HEAD']);
      pushed = true;
      message = pushOut.trim() || 'pushed';
    }
  } catch (err) {
    return res.status(500).json({
      ok: false,
      committed,
      pushed,
      files: filesChanged,
      error: String(err.stderr || err.message || err),
    });
  }

  res.json({ ok: true, committed, pushed, files: filesChanged, message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Pie Corner publish server running at http://localhost:${PORT}`);
  console.log(`Repo root: ${ROOT}`);
});
