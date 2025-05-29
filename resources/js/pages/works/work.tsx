import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import useDebounce from '@/hooks/use-debounce';
import AppLayout from '@/layouts/app-layout';
import { InertiaProps, SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Work() {
  const { post, delete: destroy, processing } = useForm();
  const { auth, work, profile, favorited } = usePage<InertiaProps & SharedData>().props;
  const isOwnWork = work.user_id === auth.user.id;

  const [favorite, setFavorite] = useState(favorited);
  const favoriteDebounced = useDebounce(favorite, 300);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (favoriteDebounced === true) post(route('favorite.store', work.id));
    if (favoriteDebounced === false) destroy(route('favorite.destroy', work.id));
  }, [favoriteDebounced, post, destroy, work.id]);

  const breadcrumbs: BreadcrumbItem[] =
    isOwnWork || favorited
      ? [
          {
            title: 'Saved works',
            href: '/works',
          },
          {
            title: work.title,
            href: `/works/${work.id}`,
          },
        ]
      : [
          {
            title: 'Members',
            href: '/users',
          },
          {
            title: profile.name,
            href: `/users/${work.user_id}`,
          },
          {
            title: work.title,
            href: `/works/${work.id}`,
          },
        ];

  const favoriteWork = (
    <button
      onClick={() => setFavorite(!favorite)}
      className="bg-secondary hover:bg-secondary/90 w-min rounded-md p-1 shadow-xs hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50"
      disabled={processing}
    >
      <Star
        className={`absolute transition-opacity ${favorite ? 'opacity-100' : 'opacity-0'}`}
        fill="#ffff00"
        stroke="#ffff00"
        size={35}
        strokeWidth={1}
      />
      <Star
        className={`transition-opacity ${favorite ? 'opacity-0' : 'opacity-100'}`}
        stroke="#ffffff"
        size={35}
        strokeWidth={1}
        strokeOpacity={favorite ? 0.9 : 0.6}
      />
    </button>
  );

  const editWork = <Link href={`/works/${work.id}/edit`}>Edit</Link>;

  const deleteWork = (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete "{work.title}"?</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="destructive"
            type="button"
            onClick={() => router.delete(route('work.destroy', work.id))}
          >
            Burn permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={work.title} />

      {!isOwnWork && <h1 className="max-w-96 overflow-scroll">{JSON.stringify(profile)}</h1>}
      <p className="max-w-96 overflow-scroll">{JSON.stringify(work)}</p>

      {!isOwnWork && favoriteWork}
      {isOwnWork && editWork}
      {isOwnWork && deleteWork}
    </AppLayout>
  );
}
