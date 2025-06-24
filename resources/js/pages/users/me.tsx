import AvatarPicture from '@/components/avatar-picture';
import InertiaPagination from '@/components/inertia-pagination';
import { MutedP, MutedSpan } from '@/components/muted-text';
import ProfileTags from '@/components/profile-tags';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/layouts/app-layout';
import { InertiaProps, SharedData, type BreadcrumbItem } from '@/types';
import { type Work } from '@/types/schemas/work';
import { Head, usePage, Link } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function Work() {
  const { profile, worksPaginatedResponse } = usePage<InertiaProps & SharedData>().props;
  const profileNameRef = useRef<HTMLHeadingElement | null>(null);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Your profile',
      href: '',
    },
  ];

  const isMobile = useIsMobile();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('page') && profileNameRef.current) {
      profileNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={profile.name} />

      {isMobile ? (
        <div className="flex flex-col items-center justify-between gap-y-3 md:hidden">
          <div className="flex items-center gap-x-2">
            <AvatarPicture
              avatar={profile.avatar}
              name={profile.name}
              is_friend={1}
            />
            <h2 className="font-secondary text-3xl">{profile.name}</h2>
          </div>

          <Button
            asChild
            variant="secondary"
          >
            <Link href={route('u.edit')}>Edit Profile</Link>
          </Button>

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
                is_friend={1}
              />
              <h2 className="font-secondary text-3xl">{profile.name}</h2>
            </div>

            <Button
              asChild
              variant="secondary"
            >
              <Link href={route('u.edit')}>Edit Profile</Link>
            </Button>
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

      <ul className="bg-sidebar border-sidebar flex flex-col gap-2 rounded border-3 p-3 md:flex-row">
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

      <h2
        className="font-secondary mt-3 mb-2 text-2xl"
        ref={profileNameRef}
      >
        {profile.name}'s works
      </h2>

      {worksPaginatedResponse?.data.length ? (
        <ul className="max-w-72 overflow-auto">
          hello
          {worksPaginatedResponse.data.map((work) => (
            <li>
              <Link href={`/works/${work.id}?user=${work.user_id}`}>{JSON.stringify(work)}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="font-mono opacity-80">{profile.name} has no work entries...</p>
      )}

      {worksPaginatedResponse?.data.length && <InertiaPagination paginateItems={worksPaginatedResponse} />}
    </AppLayout>
  );
}
