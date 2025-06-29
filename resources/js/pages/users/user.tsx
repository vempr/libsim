import AvatarPicture from '@/components/avatar-picture';
import InertiaPagination from '@/components/inertia-pagination';
import InputError from '@/components/input-error';
import { MutedP, MutedSpan } from '@/components/muted-text';
import ProfileTags from '@/components/profile-tags';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Spinner from '@/components/ui/spinner';
import WorkCard, { WorkGrid } from '@/components/work';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/layouts/app-layout';
import { hasOnePage } from '@/lib/pagination';
import { InertiaProps, PaginatedResponse, ProfileUser, SharedData, type BreadcrumbItem } from '@/types';
import { NotificationEvent } from '@/types/event';
import { type Work } from '@/types/schemas/work';
import { Head, usePage, useForm, Link } from '@inertiajs/react';
import axios from 'axios';
import { FormEventHandler, useEffect, useState } from 'react';

interface FriendFormProps {
  friendRequestStatus: 'pending' | 'expecting' | 'mutual' | null | undefined;
  processing: boolean;
  handleAcceptFriend: FormEventHandler;
  handleUnfriend: FormEventHandler;
  handleRequestFriend: FormEventHandler;
  hide_profile: number;
  areFriends: boolean;
  friend: ProfileUser;
}

function FriendForm({
  friendRequestStatus,
  processing,
  handleAcceptFriend,
  handleUnfriend,
  handleRequestFriend,
  hide_profile,
  areFriends,
  friend,
}: FriendFormProps) {
  const isMobile = useIsMobile();

  if (friendRequestStatus === 'pending')
    return (
      <Button
        type="submit"
        disabled
      >
        Friend request sent
      </Button>
    );

  if (friendRequestStatus === 'expecting')
    return (
      <div>
        <form onSubmit={handleAcceptFriend}>
          <Button
            type="submit"
            disabled={processing}
          >
            Accept friend request
          </Button>
        </form>
        <form onSubmit={handleUnfriend}>
          <Button
            type="submit"
            disabled={processing}
          >
            Decline friend request
          </Button>
        </form>
      </div>
    );

  if (areFriends)
    return (
      <div className="flex w-full items-center gap-x-1 md:w-min">
        <Button
          asChild
          variant="secondary"
          className="flex-1"
          size={isMobile ? 'sm' : 'default'}
        >
          <Link href={`${route('chat.show', { friend: friend.id })}`}>Message</Link>
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              disabled={processing}
              variant="destructive"
              className="flex-1 dark:hover:opacity-80"
              size={isMobile ? 'sm' : 'default'}
            >
              Unfriend
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>You will not be able to message {friend.name} and view their entries.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <form onSubmit={handleUnfriend}>
                <Button
                  type="submit"
                  disabled={processing}
                  variant="destructive"
                  className="dark:hover:opacity-80"
                >
                  Unfriend
                </Button>
              </form>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );

  return (
    <form
      onSubmit={handleRequestFriend}
      className="flex items-center gap-x-4"
    >
      {hide_profile === 1 && (
        <Link
          href={`${route('profile.edit')}#privacy-options`}
          className="max-w-52 text-right"
        >
          <InputError message={'Please make your profile public to send friend requests.'} />
        </Link>
      )}
      <Button
        type="submit"
        disabled={hide_profile === 1 || processing}
      >
        Send friend request
      </Button>
    </form>
  );
}

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

  const isMobile = useIsMobile();

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
  }, [auth.user.id, profile.id]);

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

  const handleAcceptFriend: FormEventHandler = (e) => {
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
  };

  const handleRequestFriend: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('users.store'), {
      onFinish: () => setFriendRequestStatus('pending'),
    });
  };

  const canViewWorks = !fetchingWorks && areFriends && !profile.private_works;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={profile.name} />

      {isMobile ? (
        <div className="flex flex-col items-center justify-between gap-y-3 md:hidden">
          <div className="flex items-center gap-x-2">
            <AvatarPicture
              avatar={profile.avatar}
              name={profile.name}
              is_friend={areFriends ? 1 : 0}
            />
            <h2 className="font-secondary text-3xl">{profile.name}</h2>
          </div>

          <FriendForm
            friendRequestStatus={friendRequestStatus}
            processing={processing}
            handleAcceptFriend={handleAcceptFriend}
            handleUnfriend={handleUnfriend}
            handleRequestFriend={handleRequestFriend}
            hide_profile={auth.user.hide_profile}
            areFriends={areFriends}
            friend={profile}
          />

          {profile.info.introduction?.length ? (
            <p className="bg-sidebar rounded px-4 py-2 text-sm">{profile.info.introduction}</p>
          ) : (
            <MutedP>(No self introduction)</MutedP>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-y-2">
          <div className="hidden items-center justify-between gap-y-3 md:flex">
            <div className="flex items-center gap-x-2">
              <AvatarPicture
                avatar={profile.avatar}
                name={profile.name}
                is_friend={areFriends ? 1 : 0}
              />
              <h2 className="font-secondary text-3xl">{profile.name}</h2>
            </div>

            <FriendForm
              friendRequestStatus={friendRequestStatus}
              processing={processing}
              handleAcceptFriend={handleAcceptFriend}
              handleUnfriend={handleUnfriend}
              handleRequestFriend={handleRequestFriend}
              hide_profile={auth.user.hide_profile}
              areFriends={areFriends}
              friend={profile}
            />
          </div>

          {profile.info.introduction?.length ? (
            <p className="bg-sidebar rounded px-4 py-2 text-sm">{profile.info.introduction}</p>
          ) : (
            <MutedP>(No self introduction)</MutedP>
          )}
        </div>
      )}

      <p className="my-4 max-h-36 scroll-py-1 overflow-x-hidden overflow-y-auto rounded border p-4">
        {profile.info.description?.length ? profile.info.description : <MutedSpan>(Nothing for the description...)</MutedSpan>}
      </p>

      <ul className="flex flex-col gap-2 md:flex-row">
        <ProfileTags
          title={'I love to read...'}
          tags={profile.info.good_tags?.split(',')}
          className="text-foreground border-secondary/70"
        />
        <ProfileTags
          title={'This is pretty fine...'}
          tags={profile.info.neutral_tags?.split(',')}
          className="border-chart-3/70 text-foreground"
        />
        <ProfileTags
          title={'I really hate...'}
          tags={profile.info.bad_tags?.split(',')}
          className="border-chart-5/70 text-foreground"
        />
      </ul>

      <h2 className="font-secondary mt-3 mb-2 text-2xl">{profile.name}'s works</h2>

      {!areFriends && <p className="font-mono opacity-80">Befriend {profile.name} to view their entries!</p>}
      {profile.private_works === 1 && areFriends && (
        <p className="font-mono opacity-80">{profile.name} has privated their works. They are not visible.</p>
      )}

      {fetchingWorks && <Spinner />}

      {canViewWorks &&
        (worksPaginatedResponse?.data.length ? (
          <WorkGrid>
            {worksPaginatedResponse.data.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
                user={profile.id}
              />
            ))}
          </WorkGrid>
        ) : (
          <p className="font-mono opacity-80">{profile.name} has no work entries...</p>
        ))}

      {canViewWorks && !hasOnePage(worksPaginatedResponse) && worksPaginatedResponse && <InertiaPagination paginateItems={worksPaginatedResponse} />}
    </AppLayout>
  );
}
