import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
  const page = usePage();
  const dashboard = items[0];
  const workItems = items.slice(1, 4);
  const memberItems = items.slice(4, 6);
  const createItems = items.slice(6, 8);

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Main menu</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem key={dashboard.title}>
          <SidebarMenuButton
            asChild
            isActive={dashboard.href === page.url}
            tooltip={{ children: dashboard.title }}
          >
            <Link
              href={dashboard.href}
              prefetch
            >
              {dashboard.icon && <dashboard.icon />}
              <span>{dashboard.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <SidebarGroupLabel>Works</SidebarGroupLabel>
      <SidebarMenu>
        {workItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={item.href === page.url}
              tooltip={{ children: item.title }}
            >
              <Link
                href={item.href}
                prefetch
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <SidebarGroupLabel>Community</SidebarGroupLabel>
      <SidebarMenu>
        {memberItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={item.href === page.url}
              tooltip={{ children: item.title }}
            >
              <Link
                href={item.href}
                prefetch
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <SidebarGroupLabel>Connections</SidebarGroupLabel>
      <SidebarMenu>
        {createItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={item.href === page.url}
              tooltip={{ children: item.title }}
            >
              <Link
                href={item.href}
                prefetch
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
