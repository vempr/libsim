import { BreadcrumbItem } from '@/types';

export function shortenBreadcrumbs(breadcrumbs: BreadcrumbItem[]) {
  return breadcrumbs.map((b) =>
    b.title.length > 30
      ? {
          href: b.href,
          title: b.title.slice(0, 40) + '...',
        }
      : b,
  );
}
