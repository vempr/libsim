import { InputTags } from '@/components/input-tags';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { InertiaProps, type BreadcrumbItem } from '@/types';
import { ProfileFormInput, profileFormSchema } from '@/types/schemas/profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, usePage, useForm as useInertiaForm } from '@inertiajs/react';
import { useForm } from 'react-hook-form';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Your profile',
    href: '/u',
  },
  {
    title: 'Edit',
    href: '/u/edit',
  },
];

export default function Work() {
  const { info } = usePage<InertiaProps>().props;
  const { put } = useInertiaForm();

  const form = useForm<ProfileFormInput>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      introduction: info.introduction || '',
      description: info.description || '',
      good_tags: info.good_tags || '',
      neutral_tags: info.neutral_tags || '',
      bad_tags: info.bad_tags || '',
    },
  });

  function onSubmit(values: ProfileFormInput) {
    put(route('u.update', values));
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit your profile" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="introduction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormDescription>introduction</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormDescription>description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="good_tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>good tags</FormLabel>
                <FormControl>
                  <InputTags
                    {...field}
                    uppercase
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription>Enter good tags</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="neutral_tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>neutral Tags</FormLabel>
                <FormControl>
                  <InputTags
                    {...field}
                    uppercase
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription>Enter neutral tags</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bad_tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>bad tags</FormLabel>
                <FormControl>
                  <InputTags
                    {...field}
                    uppercase
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription>Enter bad tags</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </AppLayout>
  );
}
