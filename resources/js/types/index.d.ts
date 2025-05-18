import type { Page, PageProps } from '@inertiajs/inertia';
import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

import { PublicationStatus, ReadingStatus, Work } from './schemas/work.ts';

export interface Auth {
  user: User;
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface FlashMessages {
  success?: string;
  error?: string;
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  ziggy: Config & { location: string };
  sidebarOpen: boolean;
  [key: string]: unknown;
}

export interface InertiaProps extends Page<PageProps> {
  work: Work;
  works: Work[];
  flash?: FlashMessages;
  searchState?: {
    q: string | null;
    author: string | null;
    tags: string | null;
    language_original: string | null;
    language_translated: string | null;
    status_publication: PublicationStatus | null;
    status_reading: ReadingStatus | null;
    publication_year: number | null;
  };
  advanced: boolean;
  [key: string]: unknown;
}
