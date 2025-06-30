import { useResponsiveDialog } from '@/lib/responsive';
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

  const { rd, open, setOpen } = useResponsiveDialog();

  function onSubmit(values: WorksForm) {
    console.log(values);
    put(
      route('collection.entry.update.multiple', {
        work_ids: values.selectedWorks,
        collection: collection.id,
      }),
      {
        onFinish: () => setOpen(false),
        preserveScroll: true,
      },
    );
  }

  return (
    <rd.Wrapper
      open={open}
      onOpenChange={setOpen}
    >
      <rd.Trigger asChild>
        <Button
          variant="outline"
          className="flex-1"
        >
          Edit collection entries
        </Button>
      </rd.Trigger>

      <rd.Content>
        <rd.Header>
          <rd.Title>Edit collection's works</rd.Title>
          <rd.Description>Update which works belong to your collection.</rd.Description>
        </rd.Header>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full flex-col justify-between"
        >
          <Controller
            name="selectedWorks"
            control={control}
            render={({ field }) => (
              <div className="flex h-full w-full flex-col px-4">
                <MultiSelect
                  options={works.map((work) => ({
                    value: work.id,
                    label: `${work.title} (${work.author})`,
                  }))}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder="Select works..."
                  emptyText="No works found."
                  hideNewCollectionSheet
                />

                {field.value && (
                  <ul className="my-2 max-h-60 space-y-1 overflow-scroll">
                    {field.value.map((id) => {
                      const work = works.find((w) => w.id === id);
                      if (work)
                        return (
                          <li
                            key={id}
                            className="bg-accent text-accent-foreground rounded border px-2 py-1 text-xs"
                          >
                            {work.title}{' '}
                            {work.author ? `(${work.author.replaceAll(',', ', ')})` : <span className="font-mono opacity-80">(N/A)</span>}
                          </li>
                        );
                    })}
                  </ul>
                )}
              </div>
            )}
          />
          <rd.Footer>
            <Button
              type="submit"
              disabled={processing}
            >
              Update collection's works
            </Button>
            <rd.Close asChild>
              <Button variant="outline">Close</Button>
            </rd.Close>
          </rd.Footer>
        </form>
      </rd.Content>
    </rd.Wrapper>
  );
}
