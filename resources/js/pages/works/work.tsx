import { FavoriteForm } from '@/components/favorite-form';
import { MultiSelect } from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/layouts/app-layout';
import { useResponsiveDialog } from '@/lib/responsive';
import { InertiaProps, SharedData, type BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link, router, useForm as useInertiaForm, usePage } from '@inertiajs/react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const collectionSchema = z.object({
  selectedCollections: z.string().array(),
});

type CollectionForm = z.infer<typeof collectionSchema>;

export default function Work() {
  const { auth, work, profile, favorited, collections, breadcrumbs: bc } = usePage<InertiaProps & SharedData>().props;

  const { control, handleSubmit } = useForm<CollectionForm>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      selectedCollections: work.collections?.map((collection) => collection.id) ?? [],
    },
  });
  const { put, processing } = useInertiaForm();

  const isOwnWork = work.user_id === auth.user.id;

  const isMobile = useIsMobile();
  let breadcrumbs: BreadcrumbItem[] = isMobile
    ? [...bc, { title: "Friend's work", href: '' }]
    : [
        ...bc,
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

  const { rd, open, setOpen } = useResponsiveDialog();

  function onSubmit(data: CollectionForm) {
    put(
      route('collection.entry.update.single', {
        work: work.id,
        collection_ids: data.selectedCollections,
      }),
      {
        onFinish: () => setOpen(false),
      },
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={work.title} />

      {!isOwnWork && <h1 className="max-w-96 overflow-scroll">{JSON.stringify(profile)}</h1>}
      <p className="max-w-96 overflow-scroll">{JSON.stringify(work)}</p>

      {(favorited || isOwnWork) && (
        <rd.Wrapper
          open={open}
          onOpenChange={setOpen}
        >
          <rd.Trigger asChild>
            <Button variant="outline">Collections</Button>
          </rd.Trigger>

          <rd.Content>
            <rd.Header>
              <rd.Title>Edit work's collections</rd.Title>
              <rd.Description>Update which collections belongs to your work.</rd.Description>
            </rd.Header>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex h-full flex-col justify-between"
            >
              <Controller
                name="selectedCollections"
                control={control}
                defaultValue={work.collections?.map((collection) => collection.id)}
                render={({ field }) => (
                  <MultiSelect
                    options={collections.map((collection) => ({
                      value: collection.id,
                      label: collection.name,
                    }))}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select collections..."
                    emptyText="No collections found."
                  />
                )}
              />
              <rd.Footer>
                <Button
                  type="submit"
                  disabled={processing}
                >
                  Update work's collections
                </Button>
                <rd.Close asChild>
                  <Button variant="outline">Close</Button>
                </rd.Close>
              </rd.Footer>
            </form>
          </rd.Content>
        </rd.Wrapper>
      )}

      {!isOwnWork && (
        <FavoriteForm
          favorited={favorited}
          workId={work.id}
        />
      )}

      {isOwnWork && editWork}
      {isOwnWork && deleteWork}
    </AppLayout>
  );
}
