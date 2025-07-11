import WorkForm from '@/components/work-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { workFormSchema } from '@/types/schemas/work';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Create entry', href: '/works/create' }];

export default function New() {
  const editor = useRef<AvatarEditor>(null);
  const [image, setImage] = useState<File | string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof workFormSchema>>({
    resolver: zodResolver(workFormSchema),
    defaultValues: {
      status_reading: 'reading',
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

    if (image && editor.current) {
      editor.current.getImageScaledToCanvas().toBlob((blob) => {
        const formData = new FormData();
        if (blob) {
          const file = new File([blob], 'untitled', { type: blob.type });
          formData.append('image', file);
        }

        router.post(route('work.post', processedValues), formData, {
          forceFormData: true,
          onFinish: () => setIsSubmitting(false),
          onError: () => setIsSubmitting(false),
        });
      });
    } else {
      router.post(route('work.post', processedValues), undefined, {
        onFinish: () => setIsSubmitting(false),
        onError: () => setIsSubmitting(false),
      });
    }
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
        isSubmitting={isSubmitting}
      />
    </AppLayout>
  );
}
