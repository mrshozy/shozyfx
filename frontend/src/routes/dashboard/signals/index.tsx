import React, { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import Table, { DataTableColumnConfig, DataTableColumnHeader } from '../../../components/Table.tsx';
import { axiosInstance } from '../../../lib/utils.ts';
import { DropdownMenuSeparator, DropdownMenuShortcut } from '../../../components/ui/dropdown-menu.tsx';
import { isWeekend } from 'date-fns/fp';
import { getPreviousWorkDay } from '../../../lib/date.ts';
import DatePicker from '../../../components/DatePicker.tsx';


const schema = z.object({
  currency: z.string(),
  absolute_average: z.onumber(),
  average: z.onumber(),
  strength: z.onumber(),
});

type STRENGTH = z.infer<typeof schema>


const columns: DataTableColumnConfig<STRENGTH>[] = [
  {
    accessorKey: 'currency',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Currency' />
    ),
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('currency')}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'absolute_value',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Absolute' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-end'>
          {(row.getValue('absolute_value') as number).toFixed(5)}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'average',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Average' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
            <span className='max-w-[250px] truncate font-medium'>
                {(row.getValue('average') as number).toFixed(5)}
            </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return (row.getValue(id) as string).toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: 'strength',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Strength' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
            <span className='max-w-[250px] truncate font-medium'>
                {(row.getValue('strength') as number).toFixed(5)}
            </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return (row.getValue(id) as string).toLowerCase().includes(value.toLowerCase());
    },
  },
];
const Signals: React.FC<{}> = () => {
  const [data, setData] = useState<STRENGTH[]>([]);
  const [date, setDate] = useState<Date | undefined>(isWeekend(new Date()) ? getPreviousWorkDay() : () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const getTimestamp = useCallback(() => {
    if (date) {
      return Math.floor(date.getTime() / 1000 + (60 * 60 * 24));
    } else {
      return 1;
    }
  }, [date]);
  useEffect(() => {
    let time = getTimestamp()
    if (time != 1) {
      axiosInstance.get(`analytics/signal/${time}`).then((resp) => resp.data)
        .then(json => {
          setData(json.body);
        });
    }
  }, [getTimestamp]);

  return (
    <div className='flex h-full flex-1 flex-col space-y-8 px-10 md:flex'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Currency Strength</h2>
          <p className='text-muted-foreground'>
            Here&apos;s a list of currency strength!
          </p>
        </div>
      </div>
      <Table
        columns={columns}
        paging_size={8}
        data={data as typeof schema._type []}
        paging={{ size: 8 }}
        selectable={false}
        toolbar={
          {
            filters: ['currency'],
            tableViewOptions: false,
            view: () => {
              return <DatePicker className={'mr-5 my-2'} disabled={false} date={date}
                                 onChange={(date) => setDate(date)} />;
            },
          }
        }
        rowActions={
          [
            {
              action: 'Analysis',
              onClick: (data) => alert(data.getValue('currency')),
            },
            {
              action: 'History',
              onClick: (data) => alert(data.getValue('currency')),
            },
            {
              action: 'Send Remainder',
              onClick: (data) => alert(data.getValue('currency')),
            },
            {
              action: <DropdownMenuSeparator />,
            },
            {
              action: <>Delete<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut></>,
              onClick: (data) => alert(data.getValue('currency')),
            },
          ]
        }
      />
    </div>
  );
};

export default Signals;
