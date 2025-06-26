import InertiaPagination from '@/components/inertia-pagination';
import { MutedP, MutedSpan } from '@/components/muted-text';
import NewCollectionSheet from '@/components/new-collection-sheet';
import AppLayout from '@/layouts/app-layout';
import { getFormattedDate, getRelativeTime } from '@/lib/date';
import { hasOnePage } from '@/lib/pagination';
import { shortenString } from '@/lib/shorten';
import { BreadcrumbItem, InertiaProps } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Collections',
    href: '/collections',
  },
];

export default function All() {
  const { collectionsPaginatedResponse } = usePage<InertiaProps>().props;
  const singlePage = hasOnePage(collectionsPaginatedResponse);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Collections" />

      <NewCollectionSheet />

      <ul className="my-2 grid grid-cols-1 gap-2">
        {collectionsPaginatedResponse?.data.map((collection) => (
          <li key={collection.name}>
            <Link
              href={`/collections/${collection.id}`}
              className="text-card-foreground bg-card border-border hover:bg-card-accent flex h-full w-full flex-col justify-between gap-y-2 rounded-md border px-3 py-2 md:flex-row"
            >
              <div className="flex flex-col overflow-hidden">
                <h2 className="font-secondary text-xl tracking-tight md:text-2xl">
                  {shortenString(collection.name)}{' '}
                  <MutedSpan>
                    <span className="text-base">({collection.works_count})</span>
                  </MutedSpan>
                </h2>
                <p className="text-muted-foreground text-sm">
                  Last updated: {collection.updated_at ? getFormattedDate(collection.updated_at) : ' -'}
                </p>
              </div>

              <div className="text-sm opacity-80">
                <MutedP>Created on {getRelativeTime(collection.created_at)}</MutedP>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {!singlePage && collectionsPaginatedResponse && <InertiaPagination paginateItems={collectionsPaginatedResponse} />}
    </AppLayout>
  );
}
