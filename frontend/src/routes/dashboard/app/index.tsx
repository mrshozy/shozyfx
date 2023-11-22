import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PAIR, PairData, PAIRS } from '../../../@types/charts.ts';
import { axiosInstance } from '../../../lib/utils.ts';
import { toast } from '../../../components/ui/use-toast.ts';
import { SelectorView } from '../../../components/SelectorView.tsx';
import DatePicker from '../../../components/DatePicker.tsx';
import Icons from '../../../components/Icons.tsx';
import { formattedDate, getPreviousWorkDay, timestampToDate } from '../../../lib/date.ts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import AreaLineChart from '../../../components/charts/AreaLineChart.tsx';
import { MoveDownRight, MoveUpRight } from 'lucide-react';
import { isWeekend } from 'date-fns/fp';

interface DashboardProps {

}

const Dashboard: React.FC<DashboardProps> = () => {
  const [date, setDate] = useState<Date | undefined>(isWeekend(new Date()) ? getPreviousWorkDay() : new Date());
  const pairs = useMemo(() => PAIRS, []);
  const [selected, setSelected] = useState<{ value: PAIR, label: string } | undefined>({
    value: PAIR.EURUSD,
    label: PAIR.EURUSD.toString(),
  });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PairData[]>([]);
  const [error, setError] = useState(false);
  const getTimestamp = useCallback(() => {
    if (date) {
      return Math.floor(date.getTime() / 1000 + (60 * 60 * 24));
    } else {
      return 1;
    }
  }, [date]);
  useEffect(() => {
    if (selected && getTimestamp() != 1) {
      setLoading(true);
      const fetch = async () => {
        return await axiosInstance.get(`/analytics/charts/pairs/${selected.value.toString()}/${getTimestamp()}`).then(resp => resp.data);
      };
      fetch().then(json => {
        if (!json.success) {
          toast({
            title: 'Fetching Data',
            description: json.message,
            variant: 'destructive',
          });
        } else {
          setData(json.body);
        }
        setLoading(false);
      }).catch(() => {
        setLoading(false);
        setError(true);
        toast({
          title: 'Fetching Data',
          description: 'Failed to load data',
          variant: 'destructive',
        });
      });
    }
  }, [selected, getTimestamp]);
  const lastMove = useMemo(() => {
    if (data.length > 0) {
      return data[data.length - 1];
    } else {
      return undefined;
    }
  }, [data]);
  return (
    <div className='h-full w-full flex-1 flex-col flex space-y-5 mt-4 lg:mt-0 p-5'>
      <div className='flex items-center justify-between space-y-1'>
        <div>
          <h2 className='md:text-2xl text-xl font-bold tracking-tight'>Currency Chart</h2>
        </div>
      </div>
      <div className={'h-full w-full flex justify-center align-top flex-col items-start space-y-5'}>
        <div className={'w-full flex flex-row md:flex-nowrap flex-wrap justify-start items-center'}>
          <DatePicker className={'mr-5 my-2'} disabled={loading} date={date}
                      onChange={(date) => setDate(date)} />
          <SelectorView selected={selected} title={'Pair'} onChange={(pair) => {
            setSelected(pair);
          }} options={pairs.map((pair) => ({ value: pair, label: pair.toString() }))} />
        </div>
        <div className={'grow w-full h-full'}>
          <Card className={'w-full md:h-full h-[75vw] flex flex-col justify-between'}>
            <CardHeader>
              {
                (!error && selected && data) && (
                  <>
                    <CardTitle>
                      <span className={'md:text-2xl text-xl'}>{`${selected.label}`}</span>
                      {lastMove && (<>
                                                <span className={'ml-2 font-medium text-lg text-card-foreground'}>
                                                    {lastMove.price}
                                                </span>
                        <span
                          className={`${lastMove.percentage >= 0 ? 'text-green-500' : 'text-red-500'} font-light text-sm ml-2`}>
                                                    {`${lastMove.percentage >= 0 ? '+' : ''}`}{lastMove.percentage}%
                                                </span>
                        <span>{lastMove.percentage >= 0 ?
                          <MoveUpRight className={'w-3 h-3 inline'} /> :
                          <MoveDownRight className={'w-3 h-3 inline'} />
                        }</span>
                      </>)}
                    </CardTitle>
                    <CardDescription className={'flex flex-row justify-start items-center'}>
                      {lastMove && (
                        <>
                                                    <span className={'font-medium text-sm mr-2 '}>
                                                        {timestampToDate(lastMove.time)}
                                                    </span>

                        </>
                      )}
                    </CardDescription>
                  </>
                )
              }
            </CardHeader>
            <CardContent className='h-[80%] w-full'>
              <div className='h-full w-[100%] flex flex-col justify-center items-center'>
                {data ? <AreaLineChart data={data} /> :
                  <div className={'space-y-5 flex flex-col justify-center items-center'}>
                    {loading ?
                      <>
                        <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                        <p>Loading</p>
                      </> :
                      error ? <p>Failed to fetch data</p> :
                        <p>No data currency selected {date && formattedDate(date, 0)}</p>
                    }
                  </div>
                }
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
    ;
};

export default Dashboard;
