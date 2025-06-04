import NewCollectionSheet from '@/components/new-collection-sheet';
import AppLayout from '@/layouts/app-layout';
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Collections" />

      <NewCollectionSheet />

      {collectionsPaginatedResponse.data.map((collection) => (
        <li>
          <Link href={`/collections/${collection.id}`}>{JSON.stringify(collection)}</Link>
        </li>
      ))}
    </AppLayout>
  );
}
