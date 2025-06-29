import AvatarPicture from '@/components/avatar-picture';
import { FavoriteForm } from '@/components/favorite-form';
import { Flag } from '@/components/flag';
import { ReadOnlyInputTags } from '@/components/input-tags';
import { MultiSelect } from '@/components/multi-select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/layouts/app-layout';
import { getRelativeTime } from '@/lib/date';
import { useResponsiveDialog } from '@/lib/responsive';
import { shortenString } from '@/lib/shorten';
import { cn } from '@/lib/utils';
import { InertiaProps, SharedData, type BreadcrumbItem } from '@/types';
import { languages } from '@/types/schemas/work';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link, router, useForm as useInertiaForm, usePage } from '@inertiajs/react';
import { Dot, ExternalLink, LibraryBig } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const collectionSchema = z.object({
  selectedCollections: z.string().array(),
});

type CollectionForm = z.infer<typeof collectionSchema>;

export default function Work() {
  const { auth, work, workCreatorProfile, favorited, collections, breadcrumbs: bc, areFriends } = usePage<InertiaProps & SharedData>().props;

  const { control, handleSubmit } = useForm<CollectionForm>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      selectedCollections: work.collections?.map((collection) => collection.id) ?? [],
    },
  });
  const { put, processing } = useInertiaForm();

  const isOwnWork = work.user_id === auth.user.id;

  const isMobile = useIsMobile();
  let breadcrumbs: BreadcrumbItem[] = isMobile
    ? [...bc, { title: 'Work', href: '' }]
    : [
        ...bc,
        {
          title: work.title,
          href: `/works/${work.id}`,
        },
      ];

  const { rd, open, setOpen } = useResponsiveDialog();

  function onSubmit(data: CollectionForm) {
    put(
      route('collection.entry.update.single', {
        work: work.id,
        collection_ids: data.selectedCollections,
      }),
      {
        onFinish: () => setOpen(false),
        preserveScroll: true,
      },
    );
  }

  const image = work.image || work.image_self || undefined;
  const authors = work.author?.replaceAll(',', ', ');

  const ol = work.language_original as keyof typeof languages;
  const OriginalLanguageFlag = ol ? (
    <Flag
      name={languages[ol]}
      code={ol}
      shadow
      size="lg"
    />
  ) : null;

  const ul = work.language_translated as keyof typeof languages;
  const TranslatedLanguageFlag = ul ? (
    <Flag
      name={languages[ul]}
      code={ul}
      shadow
      size="lg"
    />
  ) : null;

  let badgeVariant: 'default' | 'outline' | 'secondary' = 'outline';
  if (work.status_reading === 'reading') {
    badgeVariant = 'default';
  } else if (work.status_reading === 'completed') {
    badgeVariant = 'secondary';
  }

  let PublicationStatusDotColor = 'text-destructive';
  switch (work.status_publication) {
    case 'ongoing':
      PublicationStatusDotColor = 'text-green-400';
      break;
    case 'completed':
      PublicationStatusDotColor = 'text-primary';
      break;
    case 'unknown':
      PublicationStatusDotColor = 'text-secondary';
      break;
  }

  const favoriteAndCollection = (
    <div className="flex gap-x-1">
      {!isOwnWork && (
        <FavoriteForm
          favorited={favorited}
          workId={work.id}
        />
      )}

      {(favorited || isOwnWork) && (
        <rd.Wrapper
          open={open}
          onOpenChange={setOpen}
        >
          <rd.Trigger asChild>
            <div>
              <Button
                variant="outline"
                className="not-sr-only"
              >
                <LibraryBig />
              </Button>
              <Button
                variant="outline"
                className="sr-only"
              >
                Collections
              </Button>
            </div>
          </rd.Trigger>

          <rd.Content>
            <rd.Header>
              <rd.Title>Edit work's collections</rd.Title>
              <rd.Description>Update which collections belongs to your work.</rd.Description>
            </rd.Header>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex h-full w-full flex-col justify-between"
            >
              <Controller
                name="selectedCollections"
                control={control}
                defaultValue={work.collections?.map((collection) => collection.id)}
                render={({ field }) => (
                  <div className="mx-4">
                    <MultiSelect
                      options={collections.map((collection) => ({
                        value: collection.id,
                        label: collection.name,
                      }))}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Select collections..."
                      emptyText="No collections found."
                    />

                    {field.value && (
                      <ul className="my-2 max-h-60 space-y-1 overflow-scroll">
                        {field.value.map((id) => {
                          const collection = collections.find((c) => c.id === id);
                          if (collection)
                            return (
                              <li
                                key={id}
                                className="bg-accent text-accent-foreground rounded border px-2 py-1 text-xs"
                              >
                                {collection.name}
                              </li>
                            );
                        })}
                      </ul>
                    )}
                  </div>
                )}
              />
              <rd.Footer>
                <Button
                  type="submit"
                  disabled={processing}
                >
                  Update work's collections
                </Button>
                <rd.Close asChild>
                  <Button variant="outline">Close</Button>
                </rd.Close>
              </rd.Footer>
            </form>
          </rd.Content>
        </rd.Wrapper>
      )}
    </div>
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={work.title} />

      {!isOwnWork && (
        <Link
          href={route('users.create', { user: workCreatorProfile.id })}
          className="bg-card hover:border-primary mb-1 flex items-center gap-x-2 rounded border px-2 py-1"
        >
          <AvatarPicture
            is_friend={areFriends ? 1 : 0}
            avatar={workCreatorProfile.avatar}
            name={workCreatorProfile.name}
            className="h-10 w-10"
          />
          <div>
            <p className="font-secondary">{workCreatorProfile.name}</p>
            <p className="text-muted-foreground text-sm">{shortenString(workCreatorProfile.introduction, 50)}</p>
          </div>
        </Link>
      )}

      {work.user_id === auth.user.id && (
        <Badge
          variant={badgeVariant}
          className="w-full font-mono capitalize"
        >
          {work.status_reading}
        </Badge>
      )}

      <div className="border-border/70 my-6 flex h-full flex-col items-center justify-center gap-y-2 border-t border-b py-4">
        {favoriteAndCollection}

        <div className="flex flex-col items-center">
          <h2 className="font-secondary text-center text-lg/5">
            {work.title} {work.publication_year && <span>({work.publication_year})</span>}
          </h2>

          {(work.author || work.status_publication) && (
            <div className="-mb-2 flex items-center font-light tracking-tight">
              {work.author && <p>{authors}</p>}

              {work.status_publication && (
                <>
                  <Dot className={PublicationStatusDotColor + ' -m-1'} />
                  <p className="font-secondary text-muted-foreground text-lg capitalize">{work.status_publication}</p>
                </>
              )}
            </div>
          )}
        </div>

        <ReadOnlyInputTags value={work.tags ?? '<Tags not provided>'} />

        <div className="max-w-250">
          <div className="relative float-left mt-1 mr-4 flex flex-shrink-0 flex-col">
            <div className="absolute translate-x-1 translate-y-1">{OriginalLanguageFlag}</div>
            {image ? (
              <img
                src={image}
                className={cn('border-secondary w-min rounded border object-contain', isMobile ? 'h-60' : 'h-100')}
              />
            ) : (
              <div className={cn('border-border flex items-center justify-center rounded border', isMobile ? 'h-60 w-42' : 'h-100 w-70')}>
                <p className="text-muted-foreground text-center font-mono text-sm">No cover provided...</p>
              </div>
            )}
            <div className={cn('absolute', isMobile ? 'translate-x-31.5 translate-y-52.5' : 'translate-x-59 translate-y-92')}>
              {TranslatedLanguageFlag}
            </div>
          </div>

          {work.description ? (
            <span className="text-sm">{work.description}</span>
          ) : (
            <span className="text-muted-foreground ml-2 text-center font-mono text-xs tracking-normal">No description provided...</span>
          )}
        </div>
      </div>

      <div className="mb-2 space-y-1">
        <div>
          <h3 className="font-secondary text-lg">Metadata</h3>
          <p className="text-sm">First created {getRelativeTime(work.created_at)}</p>
          <p className="text-sm">Updated {getRelativeTime(work.updated_at)}</p>
        </div>

        <div>
          <h3 className="font-secondary text-lg">Collections</h3>
          <p className="-mt-1">
            In <span className="font-mono">({work.collections ? work.collections.length : 0})</span>{' '}
            <HoverCard>
              <HoverCardTrigger>
                <span className={cn('hover:underline', isMobile ? '' : 'text-secondary')}>{isMobile ? 'collections' : '<collections>'}</span>
              </HoverCardTrigger>
              <HoverCardContent className="max-h-96 w-96 overflow-y-scroll">
                <ul className="flex flex-col gap-y-1">
                  {work.collections?.map((collection) => (
                    <li
                      key={collection.id}
                      className="bg-accent text-accent-foreground rounded border px-2 py-1 text-xs"
                    >
                      {collection.name}
                    </li>
                  ))}
                </ul>
              </HoverCardContent>
            </HoverCard>
            {isMobile ? (
              work.collections?.length ? (
                <span className="ml-1 tracking-tight">({work.collections.map((collection) => collection.name).join(', ')})</span>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-x-2">
            <h3 className="font-secondary text-lg">Links</h3>
            <ExternalLink className="h-5 w-5 opacity-70" />
          </div>
          {work.links?.length ? (
            <ul className="flex flex-col gap-y-1">
              {work.links.split('|').map((link: string) => (
                <li
                  key={link}
                  className="flex"
                >
                  <a
                    className="bg-background hover:bg-accent hover:text-accent-foreground dark:hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 flex w-full items-center gap-x-1 rounded border px-2 py-1 text-xs shadow-xs"
                    href={link}
                    target="_blank"
                  >
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${link}`}
                      className="rounded-full"
                    />
                    <p>{link}</p>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground font-mono text-sm">No links provided...</p>
          )}
        </div>
      </div>

      {isOwnWork && (
        <div className="mt-auto mb-2.5 flex w-full gap-x-1">
          <Link
            href={`/works/${work.id}/edit`}
            className="flex-1"
          >
            <Button
              variant="secondary"
              className="w-full"
              size="sm"
            >
              Edit
            </Button>
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="flex-1 dark:hover:opacity-80"
                size="sm"
              >
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete "{work.title}"?</DialogTitle>
                <DialogDescription>Once your work entry is deleted, all of its data will also be permanently deleted.</DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <Button
                  variant="destructive"
                  type="button"
                  onClick={() => router.delete(route('work.destroy', work.id))}
                >
                  Delete permanently
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </AppLayout>
  );
}
