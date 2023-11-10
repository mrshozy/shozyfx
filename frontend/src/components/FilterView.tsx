import * as React from "react"
import {useState} from "react"
import {CheckIcon, PlusCircledIcon} from "@radix-ui/react-icons"

import {cn} from "../libs/utils"
import {Badge} from "./ui/badge"
import {Button} from "./ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "./ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "./ui/popover"
import {Separator} from "./ui/separator"

interface DataTableFacetedFilterProps{
    constant: any[]
    title?: string
    onChange: (data:any[]) => void
    options: {
        label: string
        value: string
        icon?: React.ComponentType<{ className?: string }>
    }[]
}

export function FilterView({title, options, constant, onChange}: DataTableFacetedFilterProps){
    const [selected, setSelected] = useState<string[]>([])
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    {title}
                    {selected?.length > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal lg:hidden"
                            >
                                {selected.length}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selected.length > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal"
                                    >
                                        {selected.length} selected
                                    </Badge>
                                ) : (
                                    options.filter((option) => selected.includes(option.value.toLowerCase()))
                                        .map((option) => (
                                            <Badge
                                                variant="secondary"
                                                key={option.value}
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={title} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selected.includes(option.value.toLowerCase())
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            async function filterData() {
                                                let s:string[] = []
                                                if (isSelected) {
                                                    s = selected.filter(p => p != option.label.toLowerCase())
                                                } else {
                                                    s =  [...selected, option.label.toLowerCase()]
                                                }
                                                setSelected(s)
                                                const filteredDataArray = constant.map(item => {
                                                    return s.reduce((acc, currency) => {
                                                        const {[currency]: removedCurrency, ...rest} = acc;
                                                        return rest;
                                                    }, item);
                                                });
                                                onChange(filteredDataArray)
                                            }
                                            filterData()
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <CheckIcon className={cn("h-4 w-4")} />
                                        </div>
                                        {option.icon && (
                                            <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span>{option.label}</span>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                        {selected.length > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => {
                                            async function clear() {
                                                setSelected([])
                                                onChange(constant)
                                            }
                                            clear()
                                        }}
                                        className="justify-center text-center"
                                    >
                                        Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
