import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Work() {
	const { work } = usePage<InertiaProps>().props;

	const breadcrumbs: BreadcrumbItem[] = [
		{
			title: 'Saved Works',
			href: '/works/all',
		},
		{
			title: work.title,
			href: `/works/${work.id}`,
		}
	];

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title={work.title} />
			<p>{JSON.stringify(work)}
			</p>
		</AppLayout>
	);
}
