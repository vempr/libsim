import { useIsMobile } from '@/hooks/use-mobile';
import { shortenString } from '@/lib/shorten';
import { languages, type Work } from '@/types/schemas/work';
import { Link } from '@inertiajs/react';
import { Dot } from 'lucide-react';

import { Flag } from './flag';
import { ReadOnlyInputTags } from './input-tags';
import { Badge } from './ui/badge';

export default function WorkCard({ work }: { work: Work }) {
  const isMobile = useIsMobile();
  const image = work.image || work.image_self || undefined;

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

  const title = isMobile ? shortenString(work.title, 30) : shortenString(work.title, 60);
  const authors = work.author ? shortenString(work.author.replaceAll(',', ', '), 50) : null;

  if (isMobile) {
    return (
      <li>
        <Link
          href={`/works/${work.id}`}
          className="bg-card flex flex-col gap-y-2 rounded border p-3"
        >
          <div className="flex flex-1">
            <div className="relative float-left flex flex-col">
              <div className="absolute translate-x-1 translate-y-1">{OriginalLanguageFlag}</div>
              {image ? (
                <img
                  src={image}
                  className="border-secondary float-left mr-3 h-50 w-min rounded border object-contain"
                />
              ) : (
                <div className="border-border float-left mr-3 flex h-50 w-35 items-center justify-center rounded border">
                  <p className="text-muted-foreground text-center font-mono text-sm">No cover provided...</p>
                </div>
              )}
              <div className="absolute translate-x-24 translate-y-42">{TranslatedLanguageFlag}</div>
            </div>

            <div className="flex flex-1 flex-col justify-between gap-y-2">
              <div>
                <Badge
                  variant={badgeVariant}
                  className="w-full font-mono capitalize"
                >
                  {work.status_reading}
                </Badge>
                <h2 className="font-secondary text-lg">
                  {title} {work.publication_year && <span>({work.publication_year})</span>}
                </h2>
              </div>

              {(work.author || work.status_publication) && (
                <div className="flex flex-1 flex-col justify-end font-light tracking-tight">
                  {work.author && <p>{authors}</p>}

                  {work.status_publication && (
                    <div className="-mt-1 -ml-1 flex items-center">
                      <Dot className={PublicationStatusDotColor + ' -m-1'} />
                      <p className="font-secondary text-muted-foreground capitalize">{work.status_publication}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <ReadOnlyInputTags value={work.tags ?? '<Tags not provided>'} />

          <p className="max-h-52 overflow-y-auto">
            {work.description ?? <span className="text-muted-foreground font-mono tracking-normal">(No description provided...)</span>}
          </p>
        </Link>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={`/works/${work.id}`}
        className="bg-card hover:border-primary flex rounded border p-2"
      >
        <div className="relative flex flex-col">
          <div className="absolute translate-x-1 translate-y-1">{OriginalLanguageFlag}</div>
          {image ? (
            <img
              src={image}
              className="border-secondary float-left mr-3 h-72 w-min rounded border object-contain"
            />
          ) : (
            <div className="border-border float-left mr-3 flex h-72 w-50.5 items-center justify-center rounded border">
              <p className="text-muted-foreground text-center font-mono text-sm">No cover provided...</p>
            </div>
          )}
          <div className="absolute translate-x-39.5 translate-y-64">{TranslatedLanguageFlag}</div>
        </div>

        <div className="flex flex-1 flex-col gap-y-0.5">
          <div className="">
            <Badge
              variant={badgeVariant}
              className="float-right font-mono capitalize"
            >
              {work.status_reading}
            </Badge>
            <h2 className="font-secondary text-lg">
              {title} {work.publication_year && <span>({work.publication_year})</span>}
            </h2>
          </div>

          {(work.author || work.status_publication) && (
            <div className="-mb-2 flex -translate-y-2 items-center font-light tracking-tight">
              {work.author && <p>{authors}</p>}

              {work.status_publication && (
                <>
                  <Dot className={PublicationStatusDotColor + ' -m-1'} />
                  <p className="font-secondary text-muted-foreground text-lg capitalize">{work.status_publication}</p>
                </>
              )}
            </div>
          )}

          <ReadOnlyInputTags value={work.tags ?? '<Tags not provided>'} />

          <p className="my-0.5 max-h-52 overflow-y-auto">
            {work.description ?? <span className="text-muted-foreground font-mono tracking-normal">(No description provided...)</span>}
          </p>
        </div>
      </Link>
    </li>
  );
}
