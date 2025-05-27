import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type InertiaProps, type BreadcrumbItem, SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Notifications',
    href: '/notifications',
  },
];

export default function Notifications() {
  const { notifications } = usePage<InertiaProps & SharedData>().props;

  const { post, processing, delete: destroy } = useForm();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Notifications" />

      <ul>
        {notifications?.map((notification) => (
          <li>
            <p>{JSON.stringify(notification)}</p>
            {notification.type === 'friend_request' && (
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
            )}
          </li>
        ))}
      </ul>
    </AppLayout>
  );
}
