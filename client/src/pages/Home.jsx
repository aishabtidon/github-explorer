// Home Page - Main search interface with enhanced user data
import React, { useState } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import UserCard from '../components/UserCard.jsx';
import { searchUsers, getUser, getUserRepos, getRepoCommits } from '../api.js';

export default function Home() {
  const [status, setStatus] = useState('idle'); // idle | loading | error | done
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  async function doSearch(q) {
    setStatus('loading');
    setError(null);
    setResults([]);
    
    const { ok, data, error } = await searchUsers(q);
    if (!ok) {
      setStatus('error');
      setError(error || 'Search failed');
      return;
    }
    
    const items = Array.isArray(data?.items) ? data.items : [];
    
    // Fetch detailed info for each user (limit to 5 for performance)
    const detailedUsers = [];
    for (const user of items.slice(0, 5)) {
      try {
        const [userDetails, userRepos] = await Promise.all([
          getUser(user.login),
          getUserRepos(user.login)
        ]);
        
        // Get latest commits from most recent repo
        let latestCommits = [];
        if (userRepos.ok && userRepos.data.length > 0) {
          const latestRepo = userRepos.data[0];
          const commitsResponse = await getRepoCommits(latestRepo.owner.login, latestRepo.name, 5);
          if (commitsResponse.ok) {
            latestCommits = commitsResponse.data;
          }
        }
        
        detailedUsers.push({
          ...user,
          details: userDetails.ok ? userDetails.data : null,
          repos: userRepos.ok ? userRepos.data.slice(0, 3) : [],
          latestCommits: latestCommits
        });
      } catch (err) {
        detailedUsers.push(user);
      }
    }
    
    setResults(detailedUsers);
    setStatus('done');
  }

  return (
    <div className="container home" style={{ padding: '24px 16px' }}>
      {/* SINGLE heading (fixes the double-title issue) */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>GitHub Explorer</h1>
          <nav style={{ opacity: 0.85 }}>
            <span>Search users • Explore repos • View commits</span>
          </nav>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="external-link"
          style={{ textDecoration: 'none' }}
        >
          GitHub ↗
        </a>
      </header>

      <SearchBar onSearch={doSearch} />

      {status === 'loading' && (
        <p style={{ color: 'var(--muted)' }}>Searching…</p>
      )}
      {status === 'error' && (
        <p style={{ color: 'var(--danger)' }}>{String(error)}</p>
      )}

      <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
        {results.map((u) => (
          <UserCard key={u.id ?? u.login} user={u} />
        ))}
      </div>
    </div>
  );
}
