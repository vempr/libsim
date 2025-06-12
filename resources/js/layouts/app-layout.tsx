import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { InertiaProps, MessageEager, SharedData, type BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';
import { toast, Toaster } from 'sonner';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
  const { flash, auth } = usePage<InertiaProps & SharedData>().props;
  const currentRoute = route().current();

  useEffect(() => {
    if (flash?.success) toast(flash.success);
    if (flash?.error) toast(flash.error);

    const channel = window.Echo.private(`chat.${auth.user.id}`);
    channel.listen('MessageSent', (e: any) => {
      const message = e.message as MessageEager;

      if (currentRoute !== 'chat.show') {
        toast('', {
          action: (
            <Link href={route('chat.show', { friend: message.sender.id })}>
              {message.sender.name}: {message.text} View messages
            </Link>
          ),
        });
      }
    });

    return () => {
      channel.stopListening('MessageSent');
    };
  }, [flash?.success, flash?.error, currentRoute]);

  return (
    <AppLayoutTemplate
      breadcrumbs={breadcrumbs}
      {...props}
    >
      {children}
      <Toaster />
    </AppLayoutTemplate>
  );
};
