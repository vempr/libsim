import { EmptyListPlaceholder } from '@/components/empty';
import InertiaPagination from '@/components/inertia-pagination';
import NotificationItem from '@/components/notification';
import AppLayout from '@/layouts/app-layout';
import { hasOnePage } from '@/lib/pagination';
import { type InertiaProps, type BreadcrumbItem, SharedData } from '@/types';
import { NotificationEvent } from '@/types/event';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Notifications',
    href: '/notifications',
  },
];

export default function Notifications() {
  const { notificationsPaginatedResponse, auth } = usePage<InertiaProps & SharedData>().props;

  const [notifications, setNotifications] = useState(notificationsPaginatedResponse?.data);

  useEffect(() => {
    const channel = window.Echo.private(`notification.${auth.user.id}`);

    channel.listen('NotificationSent', (e: NotificationEvent) => {
      const incoming = e.notification;

      if (incoming.receiver_id !== auth.user.id) return;

      setNotifications((prev) => (prev ? [incoming, ...prev] : [incoming]));
    });

    return () => {
      channel.stopListening('NotificationSent');
    };
  }, [auth.user.id]);

  useEffect(() => {
    setNotifications(notificationsPaginatedResponse?.data);
  }, [notificationsPaginatedResponse]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Notifications" />

      {notifications?.length ? (
        <ul className="flex flex-col gap-y-2">{notifications?.map((notification) => <NotificationItem notification={notification} />)}</ul>
      ) : (
        <EmptyListPlaceholder>You have no notifications :)</EmptyListPlaceholder>
      )}

      {!hasOnePage(notificationsPaginatedResponse) && notificationsPaginatedResponse && (
        <InertiaPagination paginateItems={notificationsPaginatedResponse} />
      )}
    </AppLayout>
  );
}
