import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Work() {
	const { work } = usePage<InertiaProps>().props;

	const breadcrumbs: BreadcrumbItem[] = [
		{
			title: 'Saved works',
			href: '/works',
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
			<Link href={`/works/${work.id}/edit`}>Edit</Link>
		</AppLayout>
	);
}
