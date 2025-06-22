import AppLayout from '@/layouts/app-layout';
import { InertiaProps, SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Dashboard() {
  const { auth, dashboardData } = usePage<InertiaProps & SharedData>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      hi {auth.user.name}
      {JSON.stringify(Object.entries(dashboardData.tags).sort((a, b) => b[1] - a[1]))}
    </AppLayout>
  );
}
