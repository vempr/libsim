import WorkForm from '@/components/work-form';
import AppLayout from '@/layouts/app-layout';
import { type InertiaProps, type BreadcrumbItem } from '@/types/index';
import { PublicationStatus, ReadingStatus, workFormSchema } from '@/types/schemas/work';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function Edit() {
  const { work } = usePage<InertiaProps>().props;
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Saved works',
      href: '/works',
    },
    {
      title: work.title,
      href: `/works/${work.id}`,
    },
    {
      title: 'Edit entry',
      href: `/works/${work.id}/edit`,
    },
  ];

  const editor = useRef<AvatarEditor>(null);
  const [image, setImage] = useState<File | string | null>(work.image);

  const form = useForm<z.infer<typeof workFormSchema>>({
    resolver: zodResolver(workFormSchema),
    defaultValues: {
      title: work.title,
      description: work.description || '',
      status_publication: (work.status_publication as PublicationStatus) || undefined,
      status_reading: work.status_reading as ReadingStatus,
      author: work.author || '',
      language_original: work.language_original || undefined,
      language_translated: work.language_translated || undefined,
      publication_year: work.publication_year || undefined,
      image_self: work.image_self || '',
      tags: work.tags || '',
      links: work.links || '',
    },
  });

  function onSubmit(values: z.infer<typeof workFormSchema>) {
    const fileIsDirty = work.image !== image;

    if (form.formState.isDirty || fileIsDirty) {
      let i = null;
      if (fileIsDirty) {
        i = editor.current?.getImageScaledToCanvas().toDataURL();
      }

      router.put(route('work.update', work.id), {
        ...values,
        image: i,
      });
    } else {
      router.get(route('work', work.id));
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit: ${work.title}`} />

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
