// GitHub Explorer Server - Express.js API
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

// Configure fetch for tests vs production
let fetch;
if (global.fetch && process.env.NODE_ENV !== 'production') {
  fetch = global.fetch;
} else {
  fetch = globalThis.fetch || require('node-fetch');
}

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Search GitHub users
app.get('/api/search/users', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: "query param 'q' is required" });

  try {
    const url = `https://api.github.com/search/users?q=${encodeURIComponent(q)}`;
    console.log('Fetching URL:', url);
    const gh = await fetch(url);
    if (!gh.ok) return res.status(gh.status).json({ error: await gh.text() || 'GitHub error' });
    const data = await gh.json();
    return res.json({ items: data.items || [] });
  } catch (e) {
    console.log('Fetch error:', e.message);
    return res.status(500).json({ error: 'Upstream error' });
  }
});

// --- USER DETAILS + REPOS ---------------------------------------------------
app.get('/api/user/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const gh = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
    if (!gh.ok) return res.status(gh.status).json({ error: await gh.text() || 'GitHub error' });
    const data = await gh.json();
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Upstream error' });
  }
});

app.get('/api/user/:username/repos', async (req, res) => {
  const { username } = req.params;
  try {
    // sort by updated so “last commit date” (pushed_at) is meaningful at a glance
    const gh = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`);
    if (!gh.ok) return res.status(gh.status).json({ error: await gh.text() || 'GitHub error' });
    const data = await gh.json();
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Upstream error' });
  }
});

// --- REPO DETAILS + COMMITS -------------------------------------------------
app.get('/api/repo/:owner/:name', async (req, res) => {
  const { owner, name } = req.params;
  try {
    const gh = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`);
    if (!gh.ok) return res.status(gh.status).json({ error: await gh.text() || 'GitHub error' });
    const data = await gh.json();
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Upstream error' });
  }
});

app.get('/api/repo/:owner/:name/commits', async (req, res) => {
  const { owner, name } = req.params;
  const limit = Math.min(parseInt(req.query.limit || '5', 10) || 5, 20);
  try {
    const gh = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/commits?per_page=${limit}`);
    if (!gh.ok) return res.status(gh.status).json({ error: await gh.text() || 'GitHub error' });
    const data = await gh.json();
    // keep only minimal info the UI needs
    const commits = (Array.isArray(data) ? data : []).map(c => ({
      sha: c.sha,
      message: c.commit?.message || '',
      author: c.commit?.author?.name || c.author?.login || 'unknown',
      date: c.commit?.author?.date || null,
      html_url: c.html_url
    }));
    return res.json(commits);
  } catch (e) {
    return res.status(500).json({ error: 'Upstream error' });
  }
});

// 404 for unknown API routes
app.use('/api', (_req, res) => res.status(404).json({ error: 'route not found' }));

// Only start the server if this file is run directly (not imported for tests)
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
}

module.exports = app;