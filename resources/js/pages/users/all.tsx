import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

      <ul>
        {friends?.map((friend) => (
          <li>
            <Link
              href={`/users/${friend.id}`}
              className="bg-green-600"
            >
              {JSON.stringify(friend)}
            </Link>
          </li>
        ))}
        {users.map((user) => (
          <li>
            <Link href={`/users/${user.id}`}>{JSON.stringify(user)}</Link>
          </li>
        ))}
      </ul>
    </AppLayout>
  );
}
