import { Flag } from '@/components/flag';
import { InputTags } from '@/components/input-tags';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { languages, PublicationStatus, publicationStatuses, ReadingStatus, readingStatuses, workFormSchema } from '@/types/schemas/work';
import { Dispatch, RefObject, SetStateAction, useCallback, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useDropzone } from 'react-dropzone';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

interface WorkFormProps {
  image: File | string | null;
  setImage: Dispatch<SetStateAction<string | File | null>>;
  form: UseFormReturn<z.infer<typeof workFormSchema>>;
  onSubmit: (values: z.infer<typeof workFormSchema>) => void;
  editor: RefObject<AvatarEditor | null>;
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

export default function WorkForm({ image, setImage, form, onSubmit, editor }: WorkFormProps) {
  const [scale, setScale] = useState<number>(1);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImage(acceptedFiles[0]);
  }, []);

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

  return (
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

        <Tabs
          defaultValue={image ? 'upload' : 'url'}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="url">Image URL</TabsTrigger>
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
          </TabsList>

          <TabsContent value="url">
            <FormField
              control={form.control}
              name="image_self"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image (URL)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      {...form.register('image_self', {
                        required: false,
                      })}
                    />
                  </FormControl>
                  <FormDescription>URL for the cover image of the work, optional, up to 255 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="upload">
            <div className="flex flex-col gap-y-3 sm:flex-row sm:gap-x-3">
              <div
                {...getRootProps()}
                className="flex flex-1 flex-col items-center justify-center border-4 border-dashed p-6"
              >
                <input {...getInputProps()} />
                {isDragActive ? <p>Drop the file here ...</p> : <p className="text-sm">Drag 'n' drop your file here, or click to select files</p>}
                <em className="text-muted-foreground text-xs">Accepted formats: AVIF, JPEG, PNG, WEBP. Max file size: 16MB.</em>
              </div>
              {image && (
                <div className="flex flex-col items-center justify-center gap-y-4">
                  <AvatarEditor
                    ref={editor}
                    image={image}
                    width={200}
                    height={284.383}
                    border={4}
                    color={[255, 255, 255, 0.7]} // RGBA
                    scale={scale}
                    borderRadius={4}
                    className="rounded-sm"
                  />
                  <Slider
                    defaultValue={[0]}
                    onValueChange={(s) => setScale(1 + s[0] / 25)}
                    max={100}
                    step={1}
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
