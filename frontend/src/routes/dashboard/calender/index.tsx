import { useState } from 'react';
import events_mock from '../../../_mocks/events';
import Table, { DataTableColumnConfig, DataTableColumnHeader } from '../../../components/Table.tsx';
import { z } from 'zod';
import { formattedDate } from '../../../lib/date.ts';
import { DropdownMenuSeparator, DropdownMenuShortcut } from '../../../components/ui/dropdown-menu';
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from '@radix-ui/react-icons';


const eventSchema = z.object({
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

const priorities = [
  {
    label: 'Low',
    value: 'Low',
    icon: ArrowDownIcon,
  },
  {
    label: 'Medium',
    value: 'Medium',
    icon: ArrowRightIcon,
  },
  {
    label: 'High',
    value: 'High',
    icon: ArrowUpIcon,
  },
];

type EVENT = z.infer<typeof eventSchema>
const columns: DataTableColumnConfig<EVENT>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => (
      <div className='capitalize'>{formattedDate(new Date(parseInt(row.getValue('date')) * 1000))}</div>
    ),
  },
  {
    accessorKey: 'time',
    header: 'Time',
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('time')}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'currency',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Currency' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          {row.getValue('currency')}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'event',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Event' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
            <span className='max-w-[250px] truncate font-medium'>
                {row.getValue('event')}
                </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return (row.getValue(id) as string).toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: 'impact',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Impact' />
    ),
    cell: ({ row }) => {
      const status = priorities.find(
        (status) => status.value === row.getValue('impact'),
      );
      if (!status) {
        return null;
      }
      return (
        <div className='flex w-[100px] items-center'>
          {status.icon && (
            <status.icon className='mr-2 h-4 w-4 text-muted-foreground' />
          )}
          <span
            className={`${status.value == 'High' ? 'text-red-700' : status.value == 'Medium' ? 'text-orange-500' : 'text-orange-300'}`}>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: 'actual',
    header: 'Actual',
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('actual')}</div>
    ),
  },
  {
    accessorKey: 'forecast',
    header: 'Cons',
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('forecast')}</div>
    ),
  },
  {
    accessorKey: 'previous',
    header: 'Previous',
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('previous')}</div>
    ),
  },
];

export default function Calender() {
  const [data, _] = useState<unknown>(events_mock);
  return (
    <div className='flex h-full flex-1 flex-col space-y-8 px-10 md:flex'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Economic Calender</h2>
          <p className='text-muted-foreground'>
            Here&apos;s a list of economic events!
          </p>
        </div>
      </div>
      <Table
        columns={columns}
        data={data as typeof eventSchema._type []}
        paging={{ size: 7 }}
        selectable={false}
        toolbar={
          {
            search: 'event',
            filters: ['impact', 'currency'],
            tableViewOptions: true,
          }
        }
        rowActions={
          [
            {
              action: 'Analysis',
              onClick: (data) => alert(data.getValue('event')),
            },
            {
              action: 'History',
              onClick: (data) => alert(data.getValue('event')),
            },
            {
              action: 'Send Remainder',
              onClick: (data) => alert(data.getValue('event')),
            },
            {
              action: <DropdownMenuSeparator />,
            },
            {
              action: <>Delete<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut></>,
              onClick: (data) => alert(data.getValue('event')),
            },
          ]
        }
      />
    </div>
  );
}