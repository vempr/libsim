import { ReactNode } from 'react';

export function EmptyListPlaceholder({ children }: { children: ReactNode }) {
  return <div className="font-secondary text-muted-foreground mt-3 flex flex-col items-center justify-center gap-2 text-2xl">{children}</div>;
}
