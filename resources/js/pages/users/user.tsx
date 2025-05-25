import AppLayout from '@/layouts/app-layout';
import { InertiaProps, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Work() {
  const { user } = usePage<InertiaProps>().props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Members',
      href: '/users',
    },
    {
      title: user.name,
      href: `/users/${user.id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={user.name} />
      <p className="max-w-96 overflow-scroll">{JSON.stringify(user)}</p>

      {/* <Link href={`/works/${work.id}/edit`}>Edit</Link> */}

      {/* <Dialog>
				<DialogTrigger asChild>
					<Button variant="destructive">Delete</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Delete "{work.title}"?</DialogTitle>
						<DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
					</DialogHeader>

					<DialogFooter>
						<Button
							variant="destructive"
							type="button"
							onClick={() => router.delete(route('work.destroy', work.id))}
						>
							Burn permanently
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog> */}
    </AppLayout>
  );
}
