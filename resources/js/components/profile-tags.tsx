import { cn } from '@/lib/utils';

import { Badge } from './ui/badge';

interface ProfileTagsProps {
  title: string;
  tags: string[] | undefined;
  className?: string;
}

export default function ProfileTags({ title, tags, className }: ProfileTagsProps) {
  if (!tags) return;

  return (
    <li className="flex flex-1 flex-col gap-y-1.5">
      <h3 className="flex-1 text-center font-mono text-sm">
        {title} {tags && <span className="text-muted-foreground">({tags.length})</span>}
      </h3>

      {tags ? (
        <ul className="grid max-h-40 scroll-py-1 grid-cols-2 gap-1 overflow-x-hidden overflow-y-auto md:grid-cols-1">
          {tags.map((tag) => (
            <li
              className="w-full"
              key={tag}
            >
              <Badge
                variant="secondary"
                className={cn('h-7 w-full border-2 bg-transparent', className)}
              >
                {tag}
              </Badge>
            </li>
          ))}
        </ul>
      ) : (
        <p>None</p>
      )}
    </li>
  );
}
