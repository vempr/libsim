import { Flag } from '@/components/flag';
import { InputTags } from '@/components/input-tags';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { languages, PublicationStatus, publicationStatuses, ReadingStatus, readingStatuses, workFormSchema } from '@/types/schemas/work';
import { Dispatch, RefObject, SetStateAction, useCallback, useEffect, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useDropzone } from 'react-dropzone';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

interface WorkFormProps {
  image: File | string | null;
  setImageIsDirty?: Dispatch<SetStateAction<boolean>>;
  setImage: Dispatch<SetStateAction<string | File | null>>;
  form: UseFormReturn<z.infer<typeof workFormSchema>>;
  onSubmit: (values: z.infer<typeof workFormSchema>) => void;
  editor: RefObject<AvatarEditor | null>;
  isSubmitting: boolean;
}

const MAX_FILE_SIZE = 16777216;
function fileSizeValidator(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    return {
      code: 'file-too-large',
      message: `File size is larger than 16MB`,
    };
  }

  return null;
}

export default function WorkForm({ image, setImage, form, onSubmit, editor, isSubmitting, setImageIsDirty }: WorkFormProps) {
  const [scale, setScale] = useState<number>(1);
  const [workExists, setWorkExists] = useState(false);

  const isMobile = useIsMobile();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setImage(acceptedFiles[0]);
    },
    [setImage],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    validator: fileSizeValidator,
    maxFiles: 1,
    accept: {
      'image/avif': [],
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
    },
  });

  useEffect(() => {
    if (form.getValues('title')?.length > 0) setWorkExists(true);
  }, [form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mb-6 space-y-6"
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>The title of the work, up to 255 characters, required</FormDescription>
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
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>A brief summary/synopsis of the work, up to 2000 characters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
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
            name="author"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Author(s)</FormLabel>
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
              <FormItem className="flex-1">
                <FormLabel>Tags</FormLabel>
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
                  shorten
                >
                  <FormDescription>Enter links separated by pipe symbols |, optional, up to 3000 characters</FormDescription>
                </InputTags>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Tabs
          defaultValue={form.getValues('image_self')?.length ? 'url' : 'upload'}
          className="w-full -translate-y-2"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="url">Image URL</TabsTrigger>
          </TabsList>

          <TabsContent value="url">
            <FormField
              control={form.control}
              name="image_self"
              render={({ field }) => (
                <FormItem className="mt-1">
                  <FormLabel>Image (URL)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      {...form.register('image_self', {
                        required: false,
                      })}
                    />
                  </FormControl>
                  <FormDescription>URL for the cover image of the work, up to 255 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="upload">
            <div className="mt-1 flex flex-col gap-y-3 sm:flex-row sm:gap-x-3">
              {image && (
                <div className="flex flex-col items-center justify-center gap-y-4">
                  <AvatarEditor
                    ref={editor}
                    image={image}
                    width={isMobile ? 300 : 400}
                    height={isMobile ? 426.5745 : 568.766}
                    border={3}
                    color={[255, 224, 102]}
                    scale={scale}
                    borderRadius={2}
                    borderColor={[58, 91, 160]}
                    className="rounded-sm"
                    crossOrigin="anonymous"
                  />
                  <Slider
                    defaultValue={[0]}
                    onValueChange={(s) => {
                      setScale(1 + s[0] / 25);
                      if (setImageIsDirty) setImageIsDirty(true);
                    }}
                    max={100}
                    step={1}
                  />
                </div>
              )}
              <div
                {...getRootProps()}
                className="flex flex-1 flex-col items-center justify-center rounded border-4 border-dashed p-6"
              >
                <input {...getInputProps()} />
                {isDragActive ? <p>Drop the file here ...</p> : <p className="text-sm">Drag 'n' drop your file here, or click to select files</p>}
                <em className="text-muted-foreground text-xs">Accepted formats: AVIF, JPEG, PNG, WEBP. Max file size: 16MB.</em>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {workExists ? 'Update your entry!' : 'Create new entry!'}
        </Button>
      </form>
    </Form>
  );
}
