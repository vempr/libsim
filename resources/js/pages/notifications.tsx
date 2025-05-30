import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type InertiaProps, type BreadcrumbItem, SharedData, Notification } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Notifications',
    href: '/notifications',
  },
];

const NotificationFriend = ({ notification }: { notification: Notification }) => {
  const { post, processing, delete: destroy } = useForm();

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          post(
            route('users.store', {
              receiver_id: notification.sender_id,
            }),
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

  return (
    <div>
      {notification.type === 'reminder' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            destroy(
              route('notification.destroy', {
                notification: notification.id,
              }),
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
      )}
    </div>
  );
};

export default function Notifications() {
  const { notifications } = usePage<InertiaProps & SharedData>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Notifications" />

      <ul>
        {notifications?.map((notification) => (
          <li key={notification.id}>
            <p>{JSON.stringify(notification)}</p>
            {notification.type === 'friend_request' && <NotificationFriend notification={notification} />}

            {notification.type === 'reminder' && <NotificationReminder notification={notification} />}
          </li>
        ))}
      </ul>
    </AppLayout>
  );
}
