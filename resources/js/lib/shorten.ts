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

export function shortenString(s: string | null, length?: number) {
  if (!s) return '';

  if (length) {
    return s.length > length ? s.slice(0, length) + '...' : s;
  }

  return s.length > 30 ? s.slice(0, 30) + '...' : s;
}
