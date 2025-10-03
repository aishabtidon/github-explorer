import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (query) onSearch(query);
  };

  return (
    <form className="searchbar" onSubmit={submit}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search GitHub users (e.g. octocat)"
      />
      <button type="submit">Search</button>
    </form>
  );
}
