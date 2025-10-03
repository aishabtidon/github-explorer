import React from 'react';

export default function Loader({ text = 'Loading…' }){
  return (
    <div style={{opacity:.9}}>
      <span role="img" aria-label="spinner">⏳</span> {text}
    </div>
  );
}
