import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: 'Saved works',
		href: '/works',
	},
];

export default function All() {
	const { works, flash } = usePage<InertiaProps>().props;

	useEffect(() => {
		if (flash.success) toast(flash.success);
		if (flash.error) toast(flash.error);
	});

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Saved works" />

			<ul>
				{works.map(work => <li>{JSON.stringify(work)}</li>)}
			</ul>
		</AppLayout>
	);
}
