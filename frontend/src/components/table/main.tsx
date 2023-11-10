import React from 'react';
import {Button} from "../ui/button"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "../ui/select"
import {cn} from "../../libs/utils";
import {Input} from "../ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "../ui/dropdown-menu"
import {Badge} from "../ui/badge"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "../ui/command"
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover"
import {Separator} from "../ui/separator"
import {Checkbox} from "../ui/checkbox";
import {
    Table as ReactTable,
    ColumnDef, ColumnFiltersState, flexRender,
    getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel, SortingState,
    useReactTable, VisibilityState,
    Row, Column
} from "@tanstack/react-table";
import {
    Table as _Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table"

import {
    ArrowDownIcon,
    ArrowUpIcon,
    CaretSortIcon,
    EyeNoneIcon,
    Cross2Icon,
    DotsHorizontalIcon,
    CheckIcon,
    PlusCircledIcon,
    MixerHorizontalIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon
} from "@radix-ui/react-icons";


interface DataTablePaginationProps<TData> {
    table: ReactTable<TData>
    className?: string
    size: number
}

export function DataTablePagination<TData>({table, className, size}: DataTablePaginationProps<TData>) {
    return (
        <div className={cn("flex items-center justify-between px-2", className)}>
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={table.getState().pagination.pageSize}/>
                        </SelectTrigger>
                        <SelectContent side="top">
                            {Array.from({length: 4}, (_, i) => size * (i + 1)).map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <DoubleArrowLeftIcon className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeftIcon className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRightIcon className="h-4 w-4"/>
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <DoubleArrowRightIcon className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
        </div>
    )
}

interface DataTableViewOptionsProps<TData> {
    table: ReactTable<TData>
}

export function DataTableViewOptions<TData>({table}: DataTableViewOptionsProps<TData>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto hidden h-8 lg:flex"
                >
                    <MixerHorizontalIcon className="mr-2 h-4 w-4"/>
                    View
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                {table
                    .getAllColumns()
                    .filter(
                        (column) =>
                            typeof column.accessorFn !== "undefined" && column.getCanHide()
                    )
                    .map((column) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => column.toggleVisibility(value)}
                            >
                                {column.id}
                            </DropdownMenuCheckboxItem>
                        )
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

interface DataTableToolbarProps<T> {
    table: ReactTable<T>,
    data: T[]
    searchBy?: string,
    filters?: (table: ReactTable<T>, data: T[]) => React.JSX.Element,
    view?: React.ReactNode
    tableViewOptions?: boolean
}

export function DataTableToolbar<T>({
                                        table,
                                        searchBy,
                                        filters,
                                        data,
                                        tableViewOptions,
                                        view
                                    }: DataTableToolbarProps<T>) {
    const isFiltered = table.getState().columnFilters.length > 0
    return (
        <div className="flex items-center justify-between mx-1 my-1">
            <div className="flex flex-1 items-center space-x-2">
                {
                    searchBy && <Input
                        placeholder={`Search ${searchBy}...`}
                        value={(table.getColumn(searchBy)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(searchBy)?.setFilterValue(event.target.value)
                        }
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                }
                {filters && filters(table, data)}
                {view}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4"/>
                    </Button>
                )}
            </div>
            {tableViewOptions && <DataTableViewOptions table={table}/>}
        </div>
    )
}

interface DataTableFacetedFilterProps<TData, TValue> {
    column?: Column<TData, TValue>
    title?: string
    options: {
        label: string
        value: string
        icon?: React.ComponentType<{ className?: string }>
    }[]
}

export function DataTableFacetedFilter<TData, TValue>({
                                                          column,
                                                          title,
                                                          options
                                                      }: DataTableFacetedFilterProps<TData, TValue>) {
    const facets = column?.getFacetedUniqueValues()
    const selectedValues = new Set(column?.getFilterValue() as string[])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed capitalize">
                    <PlusCircledIcon className="mr-2 h-4 w-4"/>
                    {title}
                    {selectedValues?.size > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4"/>
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal lg:hidden"
                            >
                                {selectedValues.size}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedValues.size > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal"
                                    >
                                        {selectedValues.size} selected
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) => selectedValues.has(option.value))
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
                    <CommandInput placeholder={title} className={"capitalize"}/>
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selectedValues.has(option.value)
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            if (isSelected) {
                                                selectedValues.delete(option.value)
                                            } else {
                                                selectedValues.add(option.value)
                                            }
                                            const filterValues = Array.from(selectedValues)
                                            column?.setFilterValue(
                                                filterValues.length ? filterValues : undefined
                                            )
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
                                            <CheckIcon className={cn("h-4 w-4")}/>
                                        </div>
                                        {option.icon && (
                                            <option.icon className="mr-2 h-4 w-4 text-muted-foreground"/>
                                        )}
                                        <span>{option.label}</span>
                                        {facets?.get(option.value) && (
                                            <span
                                                className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                                        )}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator/>
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => column?.setFilterValue(undefined)}
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


interface ActionProps<TData> {
    row: Row<TData>
    actions: {
        onClick?: (row: Row<TData>) => void,
        action: React.ReactNode
    }[]
}

const Action = <TData, >({row, actions}: ActionProps<TData>) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className={`${actions.length == 0 ? "hidden" : ""}`}>
                <Button
                    variant="ghost"
                    className={`${actions.length == 0 ? "hidden" : "flex"} h-8 w-8 p-0 data-[state=open]:bg-muted`}
                >
                    <DotsHorizontalIcon className="h-4 w-4"/>
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                {actions.map(action => (
                    action.onClick ? (
                        <DropdownMenuItem onClick={() => {
                            if (action.onClick) action.onClick(row)
                        }}>{action.action}</DropdownMenuItem>
                    ) : action.action
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
};

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
}

export function DataTableColumnHeader<TData, TValue>(
    {column, title, className,}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>
    }
    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === "desc" ? (
                            <ArrowDownIcon className="ml-2 h-4 w-4"/>
                        ) : column.getIsSorted() === "asc" ? (
                            <ArrowUpIcon className="ml-2 h-4 w-4"/>
                        ) : (
                            <CaretSortIcon className="ml-2 h-4 w-4"/>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                        <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"/>
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                        <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"/>
                        Desc
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                        <EyeNoneIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"/>
                        Hide
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export interface DataTableColumnConfig<TData> {
    id?: string,
    accessorKey?: string;
    header?: string | React.ReactNode | (({column}: { column: Column<TData> }) => React.ReactNode);
    cell: (params: { row: any }) => React.ReactNode;
    enableSorting?: boolean;
    enableHiding?: boolean;
    filterFn?: (row: any, id: string, value: string) => boolean;
}


const Columns = <TData, >(data: DataTableColumnConfig<TData>[], actions: {
    action: React.ReactNode,
    onClick?: (row: Row<TData>) => void
}[], selectable?: boolean): ColumnDef<TData>[] => {
    if (selectable) {
        return [
            {
                id: "select",
                header: ({table}) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                        className="translate-y-[2px]"
                    />
                ),
                cell: ({row}) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="translate-y-[2px]"
                    />
                ),
                enableSorting: true,
                enableHiding: true,
            },
            ...data.map((t) => {
                return {
                    id: t.id,
                    accessorKey: t.accessorKey,
                    header: t.header,
                    cell: t.cell,
                    filterFn: t.filterFn,
                    enableHiding: t.enableHiding,
                    enableSorting: t.enableSorting,
                } as ColumnDef<TData>
            }),
            {
                id: "action",
                cell: ({row}) => {
                    return <div className={"flex flex-row items-end justify-end"}><Action row={row} actions={actions}/></div>
                }
            }
        ];
    } else {
        return [
            ...data.map((t) => {
                return {
                    id: t.id,
                    accessorKey: t.accessorKey,
                    header: t.header,
                    cell: t.cell,
                    filterFn: t.filterFn,
                    enableHiding: t.enableHiding,
                    enableSorting: t.enableSorting,
                } as ColumnDef<TData>
            }),
            {
                id: "action",
                cell: ({row}) => {
                    return <div className={"flex flex-row items-end justify-end"}><Action row={row} actions={actions}/></div>
                }
            }
        ];
    }
};

interface TableProps<TData> {
    title?: string,
    paging?: {
        size: number
        sticky?: boolean
    }
    selectable?: boolean
    toolbar?: {
        search?: string,
        view?: (table: ReactTable<TData>, data: TData[]) => React.JSX.Element,
        filters?: string[],
        tableViewOptions?: boolean
    }
    columns: DataTableColumnConfig<TData>[]
    data: TData[],
    rowActions: { action: React.ReactNode, onClick?: (row: Row<TData>) => void }[]
}

const Table = <TData, >({columns, data, paging, toolbar, selectable, rowActions}: TableProps<TData>) => {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const table = useReactTable<TData>({
        data: data,
        columns: Columns(columns, rowActions, selectable),
        initialState: {
            pagination: {
                pageSize: 7,
            },
        },
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    return (
        <div className={`${paging && paging.sticky ? "overflow-hidden" : "overflow-auto"} space-y-4 h-full mb-10 `}>
            {toolbar &&
                <DataTableToolbar
                    tableViewOptions={toolbar.tableViewOptions} data={data}
                    searchBy={toolbar.search}
                    filters={(table, data) => (
                        <>
                            {toolbar?.filters?.map(key => (
                                <DataTableFacetedFilter
                                    column={table.getColumn(key)} title={key}
                                    options={
                                        data.reduce((acc, cur: any) => {
                                            if (!acc.some(c => c[key] == cur[key])) {
                                                acc.push(cur)
                                            }
                                            return acc
                                        }, [] as any[]).map(d => ({
                                            label: d[key],
                                            value: d[key]
                                        }))
                                    }
                                />
                            ))}
                        </>
                    )} table={table}/>
            }
            <div className="rounded-md border overflow-auto max-h-[83%]">
                <_Table className={`overflow-auto`}>
                    <TableHeader className={"overflow-hidden"}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className={"overflow-auto"}>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center">
                                    No Data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </_Table>
            </div>
            {paging && <DataTablePagination className={"my-4"} size={paging.size} table={table}/>}
        </div>
    );
};
export default Table;