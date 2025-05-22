import { InputTags } from '@/components/input-tags';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type InertiaProps, type BreadcrumbItem } from '@/types/index';
import { languages, PublicationStatus, publicationStatuses, ReadingStatus, readingStatuses, workFormSchema } from '@/types/schemas/work';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
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
      image: work.image || '',
      tags: work.tags || '',
      links: work.links || '',
    },
  });

  const isDirty = form.formState.isDirty;

  function onSubmit(values: z.infer<typeof workFormSchema>) {
    if (isDirty) {
      router.put(route('work.update', work.id), values);
    } else {
      router.get(route('work', work.id));
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit: ${work.title}`} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>The title of the work, required</FormDescription>
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
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>A brief summary or synopsis of the work, optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status_publication"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publication status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select publication status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {publicationStatuses.map((s: PublicationStatus) => (
                      <SelectItem
                        key={s}
                        value={s}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status_reading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reading status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reading status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {readingStatuses.map((s: ReadingStatus) => (
                      <SelectItem
                        key={s}
                        value={s}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <InputTags
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription>Use commas as separator for multiple names, optional, up to 255 characters.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language_original"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Original Language</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select original language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(languages).map(([code, name]) => (
                      <SelectItem
                        key={code}
                        value={code}
                      >
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language_translated"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Translated Language</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select translated language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(languages).map(([code, name]) => (
                      <SelectItem
                        key={code}
                        value={code}
                      >
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publication_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publication Year</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </FormControl>
                <FormDescription>Optional, between -5000 and 5000</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image (URL)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    {...form.register('image', {
                      required: false,
                    })}
                  />
                </FormControl>
                <FormDescription>URL for the cover image of the work, optional, up to 255 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <InputTags
                    lowercase
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription>Enter tags separated by commas e.g. "romance,comedy, isekai", optional, up to 1000 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="links"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Links</FormLabel>
                <FormControl>
                  <InputTags
                    displayAsList
                    pipeAsSeperator
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    children={<FormDescription>Enter links separated by pipe symbols |, optional, up to 3000 characters</FormDescription>}
                  />
                </FormControl>
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
