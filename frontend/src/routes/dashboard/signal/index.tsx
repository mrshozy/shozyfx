import React from 'react';
import Table, {DataTableColumnHeader} from "../../../components/table/main";
import {z} from "zod";

interface SignalProps {
    // Define your prop types here
}

export const eventSchema = z.object({
    id: z.string(),
    date: z.string(),
    time: z.string(),
    currency: z.string(),
    impact: z.string(),
    event: z.string(),
    actual: z.string(),
    forecast: z.string(),
    previous: z.string(),
});
type event = z.infer<typeof eventSchema>
const Signal: React.FC<SignalProps> = () => {
    return (
        <div className={"w-full h-full"}>
            <Table
                rowActions={[
                    {
                        action: "Parent",
                        onClick: (row) => alert(row.getValue("name"))
                    }
                ]}
                paging={
                    {
                        size: 2,
                        sticky: true,
                    }
                }
                toolbar={
                    {
                        search: "name",
                        filters: ["name", "surname"]
                    }
                }
                columns={[
                    {
                        accessorKey: "name",
                        header: ({column}) => <DataTableColumnHeader column={column} title="Name"/>,
                        enableSorting: true,
                        enableHiding: true,
                        cell: ({row}) => (
                            <div className="capitalize">{row.getValue("name")}</div>
                        ),
                        filterFn: (row, id, value) => {
                            return row.getValue(id).includes(value)
                        }
                    },
                    {
                        accessorKey: "surname",
                        header: ({column}) => <DataTableColumnHeader column={column} title="surname"/>,
                        enableSorting: true,
                        enableHiding: true,
                        cell: ({row}) => (
                            <div className="capitalize">{row.getValue("surname")}</div>
                        ),
                        filterFn: (row, id, value) => {
                            return value.includes(row.getValue(id))
                        },
                    }
                ]
                }
                data={[{
                    id: 1,
                    name: "zamo",
                    surname: "shozi",
                    age: "24"
                }, {
                    id: 2,
                    name: "sanele",
                    surname: "ndlovu",
                    age: "19"
                },
                    {
                        id: 3,
                        name: "sanele brain",
                        surname: "shozi",
                        age: "19"
                    }
                ]}
            />
        </div>
    );
};

export default Signal;
