import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: 'Saved Works',
		href: '/works/all',
	},
];

export default function All() {
	const { works } = usePage<InertiaProps>().props;

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Saved Works" />
			<ul>
				{works.map(work => <li>{JSON.stringify(work)}</li>)}
			</ul>
		</AppLayout>
	);
}
