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
            {user.profile.introduction?.length ? (
              <p className="text-muted-foreground text-sm">{shortenString(user.profile.introduction, 40)}</p>
            ) : (
              <p className="text-muted-foreground font-mono text-sm opacity-80">(No self-introduction)</p>
            )}
          </div>

          <AvatarPicture
            avatar={user.avatar}
            name={user.name}
            is_friend={user.is_friend}
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <p className="font-secondary dark:text-secondary text-sm">Favorite categories</p>
          {user.profile.good_tags ? (
            <ul className="flex max-h-14 w-full flex-wrap gap-1 overflow-hidden lg:flex-nowrap">
              {user.profile.good_tags.includes(',') ? (
                shortenString(user.profile.good_tags, 70)
                  .split(',')
                  .slice(0, -1)
                  .map((tag) => (
                    <li key={tag}>
                      <Badge
                        variant="secondary"
                        className="dark:bg-sidebar-accent h-6"
                      >
                        {tag}
                      </Badge>
                    </li>
                  ))
              ) : (
                <li key={user.profile.good_tags}>
                  <Badge
                    variant="secondary"
                    className="dark:bg-sidebar-accent h-6"
                  >
                    {shortenString(user.profile.good_tags, 70)}
                  </Badge>
                </li>
              )}
            </ul>
          ) : (
            <p className="text-secondary w-full overflow-hidden font-mono opacity-70 dark:opacity-30">{'NULL'.repeat(20)}</p>
          )}
        </div>
      </Link>
    </li>
  );
}
