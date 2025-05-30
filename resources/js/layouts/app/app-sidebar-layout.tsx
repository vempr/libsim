import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { Inertia } from '@inertiajs/inertia';
import { type PropsWithChildren } from 'react';
import { useEffect, useMemo, useState } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    Inertia.on('start', () => setTransitioning(true));
    Inertia.on('finish', () => setTransitioning(false));
  }, []);

  const pageTransition = useMemo(() => (transitioning ? 'motion-safe:animate-pulse' : ''), [transitioning]);

  return (
    <AppShell variant="sidebar">
      <AppSidebar />

      <AppContent variant="sidebar">
        <AppSidebarHeader breadcrumbs={breadcrumbs} />
        <div className={pageTransition}>{children}</div>
      </AppContent>
    </AppShell>
  );
}
