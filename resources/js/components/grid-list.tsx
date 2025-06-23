import { cn } from '@/lib/utils';

export default function GridList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ul className={cn('grid grid-cols-1 gap-2 lg:grid-cols-2', className)}>{children}</ul>;
}
