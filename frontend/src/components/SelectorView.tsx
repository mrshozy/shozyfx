import * as React from 'react';
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';

import { cn } from '../lib/utils';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Separator } from './ui/separator';

interface SelectorViewProps<T> {
  className?: string;
  title?: string;
  selected?: { value: T, label: string };
  onChange: (data: { value: T, label: string } | undefined) => void;
  options: {
    label: string;
    value: T;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function SelectorView<T>(
  {
    title, options, onChange, selected, className,
  }: SelectorViewProps<T>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={cn('h-8 border-dashed', className)}
        >
          <PlusCircledIcon className='mr-2 h-4 w-4' />
          {title}
          {selected && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal lg:hidden'
              >
                {selected.label}
              </Badge>
              <div className='hidden space-x-1 lg:flex'>
                {options
                  .filter((option) =>
                    selected.label.toLowerCase().includes(option.label.toLowerCase()),
                  )
                  .map((option) => (
                    <Badge
                      variant='secondary'
                      key={option.label}
                      className='rounded-sm px-1 font-normal'
                    >
                      {option.label}
                    </Badge>
                  ))}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected
                  ? selected.label.toLowerCase().includes(option.label.toLowerCase())
                  : false;

                return (
                  <CommandItem
                    key={option.label}
                    onSelect={() => {
                      const selectedValue = options.find(
                        (p) => p.label.toLowerCase() === option.label.toLowerCase(),
                      );
                      if (selectedValue) {
                        onChange({ value: selectedValue.value, label: selectedValue.label });
                      } else {
                        onChange(undefined);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    {option.icon && (
                      <option.icon className='mr-2 h-4 w-4 text-muted-foreground' />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selected && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      onChange(undefined);
                    }}
                    className='justify-center text-center'
                  >
                    Clear Selection
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}