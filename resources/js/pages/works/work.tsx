import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

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
			<p className="max-w-96 overflow-scroll">{JSON.stringify(work)}
			</p>
			<Link href={`/works/${work.id}/edit`}>Edit</Link>
			<Dialog>
				<DialogTrigger asChild>
					<Button variant="destructive">Delete</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Delete "{work.title}"?</DialogTitle>
						<DialogDescription>
							Make changes to your profile here. Click save when you're done.
						</DialogDescription>
					</DialogHeader>

					<DialogFooter>
						<Button variant="destructive" type="button" onClick={() => router.delete(route('work.destroy', work.id))}>Burn permanently</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</AppLayout>
	);
}
