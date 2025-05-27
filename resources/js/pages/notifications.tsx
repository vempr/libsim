import AppLayout from '@/layouts/app-layout';
import { type InertiaProps, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Notifications',
    href: '/notifications',
  },
];

export default function Notifications() {
  const { notifications } = usePage<InertiaProps>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Notifications" />

      <ul>{notifications?.map((notification) => <li>{JSON.stringify(notification)}</li>)}</ul>
    </AppLayout>
  );
}
