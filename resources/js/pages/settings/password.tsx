import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { passwordSchema } from '@/types/schemas/auth';
import { Transition } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useInertiaForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Password settings',
    href: '/settings/password',
  },
];

const newPasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    password: passwordSchema,
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ['password_confirmation'],
  });

type PasswordFormValues = z.infer<typeof newPasswordSchema>;

export default function Password() {
  const { put, processing, recentlySuccessful, errors, reset } = useInertiaForm<PasswordFormValues>();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = (data: PasswordFormValues) => {
    put(route('password.update', data), {
      preserveScroll: true,
      onSuccess: () => {
        form.reset();
      },
      onError: (errors) => {
        if (errors.password) {
          form.resetField('password');
          form.resetField('password_confirmation');
        }
        if (errors.current_password) {
          form.resetField('current_password');
        }
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profile settings" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Update password"
            description="Ensure your account is using a long, random password to stay secure"
          />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="abcd1234"
                      />
                    </FormControl>
                    <FormMessage />
                    <InputError message={errors.current_password} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="QN2uXYpcUI"
                      />
                    </FormControl>
                    <FormMessage />
                    <InputError message={errors.password} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="QN2uXYpcUI"
                      />
                    </FormControl>
                    <FormMessage />
                    <InputError message={errors.password_confirmation} />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  disabled={processing}
                >
                  Save password
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
      </SettingsLayout>
    </AppLayout>
  );
}
