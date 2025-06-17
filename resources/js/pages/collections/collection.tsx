import AddWorksToCollection from '@/components/add-works-to-collection';
import InertiaPagination from '@/components/inertia-pagination';
import InputError from '@/components/input-error';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, InertiaProps } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, usePage, Link, useForm as useInertiaForm } from '@inertiajs/react';
import { FolderPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const nameSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name cannot be longer than 255 characters'),
});

export default function Collection() {
  const { worksPaginatedResponse, collection, worksForCollection } = usePage<InertiaProps>().props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Collections',
      href: '/collections',
    },
    {
      title: collection.name,
      href: `/collections/${collection.id}`,
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: collection.name,
    },
  });

  const { put, delete: destroy, processing } = useInertiaForm();

  function onSubmit(values: z.infer<typeof nameSchema>) {
    if (values.name === collection.name) return;

    put(
      route('collection.update', {
        ...values,
        collection: collection.id,
      }),
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Collections" />

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <FolderPlus />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit collection</SheetTitle>
            <SheetDescription>Rename your collection of works.</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2 grid gap-y-3 px-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="The best works of all time"
                {...register('name')}
              />
              {errors.name && <InputError message={errors.name.message} />}
            </div>

            <SheetFooter>
              <Button
                type="submit"
                disabled={processing}
              >
                Update collection
              </Button>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <AlertDialog>
        <AlertDialogTrigger>
          <Button variant="destructive">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your collection from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                destroy(
                  route('collection.destroy', {
                    collection: collection.id,
                  }),
                )
              }
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddWorksToCollection
        works={worksForCollection}
        collection={collection}
      />

      {worksPaginatedResponse.data.map((work) => (
        <li>
          <Link href={`/works/${work.id}?collection=${collection.id}`}>{JSON.stringify(work)}</Link>
        </li>
      ))}

      <InertiaPagination paginateItems={worksPaginatedResponse} />
    </AppLayout>
  );
}
