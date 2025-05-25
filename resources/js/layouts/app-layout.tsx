import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { InertiaProps, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';
import { toast, Toaster } from 'sonner';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
  const { flash } = usePage<InertiaProps>().props;

  useEffect(() => {
    if (flash?.success) toast(flash.success);
    if (flash?.error) toast(flash.error);
  }, [flash?.success, flash?.error]);

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
