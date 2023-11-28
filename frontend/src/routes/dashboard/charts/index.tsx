import React, { lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { axiosInstance } from '../../../lib/utils.ts';
import { toast } from '../../../components/ui/use-toast.ts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import Icons from '../../../components/Icons.tsx';
import { CURRENCY, CurrencyData, lineChartsData } from '../../../@types/charts.ts';
import { SelectorView } from '../../../components/SelectorView.tsx';
import DatePicker from '../../../components/DatePicker.tsx';
import { formattedHours, getPreviousWorkDay, timestampToDate } from '../../../lib/date.ts';
import { Button } from '../../../components/ui/button.tsx';
import { History } from 'lucide-react';
import { isWeekend } from 'date-fns/fp';
import { makeTradeDecision, sortByAbsoluteAverage } from '../../../lib/signal.ts';

export const LineCharts = lazy(() => import('../../../components/charts/LineChart.tsx'));


interface ChartsProps {
}

const Charts: React.FC<ChartsProps> = () => {
  const [date, setDate] = useState<Date | undefined>(isWeekend(new Date()) ? getPreviousWorkDay() : () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<{ value: CURRENCY, label: string } | undefined>({
    value: CURRENCY.USD,
    label: CURRENCY.USD.toString(),
  });
  const [selectedData, setSelectedData] = useState<CurrencyData[]>([]);
  const [data, setData] = useState(lineChartsData);
  const [stepBack, setStepBack] = useState(1);

  const keys = useMemo(() => Object.values(CURRENCY), []);
  const getSelectedCurrency = useCallback((currency: string | undefined) => {
    switch (currency) {
      case 'AUD':
        return CURRENCY.AUD;
      case 'USD':
        return CURRENCY.USD;
      case 'EUR':
        return CURRENCY.EUR;
      case 'CAD':
        return CURRENCY.CAD;
      case 'NZD':
        return CURRENCY.NZD;
      case 'GBP':
        return CURRENCY.GBP;
      case 'CHF':
        return CURRENCY.CHF;
      case 'JPY':
        return CURRENCY.JPY;
      default:
        return undefined;
    }
  }, []);
  const getTimestamp = useCallback(() => {
    if (date) {
      return Math.floor(date.getTime() / 1000 + (60 * 60 * 24));
    } else {
      return 1;
    }
  }, [date]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    return await axiosInstance.get(`analytics/charts/strength/${getTimestamp()}`).then(resp => resp.data).then(json => {
      return { data: json.body, keys: Object.keys(json.body), selected: Object.keys(json.body)[0] };
    }).then((resp) => {
        setData(resp?.data);
        setLoading(false);
        console.log(sortByAbsoluteAverage(resp?.data))
      },
    ).catch(() => {
      setLoading(false);
      setError(true);
      toast({
        title: 'Error occurred',
        description: 'unknown error occurred while fetching data',
        variant: 'destructive',
      });
    });
  }, [getSelectedCurrency, getTimestamp]);

  useEffect(() => {
    fetchData().then();
  }, [fetchData]);

  useEffect(() => {
    if (selected) {
      setSelectedData(data[selected.value]);
    } else {
      setSelectedData([]);
    }
  }, [selected, data]);
  const analyze = useMemo(() => {
    if (selectedData) {
      if (selectedData.length > 6 && stepBack + 6 <= selectedData.length) {
        const n = selectedData.length - stepBack;
        const start = selectedData[n - 7];
        const end = selectedData[n - 1];
        return (start.average - end.average) / (start.time - end.time) * 60 * 60 * 5;
      } else {
        return 0;
      }
    }
    return 0;
  }, [selectedData, stepBack]);
  const strength = useMemo(() => {
    if (selectedData) {
      if (selectedData.length > 6 && stepBack + 6 <= selectedData.length) {
        const n = selectedData.length - stepBack;
        const start = selectedData[n - 7];
        const end = selectedData[n - 1];
        return (start.strength - end.strength) / (start.time - end.time) * 60 * 60 * 5;
      } else {
        return 0;
      }
    }
    return 0;
  }, [selectedData, stepBack]);
  return (
    <div className='h-full w-full flex-1 flex-col flex space-y-5 mt-4 lg:mt-0 px-5'>
      <div className='flex items-center justify-between space-y-1'>
        <div>
          <h2 className='md:text-2xl text-xl font-bold tracking-tight'>Charts</h2>
        </div>
      </div>
      <div className={'h-full w-full flex justify-center align-top flex-col items-start space-y-5'}>
        <div className={'w-full flex flex-row md:flex-nowrap flex-wrap justify-start items-center'}>
          <DatePicker className={'mr-5 my-2'} disabled={loading} date={date}
                      onChange={(date) => setDate(date)} />
          <SelectorView
            className={'my-2'}
            title={'Currency'}
            selected={selected}
            onChange={(s) => setSelected(s ? { label: s.label, value: s.value } : undefined)}
            options={keys.map(key => ({ label: key, value: key, icon: Icons.currency }))}
          />
          <Button className={'ml-5 my-2'} variant={'outline'} disabled={loading} onClick={() => {
            if (stepBack + 6 < selectedData.length) {
              setStepBack(prevState => prevState + 1);
            } else {
              setStepBack(1);
            }
          }}>
            <History className='m-1 h-4 w-4' />
            {selectedData && formattedHours(selectedData[selectedData.length - stepBack - 1]?.time)}
          </Button>
        </div>
        <div className={'grow w-full h-full'}>
          <Card className={'w-full md:h-full h-[75vw] flex flex-col justify-between'}>
            <CardHeader>
              {
                (!error && selected && selectedData && !loading) && (
                  <>
                    <CardTitle className={'md:text-2xl text-xl'}>{`${selected.label} `}Money
                      Flow Index</CardTitle>
                    <CardDescription className={'flex flex-row justify-start items-center'}>
                      Last 6 Average {analyze?.toFixed(4) + ' '} Last 6
                      Strength {strength?.toFixed(4) + ' '}
                      {(strength * analyze).toFixed(4)}
                      <br/>
                       { selectedData  && JSON.stringify(makeTradeDecision(data, stepBack))}
                    </CardDescription>
                  </>
                )
              }
            </CardHeader>
            <CardContent className='h-[80%] w-full'>
              <div className='h-full w-[100%] flex flex-col justify-center items-center'>
                {selectedData ? <LineCharts data={selectedData} /> :
                  <div className={'space-y-5 flex flex-col justify-center items-center'}>
                    {loading ?
                      <>
                        <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
                        <p>Loading</p>
                      </> :
                      error ? <p>Failed to fetch data</p> :
                        <p>No data currency selected {date && timestampToDate(date.getTime() / 1000, true)}</p>
                    }
                  </div>
                }
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default Charts;
