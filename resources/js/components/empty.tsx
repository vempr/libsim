import { ReactNode } from 'react';

export function EmptyListPlaceholder({ children }: { children: ReactNode }) {
  return <div className="font-secondary text-muted-foreground mt-3 flex flex-col items-center justify-center gap-2 md:text-2xl">{children}</div>;
}

export function EmptyBottomMargin() {
  return <div className="mb-2.5"></div>;
}
