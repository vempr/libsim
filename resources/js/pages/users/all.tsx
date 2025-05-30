import InertiaPagination from '@/components/inertia-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalStorage } from '@/hooks/use-local-storage';
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
  const { usersPaginatedResponse, userQuery, friendsPaginatedResponse } = usePage<InertiaProps>().props;
  const [searchQuery, setSearchQuery] = useState(userQuery || '');
  const { ls, updateLs } = useLocalStorage('friendsOnly');
  const [value, setValue] = useState<string>(ls ? 'friends' : 'others');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialLoad = useRef(true);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (searchQuery === userQuery) return;

    setIsSubmitting(true);
    router.get(
      route('users.index', { userQuery: searchQuery, friendsPage: friendsPaginatedResponse.current_page }),
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
        route('users.index', {
          friendsPage: 1,
        }),
        {},
        {
          onFinish: () => setIsSubmitting(false),
        },
      );
    }
  }, [searchQuery, userQuery]);

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

      <Tabs
        defaultValue={value}
        onValueChange={setValue}
        className="w-[400px]"
      >
        <TabsList>
          <TabsTrigger
            value="others"
            onClick={() => updateLs(false)}
          >
            Browser users
          </TabsTrigger>
          <TabsTrigger
            value="friends"
            onClick={() => updateLs(true)}
          >
            Friends
          </TabsTrigger>
        </TabsList>
        <TabsContent value="others">
          <ul>
            {usersPaginatedResponse.data.map((user) => {
              if (user.is_friend) {
                return (
                  <li>
                    <Link
                      href={`/users/${user.id}`}
                      className="bg-green-800"
                    >
                      {JSON.stringify(user)}
                    </Link>
                  </li>
                );
              }
              return (
                <li>
                  <Link href={`/users/${user.id}`}>{JSON.stringify(user)}</Link>
                </li>
              );
            })}
          </ul>
          <InertiaPagination paginateItems={usersPaginatedResponse} />
        </TabsContent>
        <TabsContent value="friends">
          <ul>
            {friendsPaginatedResponse.data.map((friend) => (
              <li>
                <Link
                  href={`/users/${friend.id}`}
                  className="bg-green-600"
                >
                  {JSON.stringify(friend)}
                </Link>
              </li>
            ))}
          </ul>
          <InertiaPagination paginateItems={friendsPaginatedResponse} />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
