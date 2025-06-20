import AppLayout from '@/layouts/app-layout';
import { InertiaProps, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Work() {
  const { profile } = usePage<InertiaProps>().props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Your profile',
      href: '/u',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Your profile" />
      <p className="max-w-96 overflow-scroll">{JSON.stringify(profile)}</p>

      <Link href={`/u/edit`}>Edit</Link>
    </AppLayout>
  );
}
