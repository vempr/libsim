import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: 'Main Menu',
		href: '/dashboard',
	},
];

export default function Dashboard() {
	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Main Menu" />
		</AppLayout>
	);
}
