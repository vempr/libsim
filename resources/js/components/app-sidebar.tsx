import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Folder, LayoutGrid, LibraryBig } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
	{
		title: 'Main Menu',
		href: '/dashboard',
		icon: LayoutGrid,
	},
	{
		title: 'Saved Works',
		href: '/works/all',
		icon: LibraryBig,
	},
];

const footerNavItems: NavItem[] = [
	{
		title: 'Repository',
		href: 'https://github.com/vempr/libsim',
		icon: Folder,
	},
];

export function AppSidebar() {
	return (
		<Sidebar collapsible="icon" variant="inset">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/dashboard" prefetch>
								<AppLogo />
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<NavMain items={mainNavItems} />
			</SidebarContent>

			<SidebarFooter>
				<NavFooter items={footerNavItems} className="mt-auto" />
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
