import React from 'react';

import {Checkbox} from "../ui/checkbox";
import {
    Table as ReactTable,
    Column,
    ColumnDef, ColumnFiltersState, flexRender,
    getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel, SortingState,
    useReactTable, VisibilityState, Row
} from "@tanstack/react-table";
import {
    Table as _Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table"
import {cn} from "../../libs/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";
import {Button} from "../ui/button";
import {ArrowDownIcon, ArrowUpIcon, CaretSortIcon, EyeNoneIcon} from "@radix-ui/react-icons";
import {DataTablePagination} from "./paging";
import {DataTableToolbar} from "./toolbar";
import {DataTableFacetedFilter} from "./filter";
import Action from "./action";

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


const Columns = <TData, >(data: DataTableColumnConfig<TData>[], actions:{action: React.ReactNode, onClick?: (row: Row<TData>) => void }[], selectable?: boolean): ColumnDef<TData>[] => {
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
                    return  <Action row={row} actions={actions}/>
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
                  return  <Action row={row} actions={actions}/>
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
        columns: Columns(columns, rowActions,selectable),
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
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
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
                                    className="h-24 text-center"
                                >
                                    No results.
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
