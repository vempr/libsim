import { Icon } from '@/components/icon';
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { ExternalLink } from 'lucide-react';
import { type ComponentPropsWithoutRef } from 'react';

export function NavFooter({
  items,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
  items: NavItem[];
}) {
  return (
    <SidebarGroup
      {...props}
      className={`group-data-[collapsible=icon]:p-0 ${className || ''}`}
    >
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                size="sm"
              >
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-x-2"
                >
                  {item.icon && (
                    <Icon
                      iconNode={item.icon}
                      className="h-5 w-5"
                    />
                  )}
                  <span>{item.title}</span>
                  <ExternalLink className="inline h-4 w-4" />
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
