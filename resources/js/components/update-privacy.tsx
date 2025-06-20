import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useInertiaForm, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import HeadingSmall from './heading-small';
import { Button } from './ui/button';
import { Switch } from './ui/switch';

const PrivacySchema = z.object({
  hide_profile: z.boolean(),
  private_works: z.boolean(),
});

type PrivacyOptions = z.infer<typeof PrivacySchema>;

export default function UpdatePrivacy() {
  const { auth } = usePage<SharedData>().props;
  const { patch, processing, recentlySuccessful } = useInertiaForm<PrivacyOptions>();

  const form = useForm<PrivacyOptions>({
    resolver: zodResolver(PrivacySchema),
    defaultValues: {
      hide_profile: auth.user.hide_profile ? true : false,
      private_works: auth.user.private_works ? true : false,
    },
  });

  function onSubmit(data: PrivacyOptions) {
    console.log(data);
    patch(route('profile.update', data), {
      preserveScroll: true,
    });
  }

  return (
    <div
      className="space-y-6"
      id="privacy-options"
    >
      <HeadingSmall
        title="Privacy options"
        description="Update profile and work visibility"
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="hide_profile"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Hide profile</FormLabel>
                    <FormDescription>Users can't see and search for your profile.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="private_works"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Private works</FormLabel>
                    <FormDescription>Friends are not able to see your works.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center gap-4">
            <Button
              disabled={processing}
              type="submit"
            >
              Save privacy options
            </Button>
            <Transition
              show={recentlySuccessful}
              enter="transition ease-in-out"
              enterFrom="opacity-0"
              leave="transition ease-in-out"
              leaveTo="opacity-0"
            >
              <p className="text-sm text-neutral-600">Saved</p>
            </Transition>
          </div>
        </form>
      </Form>
    </div>
  );
}
