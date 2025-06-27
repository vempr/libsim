import { AdvancedSearchForm } from '@/components/advanced-search';
import { EmptyListPlaceholder } from '@/components/empty';
import InertiaPagination from '@/components/inertia-pagination';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkCard from '@/components/work';
import { useLocalStorage } from '@/hooks/use-local-storage';
import AppLayout from '@/layouts/app-layout';
import { hasOnePage } from '@/lib/pagination';
import { type InertiaProps, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Personal works',
    href: '/works',
  },
];

export default function All() {
  const { worksPaginatedResponse, favoritesPaginatedResponse, searchState } = usePage<InertiaProps>().props;
  const { ls, updateLs } = useLocalStorage('tabsTrigger');
  const [value, setValue] = useState<string>(ls ? 'favorited-works' : 'own-works');

  useEffect(() => {
    if (value === 'own-works') updateLs(false);
    if (value === 'favorited-works') updateLs(true);
  }, [value, updateLs]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Saved works" />

      <AdvancedSearchForm state={searchState} />

      <Tabs
        defaultValue={value}
        onValueChange={setValue}
        className="my-2"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="own-works"
            onClick={() => updateLs(false)}
          >
            Saved Works
          </TabsTrigger>
          <TabsTrigger
            value="favorited-works"
            onClick={() => updateLs(true)}
          >
            Favorited Works
          </TabsTrigger>
        </TabsList>
        <TabsContent value="own-works">
          <ul className="grid grid-cols-1 gap-y-2">
            {worksPaginatedResponse?.data.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
              />
            ))}
          </ul>

          {worksPaginatedResponse?.data.length === 0 && (
            <EmptyListPlaceholder>
              You haven't created any entries yet!{' '}
              <Button
                asChild
                variant="secondary"
              >
                <Link href={route('work.create')}>Create new entry!</Link>
              </Button>
            </EmptyListPlaceholder>
          )}
          {!hasOnePage(worksPaginatedResponse) && worksPaginatedResponse && <InertiaPagination paginateItems={worksPaginatedResponse} />}
        </TabsContent>
        <TabsContent value="favorited-works">
          <ul>
            {favoritesPaginatedResponse?.data.map((favorite) => (
              <li>
                <Link href={`/works/${favorite.id}?favorite=true`}>{JSON.stringify(favorite)}</Link>
              </li>
            ))}
          </ul>

          {favoritesPaginatedResponse?.data.length === 0 && (
            <EmptyListPlaceholder>
              You haven't favorited any entries from your friends yet!{' '}
              <Button
                asChild
                variant="secondary"
              >
                <Link href={route('users.index')}>Favorite an entry!</Link>
              </Button>
            </EmptyListPlaceholder>
          )}
          {!hasOnePage(favoritesPaginatedResponse) && favoritesPaginatedResponse && <InertiaPagination paginateItems={favoritesPaginatedResponse} />}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
