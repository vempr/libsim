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

  const [isFriendTyping, setIsFriendTyping] = useState(false);
  let typingTimeout: NodeJS.Timeout;

  const { post, delete: destroy } = useInertiaForm();
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

    const tempId = `temp-${Date.now()}`;

    let tempMessage = {
      id: tempId,
      receiver_id: friend.id,
      sender_id: auth.user.id,
      text,
      is_deleted: false,
      created_at: getCurrentDateTime(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    post(route('chat.store', { friend: friend.id, text }), {
      preserveScroll: true,
      onSuccess: (page) => {
        const messages = page.props.messages as Message[];
        setMessages(messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()));
      },
    });
  };

  useEffect(() => {
    const channel = window.Echo.private(`chat.${auth.user.id}`);

    channel.listen('MessageSent', (e: any) => {
      const incoming = e.message as Message;

      const isRelevant =
        (incoming.sender_id === friend.id && incoming.receiver_id === auth.user.id) ||
        (incoming.receiver_id === friend.id && incoming.sender_id === auth.user.id);

      if (!isRelevant) return;

      setMessages((prev) => {
        const existingIndex = prev.findIndex((m) => m.id === incoming.id);

        if (existingIndex >= 0) {
          const newMessages = [...prev];
          newMessages[existingIndex] = incoming;

          return newMessages;
        } else {
          return [...prev, incoming].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        }
      });
    });

    channel.listenForWhisper('typing', (e: any) => {
      if (e.user_id === friend.id) {
        setIsFriendTyping(true);

        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }

        typingTimeout = setTimeout(() => {
          setIsFriendTyping(false);
        }, 1000);
      }
    });

    return () => {
      channel.stopListening('MessageSent');
      channel.stopListeningForWhisper('typing');
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [friend.id, auth.user.id]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Messages" />

      <Link href={`/users/${friend.id}`}>{friend.name}</Link>

      <ul className="space-y-2">
        {messages.map((message) => (
          <li key={`${message.id}-${new Date(message.created_at).getTime()}`}>
            {message.is_deleted ? (
              <span className={message.sender_id === auth.user.id ? 'text-red-500' : 'text-red-800'}>[deleted] (ID: {message.id})</span>
            ) : (
              <span className={message.sender_id === auth.user.id ? 'text-blue-600' : 'text-gray-700'}>
                {message.text} (ID: {message.id})
              </span>
            )}

            {message.sender_id === auth.user.id && !message.is_deleted && (
              <Button
                variant="destructive"
                onClick={() => {
                  setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, is_deleted: true } : m)));

                  destroy(
                    route('chat.destroy', {
                      message: message.id,
                    }),
                    {
                      preserveScroll: true,
                    },
                  );
                }}
              >
                delete
              </Button>
            )}
          </li>
        ))}
      </ul>

      {isFriendTyping && <p className="text-sm text-gray-500">{friend.name} is typing...</p>}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 space-y-2"
      >
        <Input
          {...register('text')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(onSubmit);
            } else {
              window.Echo.private(`chat.${friend.id}`).whisper('typing', {
                user_id: auth.user.id,
              });
            }
          }}
          placeholder="Type a message..."
        />
        {errors.text && <InputError message={errors.text.message} />}
        <Button type="submit">Send</Button>
      </form>
    </AppLayout>
  );
}
