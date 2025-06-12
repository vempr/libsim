import type { Page, PageProps } from '@inertiajs/inertia';
import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

import { Work } from './schemas/work.ts';

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

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface ListUser extends ChatUser {
  introduction?: string;
}

export interface ProfileUser extends ListUser {
  description?: string;
}

export interface User extends ProfileUser {
  email: string;
  email_verified_at: string | null;
  hide_profile: boolean;
  private_works: boolean;
}

export interface FlashMessages {
  success?: string;
  error?: string;
}

export type FriendRequestStatus = 'mutual' | 'pending' | 'expecting' | null;

export interface Notification {
  id: number;
  type: 'friend_request' | 'reminder';
  sender_id: number;
  receiver_id: number;
  mood: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  image?: string | null;
  created_at: string;
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  ziggy: Config & { location: string };
  sidebarOpen: boolean;
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[] | [];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface Collection {
  id: string;
  name: string;
}

interface CollectionList extends Collection {
  works_count: number;
  created_at: string;
  updated_at: string | null;
}

interface MessageEager {
  id: string;
  receiver_id: string;
  text: string;
  created_at: string;
  is_deleted: boolean;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  created_at: string;
  is_deleted: boolean;
}

export interface InertiaProps extends Page<PageProps> {
  flash?: FlashMessages;
  user: User;
  breadcrumbs: BreadcrumbItem[];

  collection: Collection;
  collections: Collection[];

  profile: ProfileUser;
  friendRequestStatus?: FriendRequestStatus;

  work: Work;
  favorited: boolean;

  userQuery?: string | null;
  searchState?: SearchState;

  notifications?: Notification[] | null;

  friends: ChatUser[];
  friend: ChatUser;
  messages: Message[];

  usersPaginatedResponse: PaginatedResponse<ListUser & { is_friend: number }>;
  friendsPaginatedResponse: PaginatedResponse<ListUser>;
  worksPaginatedResponse: PaginatedResponse<Work>;
  favoritesPaginatedResponse: PaginatedResponse<Work>;
  collectionsPaginatedResponse: PaginatedResponse<CollectionList>;

  [key: string]: unknown;
}
