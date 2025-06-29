import AddWorksToCollection from '@/components/add-works-to-collection';
import { EmptyBottomMargin, EmptyListPlaceholder } from '@/components/empty';
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
import WorkCard, { WorkGrid } from '@/components/work';
import AppLayout from '@/layouts/app-layout';
import { hasOnePage } from '@/lib/pagination';
import { useResponsiveDialog } from '@/lib/responsive';
import { BreadcrumbItem, InertiaProps } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, usePage, useForm as useInertiaForm } from '@inertiajs/react';
import { Pencil, Trash } from 'lucide-react';
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

  const { rd, open, setOpen } = useResponsiveDialog();

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
      {
        onFinish: () => setOpen(false),
      },
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Collections" />

      <div className="mb-2 flex flex-row items-center gap-x-1">
        <AlertDialog>
          <AlertDialogTrigger className="bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 focus-visible:border-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-xs transition-all outline-none hover:cursor-pointer hover:opacity-80 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <Trash className="size-4" />
            <p className="sr-only">Delete</p>
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
                className="bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 focus-visible:border-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-white"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <rd.Wrapper
          open={open}
          onOpenChange={setOpen}
        >
          <rd.Trigger asChild>
            <Button variant="outline">
              <Pencil className="size-4" />
              <p className="sr-only">Rename</p>
            </Button>
          </rd.Trigger>
          <rd.Content>
            <rd.Header>
              <rd.Title>Edit collection</rd.Title>
              <rd.Description>Rename your collection.</rd.Description>
            </rd.Header>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex h-full flex-col justify-between"
            >
              <div className="mb-2 grid gap-y-3 px-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="The best works of all time"
                  {...register('name')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSubmit(onSubmit);
                    }
                  }}
                />
                {errors.name && <InputError message={errors.name.message} />}
              </div>

              <rd.Footer>
                <Button
                  type="submit"
                  disabled={processing}
                >
                  Update collection
                </Button>
                <rd.Close asChild>
                  <Button variant="outline">Close</Button>
                </rd.Close>
              </rd.Footer>
            </form>
          </rd.Content>
        </rd.Wrapper>

        <AddWorksToCollection
          works={worksForCollection}
          collection={collection}
        />
      </div>

      <WorkGrid>
        {worksPaginatedResponse?.data.map((work) => (
          <WorkCard
            key={work.id}
            work={work}
            collection={collection.id}
          />
        ))}
      </WorkGrid>

      <EmptyBottomMargin />

      {worksPaginatedResponse?.data.length === 0 && <EmptyListPlaceholder>You haven't registered any works yet</EmptyListPlaceholder>}

      {!hasOnePage(worksPaginatedResponse) && worksPaginatedResponse && <InertiaPagination paginateItems={worksPaginatedResponse} />}
    </AppLayout>
  );
}
