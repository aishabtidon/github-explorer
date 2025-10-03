// client/src/pages/Repo.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader.jsx';
import ExternalLink from '../components/ExternalLink.jsx';
import { getRepo, getRepoCommits } from '../api.js';

function fmt(d) {
  try { return new Date(d).toLocaleString(); } catch { return d; }
}

export default function Repo() {
  const { owner, name } = useParams();
  const [loading, setLoading] = useState(true);
  const [repo, setRepo] = useState(null);
  const [commits, setCommits] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      const [r, c] = await Promise.all([getRepo(owner, name), getRepoCommits(owner, name, 5)]);
      if (!r.ok) { if (mounted) { setError(r.error || 'Failed to load repo'); setLoading(false); } return; }
      if (!c.ok) { if (mounted) { setError(c.error || 'Failed to load commits'); setLoading(false); } return; }
      if (mounted) {
        setRepo(r.data);
        setCommits(Array.isArray(c.data) ? c.data : []);
        setError('');
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [owner, name]);

  if (loading) return <Loader text="Loading repository…" />;
  if (error) return <p style={{ color: 'var(--danger)' }}>{error}</p>;
  if (!repo) return <p>Not found</p>;

  return (
    <div className="repo-page">
      <header>
        <h2 style={{ marginBottom: 6 }}>{owner}/{name}</h2>
        <p style={{ marginTop: 0, color: 'var(--muted)' }}>{repo.description || 'No description'}</p>
        <div style={{ marginBottom: 10 }}>
          <small>Created: {fmt(repo.created_at)}</small>
          <small style={{ marginLeft: 12 }}>Last commit: {fmt(repo.pushed_at)}</small>
        </div>
        <ExternalLink href={repo.html_url}>View repo on GitHub</ExternalLink>
      </header>

      <section style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Last 5 commits</h3>
        {commits.length === 0 && <p>No recent commits.</p>}
        <ol className="commit-list">
          {commits.map(c => (
            <li key={c.sha} className="commit-row">
              <p style={{ margin: 0 }}>{c.message.split('\n')[0]}</p>
              <small style={{ color: 'var(--muted)' }}>
                {c.author} • {fmt(c.date)}
              </small>
              <div>
                <ExternalLink href={c.html_url}>View commit</ExternalLink>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
