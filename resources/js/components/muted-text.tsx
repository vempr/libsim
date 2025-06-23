import React from 'react';

export function MutedP({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground font-mono">{children}</p>;
}

export function MutedSpan({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground font-mono">{children}</span>;
}
