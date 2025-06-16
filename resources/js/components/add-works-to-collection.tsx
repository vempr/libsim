import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Collection, SimpleWork } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useInertiaForm } from '@inertiajs/react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { MultiSelect } from './multi-select';
import { Button } from './ui/button';

interface AddWorksToCollectionProps {
  works: SimpleWork[];
  collection: Collection;
}

const worksSchema = z.object({
  selectedWorks: z.string().array(),
});

type WorksForm = z.infer<typeof worksSchema>;

export default function AddWorksToCollection({ works, collection }: AddWorksToCollectionProps) {
  const { control, handleSubmit } = useForm<WorksForm>({
    resolver: zodResolver(worksSchema),
    defaultValues: {
      selectedWorks: works.filter((work) => work.collections.some((c) => c.id === collection.id)).map((work) => work.id),
    },
  });

  const { put, processing } = useInertiaForm();

  function onSubmit(values: WorksForm) {
    put(
      route('collection.entry.update.multiple', {
        work_ids: values.selectedWorks,
        collection: collection.id,
      }),
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Works</Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit collection's works</SheetTitle>
          <SheetDescription>Update which works belongs to your collection.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="selectedWorks"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={works.map((work) => ({
                  value: work.id,
                  label: `${work.title} - ${work.author}`,
                }))}
                selected={field.value}
                onChange={field.onChange}
                placeholder="Select works..."
                emptyText="No works found."
                hideNewCollectionSheet
              />
            )}
          />
          <SheetFooter>
            <Button
              type="submit"
              disabled={processing}
            >
              Update collection's works
            </Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
