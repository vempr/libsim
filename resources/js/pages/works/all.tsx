import { AdvancedSearchForm } from '@/components/advanced-search';
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
  const { works, favorites, searchState, advanced } = usePage<InertiaProps>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Saved works" />

      <AdvancedSearchForm
        state={searchState}
        advanced={advanced}
      />

      <ul>
        FAVORITED WORKS
        {favorites.map((favorite) => (
          <li>
            <Link href={`/works/${favorite.id}`}>{JSON.stringify(favorite)}</Link>
          </li>
        ))}
      </ul>

      <ul>
        OWN WORKS
        {works.map((work) => (
          <li>
            <Link href={`/works/${work.id}`}>{JSON.stringify(work)}</Link>
          </li>
        ))}
      </ul>
    </AppLayout>
  );
}
