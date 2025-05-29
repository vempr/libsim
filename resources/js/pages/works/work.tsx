import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { InertiaProps, SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Work() {
  const { auth, work, creator } = usePage<InertiaProps & SharedData>().props;
  const isOwnWork = work.user_id === auth.user.id;

  const breadcrumbs: BreadcrumbItem[] = isOwnWork
    ? [
        {
          title: 'Saved works',
          href: '/works',
        },
        {
          title: work.title,
          href: `/works/${work.id}`,
        },
      ]
    : [
        {
          title: 'Members',
          href: '/users',
        },
        {
          title: creator,
          href: `/users/${work.user_id}`,
        },
        {
          title: work.title,
          href: `/works/${work.id}`,
        },
      ];

  const editWork = <Link href={`/works/${work.id}/edit`}>Edit</Link>;

  const deleteWork = (
    <Dialog>
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
    </Dialog>
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={work.title} />
      <p className="max-w-96 overflow-scroll">{JSON.stringify(work)}</p>

      {isOwnWork && editWork}
      {isOwnWork && deleteWork}
    </AppLayout>
  );
}
