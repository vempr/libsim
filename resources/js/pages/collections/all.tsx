import InputError from '@/components/input-error';
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

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Collections',
    href: '/collections',
  },
];

const nameSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name cannot be longer than 255 characters'),
});

export default function All() {
  const { collectionsPaginatedResponse } = usePage<InertiaProps>().props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
  });

  const { post, processing } = useInertiaForm();

  function onSubmit(values: z.infer<typeof nameSchema>) {
    post(route('collection.store', values));
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
            <SheetTitle>New collection</SheetTitle>
            <SheetDescription>Add a new collection to sort your own works.</SheetDescription>
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
                Create collection
              </Button>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {collectionsPaginatedResponse.data.map((collection) => (
        <li>
          <Link href={`/collections/${collection.id}`}>{collection.name}</Link>
        </li>
      ))}
    </AppLayout>
  );
}
