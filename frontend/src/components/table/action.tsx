import React from 'react';
import {Row} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";
import {Button} from "../ui/button";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";


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

export default Action;
