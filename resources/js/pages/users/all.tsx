import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useFriendsOnly } from '@/hooks/use-friends-only';
import AppLayout from '@/layouts/app-layout';
import { type InertiaProps, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Members',
    href: '/users',
  },
];

export default function All() {
  const { users, userQuery, friends } = usePage<InertiaProps>().props;
  const [searchQuery, setSearchQuery] = useState(userQuery || '');
  const { friendsOnly, updateFriendsOnly } = useFriendsOnly();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialLoad = useRef(true);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (searchQuery === userQuery) return;

    setIsSubmitting(true);
    router.get(
      route('users.index', { userQuery: searchQuery }),
      {},
      {
        onFinish: () => setIsSubmitting(false),
      },
    );
  };

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    if (searchQuery === '' && userQuery !== '') {
      setIsSubmitting(true);
      router.get(
        route('users.index'),
        {},
        {
          onFinish: () => setIsSubmitting(false),
        },
      );
    }
  }, [searchQuery]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Members" />

      <form onSubmit={handleSubmit}>
        <Input
          value={searchQuery ?? undefined}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="not-sr-only"
        >
          <Search />
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="sr-only"
        >
          Search for user
        </Button>
      </form>

      <div className="flex items-center space-x-2">
        <Switch
          id="friends-only"
          checked={friendsOnly}
          onCheckedChange={updateFriendsOnly}
        />
        <Label htmlFor="friends-only">Show friends only</Label>
      </div>

      <ul>
        {friendsOnly
          ? friends?.map((friend) => (
              <li>
                <Link
                  href={`/users/${friend.id}`}
                  className="bg-green-600"
                >
                  {JSON.stringify(friend)}
                </Link>
              </li>
            ))
          : users.map((user) => {
              if (friends?.some((f) => f.id === user.id))
                return (
                  <li>
                    <Link
                      href={`/users/${user.id}`}
                      className="bg-green-600"
                    >
                      {JSON.stringify(user)}
                    </Link>
                  </li>
                );
              return (
                <li>
                  <Link href={`/users/${user.id}`}>{JSON.stringify(user)}</Link>
                </li>
              );
            })}
      </ul>
    </AppLayout>
  );
}
