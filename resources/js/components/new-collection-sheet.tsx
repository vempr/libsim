import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useInertiaForm } from '@inertiajs/react';
import { FolderPlus } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const nameSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name cannot be longer than 255 characters'),
});

export default function NewCollectionSheet({ children }: { children?: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    formState: { errors },
    getValues,
  } = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
  });

  const { post, processing, wasSuccessful } = useInertiaForm();

  function onSubmit(values: z.infer<typeof nameSchema>) {
    post(route('collection.store', values));
  }

  useEffect(() => {
    if (wasSuccessful) setIsOpen(false);
  }, [setIsOpen, wasSuccessful]);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SheetTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="outline">
            <FolderPlus />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New collection</SheetTitle>
          <SheetDescription>Add a new collection to sort your own works.</SheetDescription>
        </SheetHeader>
        <div>
          <div className="mb-2 grid gap-y-3 px-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="The best works of all time"
              {...register('name')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onSubmit(getValues());
                }
              }}
            />
            {errors.name && <InputError message={errors.name.message} />}
          </div>

          <SheetFooter>
            <Button
              type="button"
              disabled={processing}
              onClick={() => onSubmit(getValues())}
            >
              Create collection
            </Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
