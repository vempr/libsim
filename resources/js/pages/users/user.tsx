import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Spinner from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { InertiaProps, PaginatedResponse, SharedData, type BreadcrumbItem } from '@/types';
import { NotificationEvent } from '@/types/event';
import { type Work } from '@/types/schemas/work';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import axios from 'axios';
import { FormEventHandler, useEffect, useState } from 'react';

export default function Work() {
  const {
    auth,
    profile,
    friendRequestStatus: initialFriendRequestStatus,
    worksPaginatedResponse: initialWorksPaginatedResponse,
  } = usePage<InertiaProps & SharedData>().props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Members',
      href: '/users',
    },
    {
      title: profile.name,
      href: `/users/${profile.id}`,
    },
  ];

  const [fetchingWorks, setFetchingWorks] = useState(false);
  const [worksPaginatedResponse, setWorksPaginatedResponse] = useState(initialWorksPaginatedResponse);
  const [areFriends, setAreFriends] = useState(initialFriendRequestStatus === 'mutual');
  const [friendRequestStatus, setFriendRequestStatus] = useState(initialFriendRequestStatus);

  useEffect(() => {
    const channel = window.Echo.private(`notification.${auth.user.id}`);
    channel.listen('NotificationSent', async (e: NotificationEvent) => {
      const notification = e.notification;
      const mood = notification.mood;

      if ((notification.type !== 'friend_request_response' && notification.type !== 'friend_request') || notification.sender_id !== profile.id) {
        return;
      }

      if (mood === 'positive') {
        setFetchingWorks(true);
        setFriendRequestStatus('mutual');
        setAreFriends(true);

        const response: {
          data: { worksPaginatedResponse: PaginatedResponse<Work> };
        } = await axios.get(`http://127.0.0.1:8000/users/${profile.id}`, { params: { only_works: true } });

        setWorksPaginatedResponse(response.data.worksPaginatedResponse);
        if (response) setFetchingWorks(false);
      }

      if (mood === 'negative') {
        setAreFriends(false);
        setFriendRequestStatus(undefined);
      }

      if (mood === 'neutral') {
        setFriendRequestStatus('expecting');
      }
    });

    return () => {
      channel.stopListening('NotificationSent');
    };
  }, [auth.user.id]);

  const {
    post,
    processing,
    delete: destroy,
  } = useForm({
    receiver_id: profile.id,
  });

  const handleUnfriend: FormEventHandler = (e) => {
    e.preventDefault();
    destroy(route('users.destroy'), {
      onFinish: () => {
        setAreFriends(false);
        setFriendRequestStatus(undefined);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={profile.name} />
      <p className="max-w-96 overflow-scroll">{JSON.stringify(profile)}</p>

      {friendRequestStatus === 'pending' && (
        <Button
          type="submit"
          disabled
        >
          Friend request sent
        </Button>
      )}
      {friendRequestStatus === 'expecting' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();

            post(route('users.store'), {
              onFinish: async () => {
                setFetchingWorks(true);
                setFriendRequestStatus('mutual');
                setAreFriends(true);

                const response: {
                  data: { worksPaginatedResponse: PaginatedResponse<Work> };
                } = await axios.get(`http://127.0.0.1:8000/users/${profile.id}`, { params: { only_data: true } });

                setWorksPaginatedResponse(response.data.worksPaginatedResponse);
                if (response) setFetchingWorks(false);
              },
            });
          }}
        >
          <Button
            type="submit"
            disabled={processing}
          >
            Accept friend request
          </Button>
        </form>
      )}
      {!friendRequestStatus && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            post(route('users.store'), {
              onFinish: () => setFriendRequestStatus('pending'),
            });
          }}
        >
          <Button
            type="submit"
            disabled={processing}
          >
            Send friend request
          </Button>
        </form>
      )}

      {friendRequestStatus === 'expecting' && (
        <form onSubmit={handleUnfriend}>
          <Button
            type="submit"
            disabled={processing}
          >
            Decline friend request
          </Button>
        </form>
      )}

      {areFriends && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              disabled={processing}
            >
              Unfriend
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>You will not be able to message {profile.name} if their DMs are deactivated.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <form onSubmit={handleUnfriend}>
                <Button
                  type="submit"
                  disabled={processing}
                >
                  Unfriend
                </Button>
              </form>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {fetchingWorks && <Spinner />}
      {!fetchingWorks && areFriends && !profile.private_works && (
        <ul>
          hello
          {worksPaginatedResponse?.data.map((work) => (
            <li>
              <Link href={`/works/${work.id}?user=${work.user_id}`}>{JSON.stringify(work)}</Link>
            </li>
          ))}
        </ul>
      )}
    </AppLayout>
  );
}
