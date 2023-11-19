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

interface SelectorViewProps {
  className?: string,
  constant: string[]
  title?: string
  selected?: string
  onChange: (data: string | undefined) => void
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export function SelectorView({ title, options, constant, onChange, selected, className }: SelectorViewProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className={cn('h-8 border-dashed', className)}>
          <PlusCircledIcon className='mr-2 h-4 w-4' />
          {title}
          {selected && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal lg:hidden'
              >
                {selected}
              </Badge>
              <div className='hidden space-x-1 lg:flex'>
                {
                  options.filter((option) => selected.toLowerCase().includes(option.value.toLowerCase()))
                    .map((option) => (
                      <Badge
                        variant='secondary'
                        key={option.value}
                        className='rounded-sm px-1 font-normal'
                      >
                        {option.label}
                      </Badge>
                    ))
                }
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
                const isSelected = selected?.toLowerCase().includes(option.value.toLowerCase());
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      async function filterData() {
                        let s: string | undefined = undefined;
                        if (!isSelected) {
                          s = constant.find((p: string) => p.toLowerCase() == option.label.toLowerCase());
                        }
                        onChange(s);
                      }

                      filterData();
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
                      async function clear() {
                        onChange(undefined);
                      }

                      clear();
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
