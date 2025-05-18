import { AdvancedSearchForm } from '@/components/advanced-search';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: 'Saved works',
		href: '/works',
	},
];

export default function All() {
	const { works, state, flash, advanced } = usePage<InertiaProps>().props;

	useEffect(() => {
		if (flash.success) toast(flash.success);
		if (flash.error) toast(flash.error);
	});

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Saved works" />

			<AdvancedSearchForm state={state} advanced={advanced} />

			<ul>
				{works.map(work => <li>{JSON.stringify(work)}</li>)}
			</ul>
		</AppLayout>
	);
}
