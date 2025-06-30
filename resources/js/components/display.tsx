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
import { shortenString } from '@/lib/shorten';
import { cn } from '@/lib/utils';
import { MessageEager } from '@/types';
import { Ellipsis } from 'lucide-react';

import AvatarPicture from './avatar-picture';
import { Button } from './ui/button';

interface MessageProps {
  message: MessageEager;
}

export function Message({ message }: MessageProps) {
  const messageIsWork = Boolean(message.work?.id ?? false);
  const isMobile = useIsMobile();
  const friend = message.sender.id === '2' ? message.sender : null;

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
            className="flex-1"
          >
            Edit
          </Button>
        )}
        <Button
          variant="destructive"
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
            className="flex-1"
          >
            Edit
          </Button>
        )}
        <Button
          variant="destructive"
          className="flex-1 hover:opacity-80"
        >
          Delete
        </Button>
      </PopoverContent>
    </Popover>
  );

  return (
    <li className="flex flex-col">
      <div className="flex">
        {!friend && EditMessageMobile}
        <div
          className={cn(
            !friend ? 'bg-primary text-primary-foreground ml-auto' : 'bg-card text-foreground mr-auto',
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
                <DrawerContent className="mb-3">
                  <DrawerHeader>
                    <DrawerTitle className="sr-only">View work</DrawerTitle>
                    <DrawerDescription className="text-muted-foreground">(Click on the cover to view work)</DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4">
                    <div className="hover:opacity-90">
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
                    </div>
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
                <div className="hover:opacity-80">
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
                </div>

                <h3 className="font-secondary text-foreground mb-1 text-xl">{shortenString(message?.work?.title ?? null, 110)}</h3>

                {message?.work?.description ? (
                  <p className="text-foreground tracking-tight">{shortenString(message.work.description, 300)}</p>
                ) : (
                  <p className="text-muted-foreground font-mono">(No description...)</p>
                )}
              </div>
            )
          ) : (
            <div className={cn('mx-1 max-h-60 overflow-x-hidden overflow-y-scroll p-0.5', !friend ? 'text-right' : 'text-left')}>
              {!messageIsWork && (
                <AvatarPicture
                  avatar={!friend ? 'https://res.cloudinary.com/djpz0iokm/image/upload/v1750423572/mybiqnoytyb6rlbps7xk.png' : friend.avatar}
                  is_friend={!friend ? 0 : 1}
                  name={!friend ? 'vempr' : friend.name}
                  className={cn('h-6 w-6 border-1', !friend ? 'float-right ml-2' : 'float-left mr-2')}
                />
              )}
              <p className="text-sm md:text-base">{message.text}</p>
            </div>
          )}

          {!friend && EditMessageDesktop}
        </div>
      </div>

      <p className={cn('text-muted-foreground mt-1 font-mono text-xs', !friend ? 'text-right' : '')}>{message.created_at}</p>
    </li>
  );
}
