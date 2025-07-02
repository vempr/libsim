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
	console.log(import.meta.env.VITE_REVERB_APP_KEY)

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
							<p><span className="font-secondary">{message.sender.name}</span>: {message.text ? shortenString(message.text) : '<Work>'}</p>
               <Button variant="outline" className="ml-auto" size="sm">View messages</Button> 
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
        toast('', {
          action: <Link href={route('notification.index')}>{JSON.stringify(notification)}</Link>,
        });
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
