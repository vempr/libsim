import AppLayout from '@/layouts/app-layout';
import { type InertiaProps, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Members',
    href: '/users',
  },
];

export default function All() {
  const { users } = usePage<InertiaProps>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Members" />

      <ul>
        {users.map((user) => (
          <li>
            <Link href={`/users/${user.id}`}>{JSON.stringify(user)}</Link>
          </li>
        ))}
      </ul>
    </AppLayout>
  );
}
