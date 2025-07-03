import AvatarPicture from '@/components/avatar-picture';
import { Button } from '@/components/ui/button';
import { type Notification } from '@/types/index';
import { Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const handleNotificationsReload = () => router.reload({ only: ['notificationsPaginatedResponse'] });

export default function NotificationItem({ notification }: { notification: Notification }) {
  const [hide, setHide] = useState(false);
  const { post, delete: destroy, processing } = useForm();

  if (!hide)
    return (
      <li
        key={notification.id}
        className="text-card-foreground bg-card border-border flex h-full w-full flex-col gap-y-2 rounded-md border p-2"
      >
        <div className="mb-1 flex flex-col items-start gap-2 md:hidden">
          <Link
            href={route('users.create', { user: notification.sender_id })}
            className="flex items-center justify-between gap-x-3"
          >
            <AvatarPicture
              avatar={notification.image}
              name={'Friend'}
              is_friend={notification.mood === 'positive' ? 1 : 0}
            />
            <h2 className="font-secondary w-32">{notification.title}</h2>
          </Link>

          <p className="text-sm">{notification.description}</p>
        </div>

        <div className="mb-1 hidden items-center gap-x-2 md:flex">
          <Link href={route('users.create', { user: notification.sender_id })}>
            <AvatarPicture
              avatar={notification.image}
              name={'Friend'}
              is_friend={notification.mood === 'positive' ? 1 : 0}
            />
          </Link>

          <div>
            <h2 className="font-secondary text-lg">{notification.title}</h2>
            <p>{notification.description}</p>
          </div>
        </div>

        {notification.type == 'friend_request' ? (
          <div className="flex flex-1 gap-2 flex-col md:flex-row">
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
              className="w-full flex-1"
            >
              <Button
                type="submit"
                disabled={processing}
                className="w-full flex-1"
                size="sm"
                variant="secondary"
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
              className="w-full flex-1"
            >
              <Button
                type="submit"
                disabled={processing}
                className="w-full flex-1"
                size="sm"
                variant="destructive"
              >
                Decline friend request
              </Button>
            </form>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setHide(true);
              destroy(
                route('notification.destroy', {
                  notification: notification.id,
                }),
                {
                  preserveScroll: true,
                },
              );
            }}
            className="w-full flex-1"
          >
            <Button
              type="submit"
              disabled={processing}
              className="w-full flex-1"
              size="sm"
            >
              Dismiss
            </Button>
          </form>
        )}
      </li>
    );
}
