import { InputTags } from '@/components/input-tags';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { PublicationStatus, ReadingStatus, SearchInput, languages, publicationStatuses, readingStatuses, searchSchema } from '@/types/schemas/work';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Flag } from './flag';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

export function AdvancedSearchForm({
  state,
  advanced,
}: {
  state?: {
    q: string | null;
    author: string | null;
    tags: string | null;
    language_original: string | null;
    language_translated: string | null;
    status_publication: PublicationStatus | null;
    status_reading: ReadingStatus | null;
    publication_year: number | null;
  };
  advanced: boolean;
}) {
  const [adv, setAdv] = useState(advanced);
  const { ls, updateLs } = useLocalStorage('searchIncludeFavorites');

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
    router.get(route('work.index'), { ...values, advanced: adv, searchIncludeFavorites: ls });
  };

  const onSubmit = (values: z.infer<typeof searchSchema>) => {
    if (!adv) {
      handleSearch({ q: values.q });
    } else {
      delete values.q;
      handleSearch(values);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className={adv ? 'hidden' : 'block'}>
          <FormField
            control={form.control}
            name="q"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search by title</FormLabel>
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className={adv ? 'block space-y-6' : 'hidden'}>
          <FormField
            control={form.control}
            name="status_publication"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publication status</FormLabel>
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
              <FormItem>
                <FormLabel>Reading status</FormLabel>
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
              <FormItem>
                <FormLabel>Translated Language</FormLabel>
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
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <InputTags
                    lowercase
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription>Enter tags separated by commas e.g. "romance,comedy, isekai", optional, up to 1000 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setAdv(!adv);
            window.scrollTo(0, 0);
          }}
        >
          {adv ? 'Simple search' : 'Advanced search'}
        </Button>

        <Button type="submit">Submit</Button>

        <div className="flex items-center space-x-2">
          <Switch
            id="include-favorites"
            checked={ls}
            onCheckedChange={updateLs}
          />
          <Label htmlFor="include-favorites">Include favorited works</Label>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={() => handleSearch()}
          className={adv ? 'inline' : 'hidden'}
        >
          Reset query options
        </Button>
      </form>
    </Form>
  );
}
