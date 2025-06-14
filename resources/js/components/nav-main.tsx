import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
  const page = usePage();
  const dashboardItems = items.slice(0, 3);
  const memberItems = items.slice(3, 7);
  const createItems = items.slice(7, 8);

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Main menu</SidebarGroupLabel>
      <SidebarMenu>
        {dashboardItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={item.href === page.url}
              tooltip={{ children: item.title }}
              size="sm"
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
              size="sm"
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

      <SidebarGroupLabel>Create</SidebarGroupLabel>
      <SidebarMenu>
        {createItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={item.href === page.url}
              tooltip={{ children: item.title }}
              size="sm"
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
