import React, {lazy, useCallback, useEffect, useMemo, useState} from 'react';
import {axiosInstance} from '../../../lib/utils.ts';
import {toast} from '../../../components/ui/use-toast.ts';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '../../../components/ui/card.tsx';
import Icons from '../../../components/Icons.tsx';
import {currencies, CURRENCY, CurrencyData, lineChartsData} from '../../../@types/charts.ts';
import {SelectorView} from '../../../components/SelectorView.tsx';
import DatePicker from '../../../components/DatePicker.tsx';
import {formattedDate, getPreviousWorkDay} from '../../../lib/date.ts';

export const LineCharts = lazy(() => import('../../../components/charts/Charts.tsx'));


interface ChartsProps {
}

const Charts: React.FC<ChartsProps> = () => {
    const [date, setDate] = useState<Date | undefined>(getPreviousWorkDay());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [keys, setKeys] = useState<string[]>([]);
    const [selected, setSelected] = useState<CURRENCY | undefined>();
    const [selectedData, setSelectedData] = useState<CurrencyData[]>([]);
    const [data, setData] = useState(lineChartsData);

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
            return {data: json.body, keys: Object.keys(json.body), selected: Object.keys(json.body)[0]};
        }).then((resp) => {
                setData(resp?.data);
                setSelected(getSelectedCurrency(currencies[0]));
                setKeys(resp?.keys || []);
                setLoading(false);
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
            setSelectedData(data[selected]);
        } else {
            setSelectedData([]);
        }
    }, [selected, data]);
    const analyze = useMemo(() => {
        if (selectedData.length > 6) {
            const n = selectedData.length;
            const start = selectedData[n - 6];
            const end = selectedData[n - 1]
            return (start.average - end.average) / (start.time - end.time) * 60 * 60 * 5
        } else {
            return 0
        }
    }, [selectedData]);
    const strength = useMemo(() => {
        if (selectedData.length > 6) {
            const n = selectedData.length;
            const start = selectedData[n - 6];
            const end = selectedData[n - 1]
            return (start.strength - end.strength) / (start.time - end.time) * 60 * 60 * 5
        } else {
            return 0
        }
    }, [selectedData]);
    return (
        <div className='h-full w-full flex-1 flex-col flex space-y-5 mt-4 lg:mt-0 p-5'>
            <div className='flex items-center justify-between space-y-1'>
                <div>
                    <h2 className='md:text-2xl text-xl font-bold tracking-tight'>Charts</h2>
                </div>
            </div>
            <div className={'h-full w-full flex justify-center align-top flex-col items-start space-y-5'}>
                <div className={'w-full flex flex-row md:flex-nowrap flex-wrap justify-start items-center'}>
                    <DatePicker className={'mr-5 my-2'} disabled={loading} date={date}
                                onChange={(date) => setDate(date)}/>
                    {/*<Button className={'mr-5 my-2'} variant={'outline'} disabled={loading}>*/}
                    {/*  Analyze*/}
                    {/*  <LineChartIcon className='m-2 h-4 w-4' />*/}
                    {/*</Button>*/}
                    <SelectorView
                        className={'my-2'}
                        title={'Currency'}
                        selected={selected}
                        constant={keys}
                        onChange={(s) => setSelected(getSelectedCurrency(s))}
                        options={keys.map(key => ({label: key, value: key, icon: Icons.currency}))}
                    />
                </div>
                <div className={'grow w-full h-full'}>
                    <Card className={'w-full md:h-full h-[75vw] flex flex-col justify-between'}>
                        <CardHeader>
                            {
                                (!error && selectedData && analyze && strength) && (
                                    <>
                                        <CardTitle className={'md:text-2xl text-xl'}>{`${selected} `}Strength
                                            Index</CardTitle>
                                        <CardDescription className={'flex flex-row justify-start items-center'}>
                                            Last 6 Average {analyze.toFixed(4) + " "} Last 6
                                            Strength {strength.toFixed(4) + " "}
                                        </CardDescription>
                                    </>
                                )
                            }
                        </CardHeader>
                        <CardContent className='h-[80%] w-full'>
                            <div className='h-full w-[100%] flex flex-col justify-center items-center'>
                                {selectedData ? <LineCharts data={selectedData}/> :
                                    <div className={'space-y-5 flex flex-col justify-center items-center'}>
                                        {loading ?
                                            <>
                                                <Icons.spinner className='mr-2 h-4 w-4 animate-spin'/>
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
    );
};
export default Charts;
