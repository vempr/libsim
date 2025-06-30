import AppLogo from '@/components/app-logo';
import { Message } from '@/components/display';
import { Button } from '@/components/ui/button';
import { MessageEager, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const me = {
  id: '1',
  name: 'vempr',
  avatar: 'https://res.cloudinary.com/djpz0iokm/image/upload/v1750423572/mybiqnoytyb6rlbps7xk.png',
};

const friend = {
  id: '2',
  name: 'halozy',
  avatar: 'https://res.cloudinary.com/djpz0iokm/image/upload/v1750585523/qbdohinema3f2pupyfe9.png',
};

const messages: MessageEager[] = [
  {
    id: '1',
    receiver_id: '1',
    text: 'hi friendo! wanna see this manga?',
    sender: friend,
    is_deleted: 0,
    work: null,
    created_at: '1 day ago',
    updated_at: '',
  },
  {
    id: '2',
    receiver_id: '2',
    text: 'sure, why not',
    sender: me,
    is_deleted: 0,
    work: null,
    created_at: '1 day ago',
    updated_at: '',
  },
  {
    id: '3',
    receiver_id: '1',
    text: null,
    sender: friend,
    is_deleted: 0,
    work: {
      id: 'a',
      title: 'Henkyou Mob Kizoku no Uchi ni Totsuidekita Akuyaku Reijou ga, Mechakucha Dekiru Yoi Yome Nanda ga?',
      description:
        'Ragna, the heir to a frontier noble family, is a reincarnated former Japanese citizen who realizes that the world he now lives in is the setting of an otome game. Dreaming of a carefree life as an adventurer, his plans are derailed when a war takes his family, forcing him to take on the responsibilities of managing his family’s lands. Struggling with the unfamiliar duties of a lord, his already chaotic life takes another turn when an unexpected engagement to a noblewoman from a higher-ranking family is arranged. To his surprise, the bride-to-be is Alicia, the "villainess" of the otome game\'s story — a character destined for heartbreak, a demonic pact, and ultimate destruction. Now sharing his life with someone fated for tragedy, Ragna is swept up in the wheels of fate. Can he rewrite the predetermined outcomes of this world and secure a peaceful life for himself and Alicia?',
      image_self: null,
      image: 'https://res.cloudinary.com/djpz0iokm/image/upload/v1751206155/ejv9gjofel4awxeby6lt.png',
    },
    created_at: '1 day ago',
    updated_at: '',
  },
  {
    id: '4',
    receiver_id: '2',
    text: 'hm... the reviews from your linked websites seem mostly positive, and i can read it online... might have to check it out!',
    sender: me,
    is_deleted: 0,
    work: null,
    created_at: '22 hours ago',
    updated_at: '',
  },
  {
    id: '5',
    receiver_id: '1',
    text: 'awesome! lmk what you think about it',
    sender: friend,
    is_deleted: 0,
    work: null,
    created_at: '22 hours ago',
    updated_at: '',
  },
  {
    id: '6',
    receiver_id: '2',
    text: 'holy... that was an awesome read. thanks',
    sender: me,
    is_deleted: 0,
    work: null,
    created_at: '18 hours ago',
    updated_at: '',
  },
  {
    id: '7',
    receiver_id: '1',
    text: 'glad you enjoyed it :D',
    sender: friend,
    is_deleted: 0,
    work: null,
    created_at: '18 hours ago',
    updated_at: '',
  },
  {
    id: '8',
    receiver_id: '2',
    text: "i never really liked this genre but now i think i'm gonna have to read some more",
    sender: me,
    is_deleted: 0,
    work: null,
    created_at: '13 hours ago',
    updated_at: '',
  },
  {
    id: '9',
    receiver_id: '1',
    text: "that's awesone! just tell me if you need any more recommendations",
    sender: friend,
    is_deleted: 0,
    work: null,
    created_at: '13 hours ago',
    updated_at: '',
  },
  {
    id: '10',
    receiver_id: '2',
    text: 'mhm :)',
    sender: me,
    is_deleted: 0,
    work: null,
    created_at: '13 hours ago',
    updated_at: '',
  },
];

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;

  return (
    <>
      <Head title="Index" />
      <div className="bg-background text-foreground flex min-h-screen flex-col items-center p-6 lg:justify-center lg:p-8">
        <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden md:max-w-4xl">
          <nav className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-x-2">
              <AppLogo />
            </div>
            {auth.user ? (
              <Link href={route('dashboard')}>
                <Button variant="outline">Dashboard</Button>
              </Link>
            ) : (
              <div className="space-x-2">
                <Link href={route('login')}>
                  <Button variant="secondary">Log in</Button>
                </Link>
                <Link href={route('register')}>
                  <Button variant="outline">Register</Button>
                </Link>
              </div>
            )}
          </nav>
        </header>
        <div className="flex w-full items-center justify-center lg:grow">
          <main className="w-full max-w-[335px] md:max-w-4xl">
            <ul className="my-6 flex flex-col gap-y-2">
              {messages.map((message) => (
                <Message
                  message={message}
                  key={message.id}
                />
              ))}
            </ul>
          </main>
        </div>

        <footer className="max-w-[335px] pt-6">
          <nav className="flex w-full items-center justify-between gap-2">
            {auth.user ? (
              <Link
                href={route('dashboard')}
                className="w-full"
              >
                <Button
                  variant="secondary"
                  className="font-secondary w-full"
                >
                  Head over to the Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex w-full gap-x-2">
                <Link
                  href={route('login')}
                  className="w-full"
                >
                  <Button className="font-secondary w-full flex-1">Log in</Button>
                </Link>
                <Link
                  href={route('register')}
                  className="w-full"
                >
                  <Button
                    variant="ghost"
                    className="font-secondary w-full flex-1"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </footer>

        <div className="hidden h-6 lg:block"></div>
      </div>
    </>
  );
}
