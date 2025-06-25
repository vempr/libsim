import { InputTags } from '@/components/input-tags';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { PublicationStatus, ReadingStatus, SearchInput, languages, publicationStatuses, readingStatuses, searchSchema } from '@/types/schemas/work';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useInertiaForm } from '@inertiajs/react';
import { ChevronLeft, EllipsisVerticalIcon, Search } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Flag } from './flag';
import { Button } from './ui/button';
import { Input } from './ui/input';

type AdvancedSearchFormState = {
  q: string | null;
  author: string | null;
  tags: string | null;
  language_original: string | null;
  language_translated: string | null;
  status_publication: PublicationStatus | null;
  status_reading: ReadingStatus | null;
  publication_year: number | null;
};

export function AdvancedSearchForm({ state }: { state?: AdvancedSearchFormState }) {
  const { ls: adv, updateLs: setAdv } = useLocalStorage('advancedSearch');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { get } = useInertiaForm();

  const form = useForm<SearchInput>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      q: state?.q || '',
      author: state?.author || '',
      tags: state?.tags || '',
      language_original: state?.language_original || undefined,
      language_translated: state?.language_translated || undefined,
      status_publication: state?.status_publication || undefined,
      status_reading: state?.status_reading || undefined,
      publication_year: state?.publication_year || undefined,
    },
  });

  const handleSearch = (values?: z.infer<typeof searchSchema>) => {
    setIsSubmitting(true);
    get(route('work.index', { ...values, advanced: adv }), {
      onFinish: () => setIsSubmitting(false),
      onError: () => setIsSubmitting(false),
    });
  };

  const onSubmit = (values: z.infer<typeof searchSchema>) => {
    const trimmedStringValues = {
      q: values.q?.trim(),
      author: values.author?.trim(),
      tags: values.tags?.trim(),
    };

    if (!adv) {
      if (trimmedStringValues.q?.length) handleSearch({ q: trimmedStringValues.q });
    } else {
      delete values.q;
      handleSearch({ ...values, ...trimmedStringValues });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-2"
      >
        <div className={adv ? 'hidden' : 'mb-0 flex flex-col-reverse gap-x-1 gap-y-2'}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setAdv(!adv);
              window.scrollTo(0, 0);
            }}
            className="flex gap-x-1.5 md:hidden"
          >
            <div className="-ml-2 rounded-full border p-0.5">
              <EllipsisVerticalIcon />
            </div>
            <p className="-translate-y-0.25">Advanced search</p>
          </Button>

          <div className="flex gap-x-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setAdv(!adv);
                window.scrollTo(0, 0);
              }}
              className="hidden gap-x-1.5 md:flex"
            >
              <div className="-ml-2 rounded-full border p-0.5">
                <EllipsisVerticalIcon />
              </div>
              <p className="-translate-y-0.25">Advanced search</p>
            </Button>

            <FormField
              control={form.control}
              name="q"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="sr-only">Search by title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.length === 0) {
                          field.onChange('');
                          handleSearch();
                        } else field.onChange(val);
                      }}
                      placeholder="Search for works..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="not-sr-only w-fit md:w-16"
            >
              <Search />
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="sr-only"
            >
              Search for user
            </Button>
          </div>
        </div>

        <div className={adv ? 'flex flex-col gap-y-3' : 'hidden'}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <FormField
              control={form.control}
              name="status_publication"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="font-secondary">Publication status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={(state?.status_publication as PublicationStatus) ?? undefined}
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
                <FormItem className="flex-1">
                  <FormLabel className="font-secondary">Reading status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={(state?.status_reading as ReadingStatus) ?? undefined}
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
              name="language_original"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="font-secondary">Original Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={state?.language_original ?? undefined}
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
                          <Flag
                            name={name}
                            code={code}
                          />
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
                <FormItem className="flex-1">
                  <FormLabel className="font-secondary">Translated Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={state?.language_translated ?? undefined}
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
                          <Flag
                            name={name}
                            code={code}
                          />
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-2 lg:flex-row lg:items-start">
            <FormField
              control={form.control}
              name="publication_year"
              render={({ field }) => (
                <FormItem className="flex-2 lg:flex-1">
                  <FormLabel className="font-secondary">Publication Year</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </FormControl>
                  <FormDescription>-5000 {'< year <'} 5000</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem className="flex-2">
                  <FormLabel className="font-secondary">Author</FormLabel>
                  <FormControl>
                    <InputTags
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value)}
                      shorten
                    >
                      <FormDescription>Use commas to register names, up to 255 characters</FormDescription>
                    </InputTags>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="flex-2">
                  <FormLabel className="font-secondary">Tags</FormLabel>
                  <FormControl>
                    <InputTags
                      lowercase
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value)}
                      shorten
                      uppercase
                    >
                      <FormDescription>Use commas to register tags, up to 1000 characters</FormDescription>
                    </InputTags>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-x-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setAdv(!adv);
                window.scrollTo(0, 0);
              }}
            >
              <ChevronLeft /> <p className="sr-only">Back to simple search</p>
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={() => handleSearch()}
              className="dark:hover:opacity-80"
            >
              Reset query options
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="not-sr-only w-16 flex-1"
            >
              <Search />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
