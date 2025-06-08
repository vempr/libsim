import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type InertiaProps, type BreadcrumbItem, SharedData, Message } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link, useForm as useInertiaForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const TEMP_MESSAGE_ID = 'VrPVHDtUG6';

function getCurrentDateTime() {
  const now = new Date();

  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const chatForm = z.object({
  text: z.string().max(1000),
});

type Chat = z.infer<typeof chatForm>;

export default function All() {
  const { friend, messages: initialMessages, auth } = usePage<InertiaProps & SharedData>().props;
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Messages', href: '/chat' },
    { title: friend.name, href: `/chat/${friend.id}` },
  ];

  const { post } = useInertiaForm();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Chat>({
    resolver: zodResolver(chatForm),
    defaultValues: { text: '' },
  });

  const onSubmit = (values: Chat) => {
    const text = values.text.trim();
    if (!text.length) return;

    reset();

    let tempMessage = {
      id: TEMP_MESSAGE_ID,
      receiver_id: friend.id,
      sender_id: auth.user.id,
      text,
      created_at: getCurrentDateTime(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    post(route('chat.store', { friend: friend.id, text }), {
      preserveScroll: true,
    });
  };

  useEffect(() => {
    const channel = window.Echo.private(`chat.${auth.user.id}`);

    channel.listen('MessageSent', (e: any) => {
      const incoming = e.message;

      const isRelevant =
        (incoming.sender_id === friend.id && incoming.receiver_id === auth.user.id) ||
        (incoming.receiver_id === friend.id && incoming.sender_id === auth.user.id);

      if (!isRelevant) return;

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== TEMP_MESSAGE_ID);
        return [...filtered, incoming];
      });
    });

    return () => {
      channel.stopListening('MessageSent');
    };
  }, [friend.id, auth.user.id]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Messages" />

      <Link href={`/users/${friend.id}`}>{friend.name}</Link>

      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <span className={message.sender_id === auth.user.id ? 'text-blue-600' : 'text-gray-700'}>{message.text}</span>
          </li>
        ))}
      </ul>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 space-y-2"
      >
        <Input
          {...register('text')}
          placeholder="Type a message..."
        />
        {errors.text && <InputError message={errors.text.message} />}
        <Button type="submit">Send</Button>
      </form>
    </AppLayout>
  );
}
