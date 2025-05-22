import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { XIcon } from 'lucide-react';
import * as React from 'react';

type InputTagsProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
  lowercase?: boolean;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  displayAsList?: boolean;
  pipeAsSeperator?: boolean;
  children?: React.ReactNode;
};

const InputTags = React.forwardRef<HTMLInputElement, InputTagsProps>(
  ({ className, value = '', lowercase, onChange, displayAsList, children, pipeAsSeperator }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState('');

    const separator = pipeAsSeperator ? '|' : ',';

    const tags = React.useMemo(
      () =>
        value
          .split(separator)
          .map((tag) => (lowercase ? tag.trim().toLowerCase() : tag.trim()))
          .filter((tag) => tag !== ''),
      [value, lowercase, separator],
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
        const newTag = lowercase ? pendingDataPoint.trim().toLowerCase() : pendingDataPoint.trim();
        updateTags([...tags, newTag]);
        setPendingDataPoint('');
      }
    }, [pendingDataPoint, tags, lowercase, updateTags]);

    React.useEffect(() => {
      if (pendingDataPoint.includes(separator)) {
        const newTags = [
          ...tags,
          ...pendingDataPoint
            .split(separator)
            .map((chunk) => (lowercase ? chunk.trim().toLowerCase() : chunk.trim()))
            .filter(Boolean),
        ];
        updateTags(newTags);
        setPendingDataPoint('');
      }
    }, [pendingDataPoint, tags, lowercase, separator, updateTags]);

    const handleRemoveTag = (tagToRemove: string) => {
      updateTags(tags.filter((t) => t !== tagToRemove));
    };

    return (
      <>
        <div
          className={cn(
            'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 gap-2 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring/50 focus-visible:ring-ring/50 focus-visible:ring-[2px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            className,
          )}
        >
          {!displayAsList &&
            tags.map((item, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="dark:bg-sidebar-accent"
              >
                {item}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 h-3 w-3"
                  onClick={() => {
                    const updatedTags = tags.filter((t) => t !== item);
                    const newValue = updatedTags.join(',');
                    onChange({ target: { value: newValue } } as React.ChangeEvent<HTMLInputElement>);
                  }}
                >
                  <XIcon className="w-3" />
                </Button>
              </Badge>
            ))}
          <input
            className="flex-1 outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
            value={pendingDataPoint}
            onChange={(e) => setPendingDataPoint(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addPendingDataPoint();
              } else if (e.key === separator) {
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
          <div className="mb-2 flex flex-wrap gap-2">
            {tags.map((item, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="dark:bg-sidebar-accent"
              >
                {item}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 h-3 w-3"
                  onClick={() => handleRemoveTag(item)}
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

InputTags.displayName = 'InputTags';

export { InputTags };
