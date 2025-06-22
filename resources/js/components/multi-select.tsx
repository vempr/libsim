import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, CirclePlus } from 'lucide-react';
import * as React from 'react';

import NewCollectionSheet from './new-collection-sheet';

export type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  hideNewCollectionSheet?: boolean;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select options...',
  emptyText = 'No options found.',
  hideNewCollectionSheet,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = React.useCallback(
    (value: string) => {
      const updatedSelected = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value];
      onChange(updatedSelected);
    },
    [selected, onChange],
  );

  const selectedLabels = React.useMemo(
    () =>
      selected
        .map((value) => options.find((option) => option.value === value)?.label)
        .filter(Boolean)
        .join(', '),
    [selected, options],
  );

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('ml-4 justify-between sm:w-88', className)}
        >
          <span className="truncate">{selected.length > 0 ? selectedLabels : placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search options..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => handleSelect(option.value)}
                  className="mb-1"
                >
                  {option.label}
                  <Check className={cn('ml-auto h-4 w-4', selected.includes(option.value) ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
              <CommandItem className="p-0">
                {!hideNewCollectionSheet && (
                  <NewCollectionSheet>
                    <Button
                      className="m-0 flex w-full items-center"
                      variant="outline"
                      type="button"
                    >
                      <CirclePlus />
                      <p className="sr-only">New collection</p>
                    </Button>
                  </NewCollectionSheet>
                )}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
