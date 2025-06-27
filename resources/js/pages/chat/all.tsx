import AvatarPicture from '@/components/avatar-picture';
import { EmptyListPlaceholder } from '@/components/empty';
import InertiaPagination from '@/components/inertia-pagination';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/layouts/app-layout';
import { getRelativeTime } from '@/lib/date';
import { hasOnePage } from '@/lib/pagination';
import { shortenString } from '@/lib/shorten';
import { type InertiaProps, type BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpenText } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Messages',
    href: '/chat',
  },
];

export default function All() {
  const { friendsMessagesPaginatedResponse, auth } = usePage<InertiaProps & SharedData>().props;

  const singlePage = hasOnePage(friendsMessagesPaginatedResponse);
  const isMobile = useIsMobile();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Messages" />

      <ul className="flex flex-col gap-y-2">
        {friendsMessagesPaginatedResponse?.data.map((friend) => (
          <li
            key={friend.id}
            className="flex"
          >
            <Link
              href={`/chat/${friend.id}`}
              className="text-card-foreground bg-card border-border hover:bg-card-accent flex w-full flex-row justify-between gap-y-2 rounded-md border p-2"
            >
              <div className="flex flex-col justify-between gap-y-1">
                <div className="flex items-center gap-x-2">
                  <AvatarPicture
                    is_friend={1}
                    name={friend.name}
                    avatar={friend.avatar}
                  />
                  <h2 className="font-secondary text-2xl">{friend.name}</h2>
                </div>

                {friend.latest_message && (
                  <p className="text-muted-foreground overflow-hidden">
                    {friend.latest_message.sender_id === auth.user.id ? 'You: ' : `${friend.name}: `}{' '}
                    {friend.latest_message.text ? (
                      isMobile ? (
                        shortenString(friend.latest_message.text)
                      ) : (
                        shortenString(friend.latest_message.text, 70)
                      )
                    ) : (
                      <HoverCard>
                        <HoverCardTrigger>
                          <span className="text-secondary font-mono hover:underline">
                            {'<'}
                            {isMobile
                              ? shortenString(friend.latest_message.work?.title ?? null)
                              : shortenString(friend.latest_message.work?.title ?? null, 70)}
                            {'>'}
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent className="max-h-96 w-96 overflow-y-scroll">
                          <Link
                            href={route('work', { work: friend.latest_message.work_id, user: friend })}
                            className="hover:opacity-80"
                          >
                            {friend.latest_message?.work?.image || friend.latest_message?.work?.image_self ? (
                              <img
                                src={friend.latest_message.work.image || friend.latest_message.work.image_self || undefined}
                                className="border-secondary float-left mr-3 h-50 w-min rounded border object-contain"
                              />
                            ) : (
                              <div className="border-secondary float-left mr-3 flex h-50 w-35 items-center justify-center rounded border">
                                <p className="text-muted-foreground text-center font-mono text-sm">No cover provided...</p>
                              </div>
                            )}
                          </Link>

                          <h3 className="font-secondary text-foreground mb-1 text-xl">
                            {shortenString(friend.latest_message?.work?.title ?? null, 110)}
                          </h3>

                          {friend.latest_message?.work?.description ? (
                            <p className="text-foreground tracking-tight">{shortenString(friend.latest_message.work.description, 300)}</p>
                          ) : (
                            <p className="text-muted-foreground font-mono">(No description...)</p>
                          )}
                        </HoverCardContent>
                      </HoverCard>
                    )}
                  </p>
                )}

                {!friend.latest_message && <p className="text-muted-foreground opacity-80">No messages sent</p>}

                <p className="text-muted-foreground font-mono text-sm lg:hidden">
                  Last chatted {friend.latest_message?.updated_at ? getRelativeTime(friend.latest_message.updated_at) : '-'}
                </p>
              </div>

              <p className="text-muted-foreground hidden text-right font-mono text-sm lg:block">
                Last chatted {friend.latest_message?.updated_at ? getRelativeTime(friend.latest_message.updated_at) : '-'}
              </p>
            </Link>
            {friend.latest_message?.work && isMobile && (
              <Drawer>
                <DrawerTrigger className="bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ml-1 inline-flex shrink-0 items-center justify-center gap-2 rounded px-2 text-sm font-medium whitespace-nowrap shadow-xs transition-all outline-none hover:cursor-pointer focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                  <BookOpenText className="h-16 w-16" />
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle className="sr-only">View work</DrawerTitle>
                    <DrawerDescription className="sr-only">View your friend's work</DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4">
                    <Link
                      href={route('work', { work: friend.latest_message.work_id, user: friend })}
                      className="hover:opacity-90"
                    >
                      {friend.latest_message?.work?.image || friend.latest_message?.work?.image_self ? (
                        <img
                          src={friend.latest_message.work.image || friend.latest_message.work.image_self || undefined}
                          className="border-secondary float-left mr-3 h-50 w-min rounded border object-contain"
                        />
                      ) : (
                        <div className="border-secondary float-left mr-3 flex h-50 w-35 items-center justify-center rounded border">
                          <p className="text-muted-foreground text-center font-mono text-sm">No cover provided...</p>
                        </div>
                      )}
                    </Link>
                    <h3 className="font-secondary text-foreground mb-1 text-xl">{shortenString(friend.latest_message?.work?.title ?? null, 110)}</h3>

                    {friend.latest_message?.work?.description ? (
                      <p className="text-foreground tracking-tight">{shortenString(friend.latest_message.work.description, 300)}</p>
                    ) : (
                      <p className="text-muted-foreground font-mono">(No description...)</p>
                    )}
                  </div>

                  <DrawerFooter>
                    <DrawerClose>
                      <Button variant="outline">Exit work view</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            )}
          </li>
        ))}
      </ul>

      {friendsMessagesPaginatedResponse?.data.length === 0 && (
        <EmptyListPlaceholder>
          You don't have any friends to message
          <Link href={route('users.index')}>
            <Button variant="secondary">Make new friends!</Button>
          </Link>
        </EmptyListPlaceholder>
      )}

      {!singlePage && friendsMessagesPaginatedResponse && <InertiaPagination paginateItems={friendsMessagesPaginatedResponse} />}
    </AppLayout>
  );
}
