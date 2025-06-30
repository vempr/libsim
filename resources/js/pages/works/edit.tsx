import WorkForm from '@/components/work-form';
import AppLayout from '@/layouts/app-layout';
import { type InertiaProps, type BreadcrumbItem } from '@/types/index';
import { PublicationStatus, ReadingStatus, workFormSchema } from '@/types/schemas/work';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, useForm as useInertiaForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function Edit() {
  const { work } = usePage<InertiaProps>().props;
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Personal works',
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageIsDirty, setImageIsDirty] = useState(false);

  const { get } = useInertiaForm();

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
    setIsSubmitting(true);

    const trimmedStringValues = {
      title: values.title.trim(),
      description: values.description?.trim(),
      author: values.author?.trim(),
      tags: values.tags?.trim(),
      links: values.links?.trim(),
      image_self: values.image_self?.trim(),
    };

    const processedValues = {
      ...values,
      ...trimmedStringValues,
    };

    const isDirty =
      trimmedStringValues.title !== work.title ||
      trimmedStringValues.description !== (work.description || '') ||
      trimmedStringValues.author !== (work.author || '') ||
      processedValues.status_publication !== (work.status_publication || undefined) ||
      processedValues.status_reading !== work.status_reading ||
      processedValues.language_original !== (work.language_original || undefined) ||
      processedValues.language_translated !== (work.language_translated || undefined) ||
      processedValues.publication_year !== (work.publication_year || undefined) ||
      trimmedStringValues.image_self !== (work.image_self || '') ||
      trimmedStringValues.tags !== (work.tags || '') ||
      trimmedStringValues.links !== (work.links || '') ||
      imageIsDirty; // i give up on form.formState.isDirty

    if (isDirty) {
      if (editor.current && imageIsDirty) {
        editor.current.getImageScaledToCanvas().toBlob((blob) => {
          const formData = new FormData();
          if (blob) {
            const file = new File([blob], 'untitled', { type: blob.type });
            formData.append('image', file);
          }

          router.post(
            route('work.update', {
              work: work.id,
              ...processedValues,
            }),
            formData,
            {
              forceFormData: true,
              onFinish: () => setIsSubmitting(false),
              onError: () => setIsSubmitting(false),
            },
          );
        });
      } else {
        router.post(
          route('work.update', {
            work: work.id,
            ...processedValues,
          }),
          undefined,
          {
            onFinish: () => setIsSubmitting(false),
            onError: () => setIsSubmitting(false),
          },
        );
      }
    } else {
      get(route('work', work.id), { onFinish: () => setIsSubmitting(false) });
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
        isSubmitting={isSubmitting}
        setImageIsDirty={setImageIsDirty}
      />
    </AppLayout>
  );
}
