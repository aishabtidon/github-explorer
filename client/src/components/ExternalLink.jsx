import React from 'react';
export default function ExternalLink({ href, children }){
  return <a className="external" href={href} target="_blank" rel="noreferrer">{children} ↗</a>;
}
