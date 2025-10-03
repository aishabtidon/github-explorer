import React from 'react';
import { Link } from 'react-router-dom';
import ExternalLink from './ExternalLink.jsx';

export default function RepoCard({ repo }){
  return (
    <div className="card">
      <div style={{fontWeight:700}}>{repo.name}</div>
      <div className="repo-meta">{repo.description || 'No description'}</div>
      <div className="row" style={{marginTop:10}}>
        <ExternalLink href={repo.html_url}>On GitHub</ExternalLink>
        <Link className="btn" to={`/repo/${repo.owner.login}/${repo.name}`}>Open</Link>
      </div>
    </div>
  );
}
