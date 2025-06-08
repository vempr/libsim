import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type InertiaProps, type BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link, useForm as useInertiaForm, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const chatForm = z.object({
  text: z.string(),
});

type Chat = z.infer<typeof chatForm>;

export default function All() {
  const { friend, messages } = usePage<InertiaProps>().props;
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Messages',
      href: '/chat',
    },
    {
      title: friend.name,
      href: `/chat/${friend.id}`,
    },
  ];

  const { post } = useInertiaForm();
  const { register, handleSubmit } = useForm<Chat>({
    resolver: zodResolver(chatForm),
    defaultValues: {
      text: '',
    },
  });

  const onSubmit = (values: Chat) => {
    const text = values.text;

    if (text.trim().length) {
      post(
        route('chat.store', {
          friend: friend.id,
          text,
        }),
      );
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Messages" />

      <Link href={`/users/${friend.id}`}>{friend.name}</Link>

      <ul>
        {messages.map((message) => (
          <li>{message.text}</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register('text')} />
        <Button type="submit">Send</Button>
      </form>
    </AppLayout>
  );
}
