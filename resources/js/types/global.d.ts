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
  }
}
