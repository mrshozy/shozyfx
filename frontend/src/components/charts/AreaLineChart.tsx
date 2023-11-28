import React, { useCallback, useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts';
import { PairData } from '../../@types/charts.ts';
import { dateFormatter, timestampToDate } from '../../lib/date.ts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { useTheme } from '../../hooks/useTheme.ts';

interface AreaLineChartProps {
  data: PairData[];
}

const AreaLineChart: React.FC<AreaLineChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const range = useMemo(() => {
    const prices = data.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const difference = Math.abs(max - min) * 0.1;
    return [min - difference, max + difference];
  }, [data]);
  const decimals = useMemo(() => {
    function countDecimals(num: number): number {
      return (num.toString().split('.')[1] || '').length;
    }

    if (data.length == 0) return 0;
    return countDecimals(data[0].price);
  }, [data]);
  const CustomToolTip = useCallback(function CustomToolTip({ active, payload }: TooltipProps<ValueType, NameType>) {
    if (active && payload && payload.length) {
      const { time, percentage, price } = payload[0].payload;
      return (
        <div className='rounded-lg border bg-background p-2 shadow-sm'>
          <div className='grid grid-cols-2 gap-2'>
            <div className='flex flex-col'>
            <span className='text-sm uppercase text-muted-foreground'>
                Average
            </span>
              <span className='text-sm'>
                {price.toFixed(4)}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-sm uppercase text-muted-foreground'>
                  Strength
              </span>
              <span className='font-bold sm:text-sm'>
                  {percentage.toFixed(4)}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='sm:text-sm uppercase text-muted-foreground'>
                  Time
              </span>
              <span className='font-bold text-sm'>
                  {timestampToDate(time)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }, []);
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis interval={0} dataKey='time' tickFormatter={dateFormatter} className={'text-sm font-thin'} />
        <YAxis interval={0} orientation='right' tickFormatter={(r) => r.toFixed(decimals-1)} className={'text-sm font-thin'} type='number'
               domain={[...range]} />
        <Tooltip content={CustomToolTip} />
        <Area type='monotone' dataKey='price' stroke='#8884d8'

              style={
                {
                  stroke: 'var(--theme-primary)',
                  opacity: 0.25,
                  '--theme-primary': `hsl(${
                    theme == 'dark' ? '47.9 95.8% 53.1%' : '0 0% 9%'
                  })`,
                } as React.CSSProperties
              }
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaLineChart;
