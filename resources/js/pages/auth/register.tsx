import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/layouts/auth-layout';
import { RegisterArgs, registerSchema } from '@/types/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, useForm as useInertiaForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const { post, processing, errors, reset } = useInertiaForm<RegisterArgs>();

  const form = useForm<RegisterArgs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: RegisterArgs) => {
    post(route('register', data), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details below to create your account"
    >
      <Head title="Register" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      autoFocus
                      tabIndex={1}
                      disabled={processing}
                      placeholder="e.g. books12"
                    />
                  </FormControl>
                  <FormMessage />
                  <InputError
                    message={errors.name}
                    className="mt-2"
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      tabIndex={2}
                      autoComplete="email"
                      disabled={processing}
                      placeholder="e.g. booky@umail.org"
                    />
                  </FormControl>
                  <FormMessage />
                  <InputError message={errors.email} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        tabIndex={3}
                        disabled={processing}
                        placeholder="e.g. secretb00k_"
                      />
                      <div className="mt-4 flex items-center space-x-2">
                        <Checkbox
                          id="see-password"
                          tabIndex={4}
                          checked={showPassword}
                          onCheckedChange={() => setShowPassword(!showPassword)}
                        />
                        <label
                          htmlFor="see-password"
                          className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Show password
                        </label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <InputError message={errors.password} />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="mt-2 w-full"
              tabIndex={5}
              disabled={processing}
            >
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Create account
            </Button>
          </div>

          <div className="text-muted-foreground text-center text-sm">
            Already have an account?{' '}
            <TextLink
              href={route('login')}
              tabIndex={6}
            >
              Log in
            </TextLink>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
}
