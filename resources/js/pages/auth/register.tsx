import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
    name: '',
    email: '',
    password: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details below to create your account"
    >
      <Head title="Register" />
      <form
        className="flex flex-col gap-6"
        onSubmit={submit}
      >
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Username</Label>
            <Input
              id="name"
              type="text"
              required
              autoFocus
              tabIndex={1}
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              disabled={processing}
              placeholder="books12"
            />
            <InputError
              message={errors.name}
              className="mt-2"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              required
              tabIndex={2}
              autoComplete="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              disabled={processing}
              placeholder="booky@umail.org"
            />
            <InputError message={errors.email} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              tabIndex={3}
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              disabled={processing}
              placeholder="secretb00k_"
            />
            <InputError message={errors.password} />
          </div>

          <Button
            type="submit"
            className="mt-2 w-full"
            tabIndex={4}
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
            tabIndex={5}
          >
            Log in
          </TextLink>
        </div>
      </form>
    </AuthLayout>
  );
}
