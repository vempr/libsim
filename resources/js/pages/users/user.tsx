import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { FriendRequestStatus, InertiaProps, type BreadcrumbItem } from '@/types';
import { Head, usePage, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface FriendButtonProps {
  friendRequestStatus?: FriendRequestStatus;
  processing: boolean;
}

function FriendButton({ friendRequestStatus, processing }: FriendButtonProps) {
  switch (friendRequestStatus) {
    case 'pending':
      return (
        <Button
          type="submit"
          disabled
        >
          Friend request sent
        </Button>
      );
    case 'expecting':
      return (
        <Button
          type="submit"
          disabled={processing}
        >
          Accept friend request
        </Button>
      );
    case 'mutual':
      return null;
    default:
      return (
        <Button
          type="submit"
          disabled={processing}
        >
          Send friend request
        </Button>
      );
  }
}

export default function Work() {
  const { user, friendRequestStatus } = usePage<InertiaProps>().props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Members',
      href: '/users',
    },
    {
      title: user.name,
      href: `/users/${user.id}`,
    },
  ];

  const {
    post,
    processing,
    delete: destroy,
  } = useForm({
    receiver_id: user.id,
  });

  const handleFriend: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('users.store'));
  };

  const handleUnfriend: FormEventHandler = (e) => {
    e.preventDefault();
    destroy(route('users.destroy'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={user.name} />
      <p className="max-w-96 overflow-scroll">{JSON.stringify(user)}</p>

      <form onSubmit={handleFriend}>
        <FriendButton
          friendRequestStatus={friendRequestStatus}
          processing={processing}
        />
      </form>

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

      {friendRequestStatus === 'mutual' && (
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
              <DialogDescription>You will not be able to message {user.name} if their DMs are deactivated.</DialogDescription>
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
    </AppLayout>
  );
}
