import type { Page, PageProps } from '@inertiajs/inertia';
import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

import { ProfileFormInput } from './schemas/profile.js';
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
  avatar: string | null;
}

export interface User extends ChatUser {
  email: string;
  email_verified_at: string | null;
  hide_profile: number;
  private_works: number;
}

export interface ListUser extends ChatUser {
  is_friend: number;
  profile: {
    introduction: string | null;
    good_tags: string | null;
  };
}

export interface ProfileUser extends ChatUser {
  info: ProfileFormInput;
  private_works: number;
}

export interface FlashMessages {
  success?: string;
  error?: string;
}

export type FriendRequestStatus = 'mutual' | 'pending' | 'expecting' | null;

export interface Notification {
  id: number;
  type: 'friend_request' | 'friend_request_response' | 'reminder';
  sender_id: string;
  receiver_id: string;
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

interface MessageFriend extends ChatUser {
  private_works: number;
  latest_message: {
    id: string;
    sender_id: string;
    receiver_id: string;
    text: string | null;
    work_id: string | null;
    is_deleted: number;
    created_at: string;
    updated_at: string;
    work: ChatWork | null;
  } | null;
}

interface ChatWork {
  id: string;
  title: string;
  description: string | null;
  image_self: string | null;
  image: string | null;
}

interface MessageEager {
  id: string;
  receiver_id: string;
  text: string | null;
  work: ChatWork | null;
  created_at: string;
  updated_at: string;
  is_deleted: number;
  sender: ChatUser;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  created_at: string;
  is_deleted: boolean;
}

interface SimpleWork {
  id: string;
  title: string;
  author: string;
  collections: Collection[];
}

interface DashboardData {
  worksCount: number;
  latestWork: Work;
  publicationStatuses: {
    [k: string]: number;
  };
  readingStatuses: {
    [k: string]: number;
  };
  originalLanguages: {
    [k: string]: number;
  };
  translatedLanguages: {
    [k: string]: number;
  };
  collectionsData: {
    [k: string]: {
      name: string;
      count: number;
    };
  };
  tags: {
    [k: string]: number;
  };
}

export interface InertiaProps extends Page<PageProps> {
  flash?: FlashMessages;
  user: User;
  breadcrumbs: BreadcrumbItem[];

  dashboardData: DashboardData;

  collection: Collection;
  worksForCollection: SimpleWork[];
  collections: Collection[];

  profile: ProfileUser;
  info: ProfileFormInput;
  friendRequestStatus?: FriendRequestStatus;

  work: Work;
  workCreatorProfile: ChatUser & { introduction: string };
  areFriends: boolean;
  favorited: boolean;

  userQuery?: string | null;
  searchState?: SearchState;

  notificationsPaginatedResponse: PaginatedResponse<Notification> | null;

  friends: (ChatUser & { latest_message: Message })[];
  friend: ChatUser;
  messagesPaginatedResponse: PaginatedResponse<MessageEager> | null;
  friendsMessagesPaginatedResponse: PaginatedResponse<MessageFriend> | null;
  worksForChat: ChatWork[];

  usersPaginatedResponse: PaginatedResponse<ListUser> | null;
  friendsPaginatedResponse: PaginatedResponse<ListUser> | null;
  worksPaginatedResponse: PaginatedResponse<Work> | null;
  favoritesPaginatedResponse: PaginatedResponse<Work> | null;
  collectionsPaginatedResponse: PaginatedResponse<CollectionList> | null;

  [key: string]: unknown;
}
