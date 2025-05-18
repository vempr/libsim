import type { Page, PageProps } from '@inertiajs/inertia';
import type { route as routeFn } from 'ziggy-js';
import { Work } from './index.d.ts';

declare global {
  const route: typeof routeFn;

  interface InertiaProps extends Page<PageProps> {
    work: Work;
    works: Work[];
    [key: string]: unknown;
    flash: {
      success: string | undefined;
      error: string | undefined;
    };
    state: {
      q: string | null;
      author: string | null;
      tags: string | null;
      language_original: string | null;
      language_translated: string | null;
      status_publication: 'unknown' | 'ongoing' | 'completed' | 'hiatus' | 'cancelled' | null;
      status_reading: 'reading' | 'completed' | 'on hold' | 'dropped' | null;
      publication_year: number | null;
    };
  }
}
