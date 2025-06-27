import { AppSidebarHeader } from '@/components/app-sidebar-header';
import InputError from '@/components/input-error';
import Message from '@/components/message';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Spinner from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { getCurrentDateTime } from '@/lib/date';
import { cn } from '@/lib/utils';
import { type InertiaProps, type BreadcrumbItem, SharedData, MessageEager, ChatWork, PaginatedResponse } from '@/types';
import { MessageEvent } from '@/types/event';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, useForm as useInertiaForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const chatForm = z.object({
  text: z.string().max(1000),
});

type Chat = z.infer<typeof chatForm>;

export default function All() {
  const { friend, messagesPaginatedResponse, worksForChat, auth } = usePage<InertiaProps & SharedData>().props;

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Messages', href: '/chat' },
    { title: friend.name, href: `/chat/${friend.id}` },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [messages, setMessages] = useState<MessageEager[] | undefined>(messagesPaginatedResponse?.data);
  const [messageInEdit, setMessageInEdit] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const [scrollPage, setScrollPage] = useState(2);
  const [scrollPageUrl, setScrollPageUrl] = useState(messagesPaginatedResponse?.links[2].url);
  const [loadingNewMessages, setLoadingNewMessages] = useState(false);
  const [scrollToBottom, setScrollToBottom] = useState(true);

  const reachedFirstMessage = scrollPage + 1 !== messagesPaginatedResponse?.links.length;

  useEffect(() => {
    setScrollPageUrl(messagesPaginatedResponse?.links[scrollPage].url);
  }, [scrollPage, messagesPaginatedResponse?.links]);

  useEffect(() => {
    if (scrollToBottom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setScrollToBottom(false);
    }
  }, [messages, scrollToBottom]);

  const { post, patch, delete: destroy } = useInertiaForm();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<Chat>({
    resolver: zodResolver(chatForm),
    defaultValues: { text: '' },
  });

  const textRegister = register('text');

  const onChatSubmit = (values: Chat) => {
    const text = values.text.trim();
    if (!text.length) return;

    reset();

    if (messageInEdit) {
      setMessages((prev) => {
        const olderMessages = prev as MessageEager[];

        return olderMessages.map((m) => (m.id === messageInEdit ? { ...m, text: text, updated_at: getCurrentDateTime() } : m));
      });
      patch(route('chat.update', { message: messageInEdit, text }), {
        preserveScroll: true,
      });
    } else {
      const tempId = `temp-${Date.now()}`;
      const currentTime = getCurrentDateTime();

      let tempMessage = {
        id: tempId,
        receiver_id: friend.id,
        text,
        work: null,
        is_deleted: 0,
        created_at: currentTime,
        updated_at: currentTime,
        sender: {
          id: auth.user.id,
          name: auth.user.name,
          avatar: auth.user.avatar,
        },
      };

      setScrollToBottom(true);
      setMessages((prev) => (prev ? [...prev, tempMessage] : [tempMessage]));

      post(route('chat.store', { friend: friend.id, text, temp_id: tempId }), {
        preserveScroll: true,
        onSuccess: (page) => {
          const messages = page.props.messagesPaginatedResponse as PaginatedResponse<MessageEager>;
          setMessages(messages.data);
        },
      });
    }

    setMessageInEdit(null);
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
        const messages = prev as MessageEager[];

        const existingIndex = messages.findIndex((m) => m.id === incoming.id);
        if (existingIndex >= 0) {
          const newMessages = [...messages];
          newMessages[existingIndex] = incoming;
          return newMessages;
        }

        setScrollToBottom(true);
        return [...messages, incoming].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      });
    });

    channel.listen('MessageEdited', (e: MessageEvent) => {
      const incoming = e.message;

      const isRelevant =
        (incoming.sender.id === friend.id && incoming.receiver_id === auth.user.id) ||
        (incoming.receiver_id === friend.id && incoming.sender.id === auth.user.id);

      if (!isRelevant) return;

      setMessages((prev) => {
        const messages = prev as MessageEager[];

        return messages.map((m) => (m.id === incoming.id ? incoming : m));
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
      channel.stopListening('MessageEdited');
      channel.stopListeningForWhisper('typing');
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [friend.id, auth.user.id]);

  const onScrollSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingNewMessages(true);

    if (scrollPageUrl) {
      const response: {
        data: { messagesPaginatedResponse: PaginatedResponse<MessageEager> };
      } = await axios.get(scrollPageUrl, { params: { only_works: true } });

      setLoadingNewMessages(false);
      setMessages((prev) => {
        const messages = prev as MessageEager[];
        return [...response.data.messagesPaginatedResponse.data, ...messages];
      });
      setScrollPage(scrollPage + 1);
    }
  };

  return (
    <AppLayout
      breadcrumbs={breadcrumbs}
      excludeAppSidebarHeader
    >
      <Head title="Messages" />

      <div className="flex h-screen flex-col pb-3">
        <AppSidebarHeader breadcrumbs={breadcrumbs} />

        <div className="flex min-h-0 flex-1 flex-col">
          <div
            className="flex-1 overflow-y-auto px-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700"
            ref={scrollRef}
          >
            {messagesPaginatedResponse?.total && 20 * (scrollPage - 1) - messagesPaginatedResponse.total > 0 && (
              <p className="font-secondary text-muted-foreground mb-2 text-center text-sm md:text-base">The beginning of your conversation!</p>
            )}

            {loadingNewMessages && (
              <div className="mb-2 flex flex-1 justify-center">
                <Spinner />
              </div>
            )}

            {reachedFirstMessage && !loadingNewMessages && (
              <form onSubmit={onScrollSubmit}>
                <Button
                  type="submit"
                  className="mb-2 w-full"
                >
                  Load more messages
                </Button>
              </form>
            )}

            <ul className="space-y-3">
              {messages?.map((message) => {
                return (
                  <Message
                    message={message}
                    friend={friend}
                    onEditFocus={() => {
                      setValue('text', message.text as string);
                      setMessageInEdit(message.id);

                      inputRef.current?.focus();
                    }}
                    onDelete={() => {
                      setMessages((prev) => {
                        const messages = prev as MessageEager[];
                        return messages.map((m) => (m.id === message.id ? { ...m, is_deleted: 1 } : m));
                      });

                      destroy(
                        route('chat.destroy', {
                          message: message.id,
                        }),
                        {
                          preserveScroll: true,
                        },
                      );
                    }}
                  />
                );
              })}
            </ul>
          </div>

          <p className={cn('text-muted-foreground relative py-1.5 text-center text-xs', isFriendTyping ? 'animate-pulse opacity-100' : 'opacity-0')}>
            {friend.name} is typing...
          </p>

          <div>
            <form
              onSubmit={handleSubmit(onChatSubmit)}
              className="flex flex-col-reverse gap-2 md:flex-row"
            >
              <Popover
                open={open}
                onOpenChange={setOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="flex-1 justify-between md:flex-0"
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
                              const currentTime = getCurrentDateTime();

                              const tempMessage = {
                                id: `temp-${Date.now()}`,
                                receiver_id: friend.id,
                                text: null,
                                work,
                                is_deleted: 0,
                                created_at: currentTime,
                                updated_at: currentTime,
                                sender: {
                                  id: auth.user.id,
                                  name: auth.user.name,
                                  avatar: auth.user.avatar,
                                },
                              };

                              setScrollToBottom(true);
                              setMessages((prev) => (prev ? [...prev, tempMessage] : [tempMessage]));

                              setOpen(false);
                              post(route('chat.store', { friend: friend.id, work_id: work.id }), {
                                preserveScroll: true,
                                onSuccess: (page) => {
                                  const messages = page.props.messagesPaginatedResponse as PaginatedResponse<MessageEager>;

                                  setMessages(messages.data);
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

              <div className="flex flex-1 gap-x-2">
                <Input
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
                  {...textRegister}
                  ref={(input) => {
                    textRegister.ref(input);
                    inputRef.current = input;
                  }}
                  className="flex-1"
                />

                {errors.text && <InputError message={errors.text.message} />}
                <Button type="submit">Send</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
