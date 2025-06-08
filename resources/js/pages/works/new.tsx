import WorkForm from '@/components/work-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { workFormSchema } from '@/types/schemas/work';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, useForm as useInertiaForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Create entry', href: '/works/create' }];

export default function New() {
  const { post } = useInertiaForm();
  const editor = useRef<AvatarEditor>(null);
  const [image, setImage] = useState<File | string | null>(null);

  const form = useForm<z.infer<typeof workFormSchema>>({
    resolver: zodResolver(workFormSchema),
    defaultValues: {
      status_reading: 'reading',
    },
  });

  function onSubmit(values: z.infer<typeof workFormSchema>) {
    post(
      route('work.store', {
        ...values,
        image: editor.current?.getImageScaledToCanvas().toDataURL(),
      }),
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create entry" />

      <WorkForm
        image={image}
        setImage={setImage}
        form={form}
        onSubmit={onSubmit}
        editor={editor}
      />
    </AppLayout>
  );
}
