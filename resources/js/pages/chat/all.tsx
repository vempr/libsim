import AppLayout from '@/layouts/app-layout';
import { type InertiaProps, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Messages',
    href: '/chat',
  },
];

export default function All() {
  const { friends } = usePage<InertiaProps>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Messages" />

      <ul>
        {friends.map((friend) => (
          <li>
            <Link href={`/chat/${friend.id}`}>{JSON.stringify(friend)}</Link>
          </li>
        ))}
      </ul>
    </AppLayout>
  );
}
