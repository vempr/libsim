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
  const { put, processing } = useInertiaForm();

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
          className="flex h-full flex-col gap-y-4"
        >
          <FormField
            control={form.control}
            name="introduction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Introduction</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormDescription>Introduce yourself in a few words, up to 255 characters</FormDescription>
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
                <FormDescription>Tell a little more about yourself, up to 2000 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-start gap-x-2">
            <FormField
              control={form.control}
              name="good_tags"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>I love to read...</FormLabel>
                  <FormControl>
                    <InputTags
                      {...field}
                      uppercase
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <FormDescription>Use commas to register your favorite tags, up to 255 characters</FormDescription>
                    </InputTags>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="neutral_tags"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>This is pretty fine...</FormLabel>
                  <FormControl>
                    <InputTags
                      {...field}
                      uppercase
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <FormDescription>Use commas to register tolerable tags, up to 255 characters</FormDescription>
                    </InputTags>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bad_tags"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>I really hate...</FormLabel>
                  <FormControl>
                    <InputTags
                      {...field}
                      uppercase
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <FormDescription>Use commas to register atrocious tags, up to 255 characters</FormDescription>
                    </InputTags>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="mt-auto mb-2.5 w-full"
            disabled={processing}
          >
            Update your profile!
          </Button>
        </form>
      </Form>
    </AppLayout>
  );
}
