import { AdvancedSearchForm } from '@/components/advanced-search';
import InertiaPagination from '@/components/inertia-pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type InertiaProps, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Saved works',
    href: '/works',
  },
];

export default function All() {
  const { worksPagiationResponse, favoritesPagiationResponse, searchState } = usePage<InertiaProps>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Saved works" />

      <AdvancedSearchForm state={searchState} />

      <Tabs
        defaultValue="own-works"
        className="w-[400px]"
      >
        <TabsList>
          <TabsTrigger value="own-works">Saved Works</TabsTrigger>
          <TabsTrigger value="favorited-works">Favorited Works</TabsTrigger>
        </TabsList>
        <TabsContent value="own-works">
          <ul>
            OWN WORKS
            {worksPagiationResponse.data.map((work) => (
              <li>
                <Link href={`/works/${work.id}`}>{JSON.stringify(work)}</Link>
              </li>
            ))}
          </ul>
          <InertiaPagination paginateItems={worksPagiationResponse} />
        </TabsContent>
        <TabsContent value="favorited-works">
          <ul>
            FAVORITED WORKS
            {favoritesPagiationResponse.data.map((favorite) => (
              <li>
                <Link href={`/works/${favorite.id}`}>{JSON.stringify(favorite)}</Link>
              </li>
            ))}
          </ul>
          <InertiaPagination paginateItems={favoritesPagiationResponse} />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
