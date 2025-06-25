import { AdvancedSearchForm } from '@/components/advanced-search';
import InertiaPagination from '@/components/inertia-pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalStorage } from '@/hooks/use-local-storage';
import AppLayout from '@/layouts/app-layout';
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
          <ul className="flex flex-col gap-y-2">
            {worksPaginatedResponse?.data.map((work) => (
              <li className="max-w-40 overflow-auto">
                <Link href={`/works/${work.id}`}>{JSON.stringify(work)}</Link>
              </li>
            ))}
          </ul>
          {worksPaginatedResponse && <InertiaPagination paginateItems={worksPaginatedResponse} />}
        </TabsContent>
        <TabsContent value="favorited-works">
          <ul>
            {favoritesPaginatedResponse?.data.map((favorite) => (
              <li>
                <Link href={`/works/${favorite.id}?favorite=true`}>{JSON.stringify(favorite)}</Link>
              </li>
            ))}
          </ul>
          {favoritesPaginatedResponse && <InertiaPagination paginateItems={favoritesPaginatedResponse} />}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
