import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { shortenString } from '@/lib/shorten';
import { cn } from '@/lib/utils';
import { XIcon } from 'lucide-react';
import * as React from 'react';

type InputTagsProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  lowercase?: boolean;
  uppercase?: boolean;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  displayAsList?: boolean;
  pipeAsSeperator?: boolean;
  children?: React.ReactNode;
  shorten?: boolean;
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
  ({ className, value = '', lowercase, uppercase, onChange, displayAsList = true, children, pipeAsSeperator, shorten = false }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState('');

    const separator = pipeAsSeperator ? '|' : ',';

    const tags = React.useMemo(
      () =>
        value
          .split(separator)
          .map((tag) => {
            tag = tag.trim();
            if (tag === '') return '';
            if (uppercase && tag[0]) {
              return tag[0].toUpperCase() + tag.slice(1);
            }
            if (lowercase) {
              return tag.toLowerCase();
            }
            return tag;
          })
          .filter((tag) => tag !== ''),
      [value, lowercase, uppercase, separator],
    );

    const updateTags = React.useCallback(
      (newTags: string[]) => {
        const uniqueTags = Array.from(new Set(newTags));
        const newValue = uniqueTags.join(separator);

        const syntheticEvent = {
          target: {
            value: newValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(syntheticEvent);
      },
      [onChange, separator],
    );

    const addPendingDataPoint = React.useCallback(() => {
      if (pendingDataPoint.trim() !== '') {
        let newTag;
        const trimmedPendingDataPoint = pendingDataPoint.trim();

        if (uppercase) {
          newTag = trimmedPendingDataPoint[0].toUpperCase() + trimmedPendingDataPoint.slice(1);
        } else if (lowercase) {
          newTag = trimmedPendingDataPoint.toLowerCase();
        } else {
          newTag = trimmedPendingDataPoint;
        }

        updateTags([...tags, newTag]);
        setPendingDataPoint('');
      }
    }, [pendingDataPoint, tags, lowercase, uppercase, updateTags]);

    React.useEffect(() => {
      if (pendingDataPoint.includes(separator)) {
        const newTags = [
          ...tags,
          ...pendingDataPoint
            .split(separator)
            .map((chunk) => {
              const trimmedChunk = chunk.trim();
              if (trimmedChunk === '') return '';
              if (uppercase && trimmedChunk[0]) {
                return trimmedChunk[0].toUpperCase() + trimmedChunk.slice(1);
              }
              if (lowercase) {
                return trimmedChunk.toLowerCase();
              }
              return trimmedChunk;
            })
            .filter(Boolean),
        ];
        updateTags(newTags);
        setPendingDataPoint('');
      }
    }, [pendingDataPoint, tags, lowercase, uppercase, separator, updateTags]);

    const handleRemoveTag = (tagToRemove: string) => {
      updateTags(tags.filter((t) => t !== tagToRemove));
    };

    return (
      <>
        <div
          className={cn(
            'flex h-9 w-full min-w-0 gap-2 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] duration-75 outline-none md:text-sm',
            'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
            'focus-within:border-ring/50 focus-within:ring-ring/50 focus-within:ring-[1px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            className,
          )}
        >
          <input
            className="flex-1 bg-transparent outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
            value={pendingDataPoint}
            onChange={(e) => setPendingDataPoint(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === separator) {
                e.preventDefault();
                addPendingDataPoint();
              } else if (e.key === 'Backspace' && pendingDataPoint.length === 0 && tags.length > 0) {
                e.preventDefault();
                updateTags(tags.slice(0, -1));
              }
            }}
          />
        </div>

        <input
          type="hidden"
          ref={ref}
          value={value}
          readOnly
        />

        {children}

        {displayAsList && tags.length > 0 && (
          <div className="mb-2 max-h-24 space-y-1 space-x-1.5 overflow-x-hidden overflow-y-scroll">
            {tags.map((item, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="dark:bg-sidebar-accent h-6"
              >
                {shorten ? shortenString(item) : item}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-3 w-3"
                  onClick={() => handleRemoveTag(item)}
                  type="button"
                >
                  <XIcon className="w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </>
    );
  },
);

type ReadOnlyInputTagsProps = {
  className?: string;
  value: string;
  pipeAsSeperator?: boolean;
  shorten?: boolean;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
};

const ReadOnlyInputTags = React.forwardRef<HTMLDivElement, ReadOnlyInputTagsProps>(
  ({ className, value = '', pipeAsSeperator, shorten = false, variant = 'secondary' }, ref) => {
    const separator = pipeAsSeperator ? '|' : ',';

    const tags = React.useMemo(
      () =>
        value
          .split(separator)
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ''),
      [value, separator],
    );

    if (tags.length === 0) return null;

    return (
      <div
        ref={ref}
        className={cn('max-h-24 space-y-1 space-x-1 overflow-x-hidden overflow-y-scroll', className)}
      >
        {tags.map((item, index) => (
          <Badge
            key={index}
            variant={variant}
            className="dark:bg-sidebar-accent h-6"
          >
            {shorten ? shortenString(item) : item}
          </Badge>
        ))}
      </div>
    );
  },
);

InputTags.displayName = 'InputTags';
ReadOnlyInputTags.displayName = 'ReadOnlyInputTags';

export { InputTags, ReadOnlyInputTags };
