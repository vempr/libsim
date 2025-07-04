import AvatarPicture from '@/components/avatar-picture';
import { Button } from '@/components/ui/button';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { shortenString } from '@/lib/shorten';
import { InertiaProps, SharedData, type BreadcrumbItem } from '@/types';
import { MessageEvent, NotificationEvent } from '@/types/event';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';
import { toast, Toaster } from 'sonner';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  excludeAppSidebarHeader?: boolean;
}

export default ({ children, breadcrumbs, excludeAppSidebarHeader, ...props }: AppLayoutProps) => {
  const { flash, auth } = usePage<InertiaProps & SharedData>().props;
  const currentRoute = route().current();

  useEffect(() => {
    if (flash?.error?.includes('The collection')) return;
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  }, [flash?.success, flash?.error]);

  useEffect(() => {
    const channel = window.Echo.private(`chat.${auth.user.id}`);
    channel.listen('MessageSent', (e: MessageEvent) => {
      const message = e.message;

      if (currentRoute !== 'chat.show') {
        toast('', {
          action: (
            <Link href={route('chat.show', { friend: message.sender.id })} className="flex justify-between items-center w-full">
							<AvatarPicture is_friend={1} avatar={message.sender.avatar} name={message.sender.name} className="w-8 h-8 border-0 mr-1" />
							<p><span className="font-secondary">{message.sender.name}</span>: {message.text ? `'${shortenString(message.text)}'` : `<${shortenString(message.work?.title ?? null)}>`}</p>
               <Button className="ml-auto" size="sm">View messages</Button> 
            </Link>
          ),
        });
      }
    });

    return () => {
      channel.stopListening('MessageSent');
    };
  }, [currentRoute, auth.user.id]);

  useEffect(() => {
    const channel = window.Echo.private(`notification.${auth.user.id}`);
    channel.listen('NotificationSent', (e: NotificationEvent) => {
      const notification = e.notification;

      if (currentRoute !== 'notification.index') {
				if (notification.mood === 'positive') {
					toast.success('', {
						action: <Link href={route('notification.index')} className="flex items-center w-full"><AvatarPicture is_friend={1} avatar={notification.image} name={'friend'} className="w-8 h-8 border-0 -translate-x-2" /><p>{notification.description}</p></Link>,
					})
 				} else if (notification.mood === 'negative') {
					toast.error('', {
						action: <Link href={route('notification.index')} className="flex items-center w-full"><AvatarPicture is_friend={0} avatar={notification.image} name={'user'} className="w-8 h-8 border-0 -translate-x-2" /><p>{notification.description}</p></Link>,
					})
				} else {
					toast('', {
						action: <Link href={route('notification.index')} className="flex items-center w-full"><AvatarPicture is_friend={0} avatar={notification.image} name={'user'} className="w-8 h-8 border-0 -translate-x-2" /><p>{notification.description}</p></Link>,
					});
				}
      }
    });

    return () => {
      channel.stopListening('NotificationSent');
    };
  }, [currentRoute, auth.user.id]);

  return (
    <AppLayoutTemplate
      breadcrumbs={breadcrumbs}
      excludeAppSidebarHeader={excludeAppSidebarHeader}
      {...props}
    >
      {children}
      <Toaster
        toastOptions={{
          classNames: {
            toast: '!bg-secondary !p-2 !text-xs !text-secondary-foreground !border-2 !border-border !ring-0',
          },
        }}
      />
    </AppLayoutTemplate>
  );
};
