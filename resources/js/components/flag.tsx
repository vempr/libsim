import { cn } from '@/lib/utils';

type FlagProps = {
  name: string;
  code: string;
  shadow?: boolean;
  size?: 'sm' | 'lg';
};

export function Flag({ name, code, shadow, size }: FlagProps) {
  return (
    <img
      alt={name}
      src={`/flags/${code}.svg`}
      className={cn('border-border/20 z-50 w-6 rounded-xs border', shadow ? 'shadow-2xl' : '', size ? 'w-10' : '')}
    />
  );
}
