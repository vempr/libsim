import InertiaPagination from '@/components/inertia-pagination';
import AppLayout from '@/layouts/app-layout';
import { hasOnePage } from '@/lib/pagination';
import { type InertiaProps, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Messages',
    href: '/chat',
  },
];

export default function All() {
  const { friendsPaginatedResponse } = usePage<InertiaProps>().props;
  const singlePage = hasOnePage(friendsPaginatedResponse);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Messages" />

      <ul>
        {friendsPaginatedResponse?.data.map((friend) => (
          <li className="mb-2">
            <Link href={`/chat/${friend.id}`}>{JSON.stringify(friend)}</Link>
          </li>
        ))}
      </ul>

      {!singlePage && friendsPaginatedResponse && <InertiaPagination paginateItems={friendsPaginatedResponse} />}
    </AppLayout>
  );
}
