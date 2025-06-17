import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Spinner from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { type InertiaProps, type BreadcrumbItem, SharedData, MessageEager, ChatWork, PaginatedResponse } from '@/types';
import { MessageEvent } from '@/types/event';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link, useForm as useInertiaForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
  const { friend, messagesPaginatedResponse, worksForChat, auth } = usePage<InertiaProps & SharedData>().props;
  const [messages, setMessages] = useState<MessageEager[]>(messagesPaginatedResponse.data);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Messages', href: '/chat' },
    { title: friend.name, href: `/chat/${friend.id}` },
  ];

  const [open, setOpen] = useState(false);
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [scrollPage, setScrollPage] = useState(2);
  const [scrollPageUrl, setScrollPageUrl] = useState(messagesPaginatedResponse.links[2].url);
  const [loadingNewMessages, setLoadingNewMessages] = useState(false);

  useEffect(() => {
    setScrollPageUrl(messagesPaginatedResponse.links[scrollPage].url);
  }, [scrollPage]);

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

  const onChatSubmit = (values: Chat) => {
    const text = values.text.trim();
    if (!text.length) return;

    reset();

    const tempId = `temp-${Date.now()}`;

    let tempMessage = {
      id: tempId,
      receiver_id: friend.id,
      text,
      work: null,
      is_deleted: false,
      created_at: getCurrentDateTime(),
      sender: {
        id: auth.user.id,
        name: auth.user.name,
        avatar: auth.user.avatar,
      },
    };

    setMessages((prev) => [...prev, tempMessage]);

    post(route('chat.store', { friend: friend.id, text }), {
      preserveScroll: true,
      onSuccess: (page) => {
        console.log(page);
        const messages = page.props.messages as MessageEager[];
        setMessages(messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()));
      },
    });
  };

  useEffect(() => {
    const channel = window.Echo.private(`chat.${auth.user.id}`);

    channel.listen('MessageSent', (e: MessageEvent) => {
      const incoming = e.message;

      const isRelevant =
        (incoming.sender.id === friend.id && incoming.receiver_id === auth.user.id) ||
        (incoming.receiver_id === friend.id && incoming.sender.id === auth.user.id);

      if (!isRelevant) return;

      setMessages((prev) => {
        const existingIndex = prev.findIndex((m) => m.id === incoming.id);
        if (existingIndex >= 0) {
          const newMessages = [...prev];
          newMessages[existingIndex] = incoming;
          return newMessages;
        }
        return [...prev, incoming].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      });
    });

    channel.listenForWhisper('typing', (e: { user_id: string }) => {
      if (e.user_id === friend.id) {
        setIsFriendTyping(true);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsFriendTyping(false);
        }, 1000);
      }
    });

    return () => {
      channel.stopListening('MessageSent');
      channel.stopListeningForWhisper('typing');
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [friend.id, auth.user.id]);

  const onScrollSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingNewMessages(true);

    if (scrollPageUrl !== null) {
      const response: {
        data: { messagesPaginatedResponse: PaginatedResponse<MessageEager> };
      } = await axios.get(scrollPageUrl, { params: { only_works: true } });

      setLoadingNewMessages(false);
      setMessages((prev) => [...response.data.messagesPaginatedResponse.data, ...prev]);
      setScrollPage(scrollPage + 1);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Messages" />

      {loadingNewMessages && <Spinner />}
      {scrollPage + 1 !== messagesPaginatedResponse.links.length && !loadingNewMessages && (
        <form onSubmit={onScrollSubmit}>
          <Button type="submit">Load more messages</Button>
        </form>
      )}

      <ul className="space-y-2">
        {messages.map((message) => (
          <li key={`${message.id}-${new Date(message.created_at).getTime()}`}>
            {message.work?.id ? (
              message.is_deleted ? (
                <span className={message.sender.id === auth.user.id ? 'text-red-500' : 'text-red-800'}>[deleted] (ID: {message.id})</span>
              ) : (
                <Link
                  href={`/works/${message.work.id}?chat=${friend.id}`}
                  className={message.sender.id === auth.user.id ? 'text-blue-600' : 'text-gray-700'}
                >
                  {JSON.stringify(message)}
                </Link>
              )
            ) : message.is_deleted ? (
              <span className={message.sender.id === auth.user.id ? 'text-red-500' : 'text-red-800'}>[deleted] (ID: {message.id})</span>
            ) : (
              <span className={message.sender.id === auth.user.id ? 'text-blue-600' : 'text-gray-700'}>{JSON.stringify(message)}</span>
            )}

            {message.sender.id === auth.user.id && !message.is_deleted && (
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
        onSubmit={handleSubmit(onChatSubmit)}
        className="mt-4 space-y-2"
      >
        <Input
          {...register('text')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(onChatSubmit);
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

      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            Share personal work...
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder="Search work..."
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No work found.</CommandEmpty>
              <CommandGroup>
                {worksForChat.map((work) => (
                  <CommandItem
                    key={work.id}
                    value={work.title}
                    onSelect={(workTitle) => {
                      const work = worksForChat.find((w) => w.title === workTitle) as ChatWork;

                      const tempMessage = {
                        id: `temp-${Date.now()}`,
                        receiver_id: friend.id,
                        text: null,
                        work,
                        is_deleted: false,
                        created_at: getCurrentDateTime(),
                        sender: {
                          id: auth.user.id,
                          name: auth.user.name,
                          avatar: auth.user.avatar,
                        },
                      };

                      setMessages((prev) => [...prev, tempMessage]);

                      setOpen(false);
                      post(route('chat.store', { friend: friend.id, work_id: work.id }), {
                        preserveScroll: true,
                        onSuccess: (page) => {
                          const messages = page.props.messages as MessageEager[];
                          setMessages(messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()));
                        },
                      });
                    }}
                  >
                    {work.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </AppLayout>
  );
}
