import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResponsiveDialog } from '@/lib/responsive';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useInertiaForm } from '@inertiajs/react';
import { FolderPlus } from 'lucide-react';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const nameSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name cannot be longer than 255 characters'),
});

export default function NewCollectionSheet({ children }: { children?: ReactNode }) {
  const { rd, open, setOpen } = useResponsiveDialog();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
  });

  const { post, processing } = useInertiaForm();

  function onSubmit(values: z.infer<typeof nameSchema>) {
    post(route('collection.store', values), { onFinish: () => setOpen(false), preserveScroll: true });
  }

  return (
    <rd.Wrapper
      open={open}
      onOpenChange={setOpen}
    >
      <rd.Trigger asChild>
        {children ? (
          children
        ) : (
          <Button
            variant="secondary"
            size="sm"
          >
            <FolderPlus />
          </Button>
        )}
      </rd.Trigger>
      <rd.Content>
        <rd.Header>
          <rd.Title>New collection</rd.Title>
          <rd.Description>Add a new collection to sort your personal works.</rd.Description>
        </rd.Header>
        <form className="flex h-full flex-col justify-between">
          <div className="mb-2 grid gap-y-3 px-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Perfection"
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
              type="button"
              disabled={processing}
              onClick={handleSubmit(onSubmit)}
            >
              Create collection
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
