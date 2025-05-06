import type { Page, PageProps } from '@inertiajs/inertia';
import type { route as routeFn } from 'ziggy-js';

interface Work {
  id: number;
  user_id: number;
  title: string;
  description?: string | null;
  status?: string | null;
  author?: string | null;
  language_original?: string | null;
  language_translated?: string | null;
  publication_year?: number | null;
  image?: string | null;
  created_at: string;
  updated_at: string;
}

declare global {
  const route: typeof routeFn;

  interface InertiaProps extends Page<PageProps> {
    work: Work;
    works: Work[];
    [key: string]: any;
  }
}
