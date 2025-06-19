import InertiaPagination from '@/components/inertia-pagination';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type InertiaProps, type BreadcrumbItem, SharedData, Notification } from '@/types';
import { NotificationEvent } from '@/types/event';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Notifications',
    href: '/notifications',
  },
];

const handleNotificationsReload = () => router.reload({ only: ['notificationsPaginatedResponse'] });

const NotificationFriend = ({ notification }: { notification: Notification }) => {
  const { post, processing, delete: destroy } = useForm();

  return (
    <div>
      {JSON.stringify(notification)}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          post(
            route('users.store', {
              receiver_id: notification.sender_id,
            }),
            {
              onSuccess: handleNotificationsReload,
              preserveScroll: true,
            },
          );
        }}
      >
        <Button
          type="submit"
          disabled={processing}
        >
          Accept friend request
        </Button>
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          destroy(
            route('users.destroy', {
              receiver_id: notification.sender_id,
            }),
            {
              onSuccess: handleNotificationsReload,
              preserveScroll: true,
            },
          );
        }}
      >
        <Button
          type="submit"
          disabled={processing}
        >
          Decline friend request
        </Button>
      </form>
    </div>
  );
};

const NotificationReminder = ({ notification }: { notification: Notification }) => {
  const { delete: destroy, processing } = useForm();
  const [hide, setHide] = useState(false);

  if (!hide)
    return (
      <div>
        {JSON.stringify(notification)}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setHide(true);
            destroy(
              route('notification.destroy', {
                notification: notification.id,
              }),
              {
                onSuccess: handleNotificationsReload,
                preserveScroll: true,
              },
            );
          }}
        >
          <Button
            type="submit"
            disabled={processing}
          >
            Dismiss
          </Button>
        </form>
      </div>
    );
};

export default function Notifications() {
  const { notificationsPaginatedResponse, auth } = usePage<InertiaProps & SharedData>().props;

  const [notifications, setNotifications] = useState(notificationsPaginatedResponse.data);

  useEffect(() => {
    const channel = window.Echo.private(`notification.${auth.user.id}`);

    channel.listen('NotificationSent', (e: NotificationEvent) => {
      const incoming = e.notification;

      if (incoming.receiver_id !== auth.user.id) return;

      setNotifications((prev) => [incoming, ...prev]);
    });

    return () => {
      channel.stopListening('NotificationSent');
    };
  }, [auth.user.id]);

  useEffect(() => {
    setNotifications(notificationsPaginatedResponse.data);
  }, [notificationsPaginatedResponse]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Notifications" />

      <ul>
        {notifications?.map((notification) => (
          <li key={notification.id}>
            {notification.type === 'friend_request' ? (
              <NotificationFriend notification={notification} />
            ) : (
              <NotificationReminder notification={notification} />
            )}
          </li>
        ))}
      </ul>

      <InertiaPagination paginateItems={notificationsPaginatedResponse} />
    </AppLayout>
  );
}
