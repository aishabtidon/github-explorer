// client/src/components/UserCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ExternalLink from './ExternalLink.jsx';

function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
}

export default function UserCard({ user }) {
  if (!user) return null;

  const userDetails = user.details;
  const repos = user.repos || [];
  const commits = user.latestCommits || [];

  return (
    <div className="user-card" style={{
      padding: 16,
      borderRadius: 12,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.1)',
      marginBottom: 16
    }}>
      {/* User Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <img
          src={user.avatar_url}
          alt={`${user.login} avatar`}
          width={60}
          height={60}
          style={{ borderRadius: '50%' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <Link to={`/user/${user.login}`} className="internal-link" style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
              {user.login}
            </Link>
            <span onClick={(e) => e.stopPropagation()}>
              <ExternalLink href={user.html_url}>View on GitHub ↗</ExternalLink>
            </span>
          </div>
          {userDetails?.bio && (
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9em' }}>
              {userDetails.bio}
            </p>
          )}
          {userDetails?.name && userDetails.name !== user.login && (
            <p style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: '0.9em' }}>
              {userDetails.name}
            </p>
          )}
        </div>
      </div>

      {/* Repositories Section */}
      {repos.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '1em', color: 'var(--accent)' }}>Recent Repositories</h4>
          <div style={{ display: 'grid', gap: 6 }}>
            {repos.map(repo => (
              <div key={repo.id} style={{
                padding: 8,
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Link to={`/repo/${repo.owner.login}/${repo.name}`} className="internal-link">
                    {repo.name}
                  </Link>
                  <span onClick={(e) => e.stopPropagation()}>
                    <ExternalLink href={repo.html_url}>↗</ExternalLink>
                  </span>
                </div>
                {repo.description && (
                  <p style={{ margin: 0, fontSize: '0.85em', color: 'var(--muted)' }}>
                    {repo.description}
                  </p>
                )}
                <div style={{ fontSize: '0.75em', color: 'var(--muted)', marginTop: 4 }}>
                  Created: {formatDate(repo.created_at)} • 
                  Last commit: {formatDate(repo.pushed_at)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Latest Commits Section */}
      {commits.length > 0 && (
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '1em', color: 'var(--accent)' }}>Latest Commits</h4>
          <div style={{ display: 'grid', gap: 4 }}>
            {commits.map((commit, index) => (
              <div key={commit.sha || index} style={{
                padding: 6,
                background: 'rgba(255,255,255,0.02)',
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: '0.85em', color: 'var(--text)' }}>
                    {commit.message?.split('\n')[0]}
                  </span>
                  <span onClick={(e) => e.stopPropagation()}>
                    <ExternalLink href={commit.html_url}>↗</ExternalLink>
                  </span>
                </div>
                <div style={{ fontSize: '0.75em', color: 'var(--muted)' }}>
                  {commit.author} • {formatDate(commit.date)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Full Profile Link */}
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <Link to={`/user/${user.login}`} className="btn" style={{ fontSize: '0.9em' }}>
          View Full Profile →
        </Link>
      </div>
    </div>
  );
}
