import GridList from '@/components/grid-list';
import InertiaPagination from '@/components/inertia-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserCard from '@/components/user-card';
import { useLocalStorage } from '@/hooks/use-local-storage';
import AppLayout from '@/layouts/app-layout';
import { hasOnePage } from '@/lib/pagination';
import { type InertiaProps, type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
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

  const { ls, updateLs } = useLocalStorage('friendsOnly');

  const [searchQuery, setSearchQuery] = useState(userQuery || '');
  const [value, setValue] = useState<string>(ls ? 'friends' : 'others');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialLoad = useRef(true);

  const usersOnePage = hasOnePage(usersPaginatedResponse);
  const friendsOnePage = hasOnePage(friendsPaginatedResponse);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (searchQuery === userQuery) return;
    if (searchQuery.length === 0) return;

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
  }, [searchQuery, userQuery, updateLs]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Members" />

      <Tabs
        defaultValue={value}
        onValueChange={setValue}
        className="w-full"
      >
        <TabsList className="flex h-full w-full flex-col gap-1.5 bg-transparent md:flex-row">
          <div className="bg-muted flex w-full gap-x-0.75 rounded-md md:w-min">
            <TabsTrigger
              value="others"
              onClick={() => updateLs(false)}
              className="bg-muted flex-1 rounded-r-none p-[7px] px-4 group-data-[state:active]:z-10 hover:cursor-pointer"
            >
              All users
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              onClick={() => updateLs(true)}
              className="bg-muted flex-1 rounded-l-none p-[7px] px-4 hover:cursor-pointer"
            >
              Friends
            </TabsTrigger>
          </div>

          <form
            className="flex w-full flex-1 gap-x-1.5"
            onSubmit={handleSubmit}
          >
            <Input
              value={searchQuery ?? undefined}
              onChange={(e) => setSearchQuery(e.target.value.trim())}
              placeholder="Search for user..."
              className="flex-1"
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
        </TabsList>
        <TabsContent value="others">
          <GridList>
            {usersPaginatedResponse?.data.map((user) => (
              <UserCard
                key={user.id}
                user={user}
              />
            ))}
          </GridList>

          {!usersOnePage && usersPaginatedResponse && <InertiaPagination paginateItems={usersPaginatedResponse} />}
        </TabsContent>
        <TabsContent
          value="friends"
          className="h-full"
        >
          {friendsPaginatedResponse?.data.length ? (
            <GridList>
              {friendsPaginatedResponse.data.map((friend) => (
                <UserCard
                  key={friend.id}
                  user={{ ...friend, is_friend: 1 }}
                />
              ))}
            </GridList>
          ) : (
            <div className="font-secondary mt-3 flex justify-center text-2xl opacity-30">
              <p>No friends :(</p>
            </div>
          )}

          {!friendsOnePage && friendsPaginatedResponse && <InertiaPagination paginateItems={friendsPaginatedResponse} />}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
