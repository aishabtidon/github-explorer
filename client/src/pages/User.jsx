// client/src/pages/User.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loader from '../components/Loader.jsx';
import ExternalLink from '../components/ExternalLink.jsx';
import { getUser, getUserRepos } from '../api.js';

function fmt(d) {
  try { return new Date(d).toLocaleString(); } catch { return d; }
}

export default function User() {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      const [u, r] = await Promise.all([getUser(username), getUserRepos(username)]);
      if (!u.ok) {
        if (mounted) { setError(u.error || 'Failed to load user'); setLoading(false); }
        return;
      }
      if (!r.ok) {
        if (mounted) { setError(r.error || 'Failed to load repos'); setLoading(false); }
        return;
      }
      if (mounted) {
        setPayload(u.data);
        setRepos(Array.isArray(r.data) ? r.data : []);
        setError('');
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [username]);

  if (loading) return <Loader text="Loading user…" />;
  if (error) return <p style={{ color: 'var(--danger)' }}>{error}</p>;
  if (!payload) return <p>Not found</p>;

  return (
    <div className="user-page">
      <header className="user-header">
        <img src={payload.avatar_url} alt={`${payload.login} avatar`} width={88} height={88} style={{ borderRadius: '50%' }} />
        <div>
          <h2 style={{ margin: 0 }}>{payload.name || payload.login}</h2>
          <p style={{ margin: '6px 0', color: 'var(--muted)' }}>{payload.bio || 'No bio provided.'}</p>
          <ExternalLink href={payload.html_url}>View on GitHub</ExternalLink>
        </div>
      </header>

      <section style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Repositories</h3>
        {repos.length === 0 && <p>No repositories.</p>}
        <ul className="repo-list">
          {repos.map(r => (
            <li key={r.id} className="repo-row">
              <div className="repo-meta">
                <Link to={`/repo/${r.owner.login}/${r.name}`} className="repo-name">{r.name}</Link>
                <p className="repo-desc">{r.description || 'No description'}</p>
              </div>
              <div className="repo-dates">
                <small>Created: {fmt(r.created_at)}</small>
                <small style={{ marginLeft: 12 }}>Last commit: {fmt(r.pushed_at)}</small>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
