import React, { useCallback } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import { dateFormatter, timestampToDate } from '../../lib/date.ts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface ChartsProps {
  data: {
    time: number,
    average: number,
    strength: number,
  }[];
}

const LineCharts: React.FC<ChartsProps> = ({ data }) => {
  const { theme } = useTheme();
  const CustomToolTip = useCallback(function CustomToolTip({ active, payload }: TooltipProps<ValueType, NameType>) {
    if (active && payload && payload.length) {
      const { time, strength, average } = payload[0].payload;
      return (
        <div className='rounded-lg border bg-background p-2 shadow-sm'>
          <div className='grid grid-cols-2 gap-2'>
            <div className='flex flex-col'>
            <span className='text-sm uppercase text-muted-foreground'>
                Average
            </span>
              <span className='text-sm font-thin'>
                {average.toFixed(4)}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-sm uppercase text-muted-foreground'>
                  Strength
              </span>
              <span className='sm:text-sm font-thin'>
                  {strength.toFixed(4)}
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='sm:text-sm uppercase text-muted-foreground'>
                  Time
              </span>
              <span className='text-sm font-thin'>
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
      <LineChart
        data={data}
        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <XAxis className={'text-sm font-thin'} interval={0} dataKey='time' tickFormatter={dateFormatter} />
        <YAxis className={'text-sm font-thin'}  orientation='right' interval={0}/>
        <Tooltip content={CustomToolTip} />
        <Line dot={false} type='monotone' dataKey='average'
              strokeWidth={2}
              activeDot={{
                r: 6,
                style: { fill: 'var(--theme-primary)', opacity: 0.25 },

              }}
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
        <Line
          type='monotone'
          dataKey='strength'
          strokeWidth={2}
          dot={false}
          style={
            {
              stroke: 'var(--theme-primary)',
              '--theme-primary': `hsl(${
                theme == 'dark' ? '47.9 95.8% 53.1%' : '0 0% 9%'
              })`,
            } as React.CSSProperties
          }
          activeDot={{
            r: 8,
            style: { fill: 'var(--theme-primary)' },
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineCharts;
