import { shortenString } from '@/lib/shorten';
import { ListUser } from '@/types';
import { Link } from '@inertiajs/react';

import AvatarPicture from './avatar-picture';
import { Badge } from './ui/badge';

export default function UserCard({ user }: { user: ListUser }) {
  return (
    <li key={user.id}>
      <Link
        href={`/users/${user.id}`}
        className="text-card-foreground bg-card border-border hover:bg-card-accent flex h-full w-full flex-col gap-y-2 rounded-md border p-2"
      >
        <div className="flex justify-between">
          <div>
            <h2 className="font-secondary text-xl">{user.name}</h2>
            <p className="text-muted-foreground text-sm">{shortenString(user.profile.introduction)}</p>
          </div>

          <AvatarPicture user={user} />
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="font-secondary dark:text-secondary text-sm">Favorite tags</p>
          {user.profile.good_tags ? (
            <ul className="flex max-h-14 w-full flex-wrap gap-1 overflow-hidden lg:flex-nowrap">
              {user.profile.good_tags.includes(',') ? (
                shortenString(user.profile.good_tags, 70)
                  .split(',')
                  .slice(0, -1)
                  .map((tag) => (
                    <Badge
                      variant="secondary"
                      className="dark:bg-sidebar-accent h-6"
                      key={tag}
                    >
                      {tag}
                    </Badge>
                  ))
              ) : (
                <Badge
                  variant="secondary"
                  className="dark:bg-sidebar-accent h-6"
                  key={user.profile.good_tags}
                >
                  {shortenString(user.profile.good_tags, 70)}
                </Badge>
              )}
            </ul>
          ) : (
            <p className="text-secondary w-full overflow-hidden font-mono opacity-70 dark:opacity-30">{'NULL'.repeat(100)}</p>
          )}
        </div>
      </Link>
    </li>
  );
}
