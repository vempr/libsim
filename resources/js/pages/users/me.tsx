import AppLayout from '@/layouts/app-layout';
import { InertiaProps, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Work() {
  const { user } = usePage<InertiaProps>().props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Your profile',
      href: '/u',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Your profile" />
      <p className="max-w-96 overflow-scroll">{JSON.stringify(user)}</p>

      {/* <Link href={`/works/${work.id}/edit`}>Edit</Link> */}
    </AppLayout>
  );
}
