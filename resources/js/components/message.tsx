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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { getRelativeTime } from '@/lib/date';
import { shortenString } from '@/lib/shorten';
import { cn } from '@/lib/utils';
import { ChatUser, MessageEager, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Ellipsis } from 'lucide-react';

import AvatarPicture from './avatar-picture';
import { Button } from './ui/button';

interface MessageProps {
  message: MessageEager;
  friend: ChatUser;
  onEditFocus: () => void;
  onDelete: () => void;
}

export default function Message({ message, friend, onEditFocus, onDelete }: MessageProps) {
  const { auth } = usePage<SharedData>().props;
  const isOwnMessage = auth.user.id !== message.receiver_id;
  const messageIsWork = Boolean(message.work?.id ?? false);
  const isMobile = useIsMobile();

  const EditMessageDesktop = (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="mt-1 hidden h-5 w-full opacity-50 hover:opacity-100 md:flex"
        >
          <Ellipsis />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex gap-x-1">
        {!messageIsWork && (
          <Button
            variant="secondary"
            onClick={onEditFocus}
            className="flex-1"
          >
            Edit
          </Button>
        )}
        <Button
          variant="destructive"
          onClick={onDelete}
          className="flex-1 hover:opacity-80"
        >
          Delete
        </Button>
      </PopoverContent>
    </Popover>
  );

  const EditMessageMobile = (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-full w-5 translate-y-1.5 opacity-50 md:hidden"
        >
          <Ellipsis />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex gap-x-1">
        {!messageIsWork && (
          <Button
            variant="secondary"
            onClick={onEditFocus}
            className="flex-1"
          >
            Edit
          </Button>
        )}
        <Button
          variant="destructive"
          onClick={onDelete}
          className="flex-1 hover:opacity-80"
        >
          Delete
        </Button>
      </PopoverContent>
    </Popover>
  );

  if (message.is_deleted) {
    return (
      <li
        key={`${message.id}-${new Date(message.created_at).getTime()}`}
        className={cn(
          isOwnMessage ? 'bg-primary text-primary-foreground/60 ml-auto' : 'bg-card text-foreground/60 mr-auto',
          'border-border text flex max-w-50 flex-col justify-center rounded border p-2 font-mono text-xs md:w-96 md:max-w-96 md:text-base',
        )}
      >
        <p className="text-center">(deleted {getRelativeTime(message.updated_at)}...)</p>
      </li>
    );
  }

  return (
    <li className="flex flex-col">
      <div className="flex">
        {isOwnMessage && EditMessageMobile}
        <div
          className={cn(
            isOwnMessage ? 'bg-primary text-primary-foreground ml-auto' : 'bg-card text-foreground mr-auto',
            'border-border text flex w-50 max-w-50 flex-col justify-center overflow-hidden rounded border p-2 md:w-96 md:max-w-96',
          )}
        >
          {message.work?.title ? (
            isMobile ? (
              <Drawer>
                <DrawerTrigger className="bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ml-1 block shrink-0 items-center justify-center gap-2 rounded px-2 text-xs font-medium shadow-xs transition-all outline-none hover:cursor-pointer focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                  {'<'}
                  {shortenString(message.work.title)}
                  {'>'}
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle className="sr-only">View work</DrawerTitle>
                    <DrawerDescription className="text-muted-foreground">(Click on the cover to view work)</DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4">
                    <Link
                      href={route('work', { work: message.work.id, chat: friend.id })}
                      className="hover:opacity-90"
                    >
                      {message?.work?.image || message?.work?.image_self ? (
                        <img
                          src={message.work.image || message.work.image_self || undefined}
                          className="border-secondary float-left mr-3 h-50 w-min rounded border object-contain"
                        />
                      ) : (
                        <div className="border-secondary float-left mr-3 flex h-50 w-35 items-center justify-center rounded border">
                          <p className="text-muted-foreground text-center font-mono text-sm">No cover provided...</p>
                        </div>
                      )}
                    </Link>
                    <h3 className="font-secondary text-foreground mb-1 text-xl">{shortenString(message?.work?.title ?? null, 110)}</h3>

                    {message?.work?.description ? (
                      <p className="text-foreground tracking-tight">{shortenString(message.work.description, 300)}</p>
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
            ) : (
              <div>
                <Link
                  href={route('work', { work: message.work.id, chat: friend.id })}
                  className="hover:opacity-80"
                >
                  {message?.work?.image || message?.work?.image_self ? (
                    <img
                      src={message.work.image || message.work.image_self || undefined}
                      className="border-secondary float-left mr-3 h-50 w-min rounded border object-contain"
                    />
                  ) : (
                    <div className="border-secondary float-left mr-3 flex h-50 w-35 items-center justify-center rounded border">
                      <p className="text-muted-foreground text-center font-mono text-sm">No cover provided...</p>
                    </div>
                  )}
                </Link>

                <h3 className="font-secondary text-foreground mb-1 text-xl">{shortenString(message?.work?.title ?? null, 110)}</h3>

                {message?.work?.description ? (
                  <p className="text-foreground tracking-tight">{shortenString(message.work.description, 300)}</p>
                ) : (
                  <p className="text-muted-foreground font-mono">(No description...)</p>
                )}
              </div>
            )
          ) : (
            <div className={cn('mx-1 max-h-60 overflow-x-hidden overflow-y-scroll p-0.5', isOwnMessage ? 'text-right' : 'text-left')}>
              {!messageIsWork && (
                <AvatarPicture
                  avatar={isOwnMessage ? auth.user.avatar : friend.avatar}
                  is_friend={isOwnMessage ? 0 : 1}
                  name={isOwnMessage ? auth.user.name : friend.name}
                  className={cn('h-6 w-6 border-1', isOwnMessage ? 'float-right ml-2' : 'float-left mr-2')}
                />
              )}
              <p>{message.text}</p>
            </div>
          )}

          {isOwnMessage && EditMessageDesktop}
        </div>
      </div>

      <p className={cn('text-muted-foreground mt-1 font-mono text-xs', isOwnMessage ? 'text-right' : '')}>
        {getRelativeTime(message.created_at)} {message.created_at !== message.updated_at && `(updated ${getRelativeTime(message.updated_at)})`}
      </p>
    </li>
  );
}
