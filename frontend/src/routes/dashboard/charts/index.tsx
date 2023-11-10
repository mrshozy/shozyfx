import React, {useEffect, useState} from 'react';
import {useOutletContext} from "react-router-dom";
import {SelectorView} from "../../../components/SelectorView";
import Icons from "../../../components/Icons";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../../components/ui/card";
import Charts from "../../../components/Charts";
import {axiosInstance} from "../../../libs/utils";
import {toast} from "../../../components/ui/use-toast";
import DatePicker from "../../../components/DatePicker";
import {Button} from "../../../components/ui/button";
import {MoveRight} from "lucide-react"
import useSettings from "../../../hooks/useSettings";

interface ChartsPageProps {

}

const ChartsPage: React.FC<ChartsPageProps> = () => {
    const [onChange, setFixed]: any = useOutletContext();
    setFixed(false)
    onChange("Charts")
    const [date, setDate] = React.useState<Date>()
    const [loading, setLoading] = useState(true)
    const [keys, setKeys] = useState<string[]>([])
    const [selected, setSelected] = useState<string | undefined>()
    const [data, setData] = useState<any>()
    const getTimestamp = () => {
        if (date) {
            return date.getTime() / 1000 + (60 * 60 * 24)
        } else {
            return 1
        }
    }
    const fetchData = async () => {
        setLoading(true)
        return await axiosInstance.get(`analytics/charts/strength/${getTimestamp()}`).then(resp => resp.data).then(json => {
            return {data: json.body, keys: Object.keys(json.body), selected: Object.keys(json.body)[0]}
        }).then((resp) => {
                setData(resp?.data)
                setSelected(resp?.selected)
                setKeys(resp?.keys || [])
                setLoading(false)
            }
        ).catch(_ => {
            setLoading(false)
            toast({
                title: "Error occurred",
                description: "unknown error occurred while fetching data",
                variant: "destructive"
            })
        })
    }
    useEffect(() => {
        fetchData()
    }, []);

    return (
        <div className="h-full w-full flex-1 flex-col flex space-y-5 mt-4 lg:mt-0 p-5">
            <div className="flex items-center justify-between space-y-1">
                <div>
                    <h2 className="md:text-2xl text-xl font-bold tracking-tight">Charts</h2>
                </div>
            </div>
            <div className={"h-full w-full flex justify-center align-top flex-col items-start space-y-5"}>
                <div className={"w-full flex flex-row md:flex-nowrap flex-wrap justify-start items-center"}>
                    <DatePicker className={"mr-5 my-2"}  disabled={loading} date={date} onChange={(date) => setDate(date)}/>
                    <Button className={"mr-5 my-2"}  variant={"outline"} disabled={loading} onClick={fetchData}>
                        Submit
                        <MoveRight className="m-2 h-4 w-4"/>
                    </Button>
                    <SelectorView
                        className={"my-2"}
                        title={"Currency"}
                        selected={selected}
                        constant={keys}
                        onChange={(s) => setSelected(s)}
                        options={keys.map(key => ({label: key, value: key, icon: Icons.currency}))}
                    />
                </div>
                <div className={"grow w-full h-full"}>
                    <Card className={"w-full md:h-full h-[75vw] flex flex-col justify-between"}>
                        <CardHeader>
                            {
                                selected && (
                                    <>
                                        <CardTitle className={"md:text-2xl text-xl"}>{`${selected} `}Strength Index</CardTitle>
                                        <CardDescription className={"flex flex-row justify-start items-center"}>
                                            Compere the trends if both below 0 weak
                                        </CardDescription>
                                    </>
                                )
                            }
                        </CardHeader>
                        <CardContent className="h-[80%] w-full">
                            <div className="h-full w-[100%] flex flex-col justify-center items-center">
                                {selected ? <Charts data={data[selected]}/> :
                                    <div className={"space-y-5 flex flex-col justify-center items-center"}>
                                        {loading ?
                                            <>
                                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                                <p>Loading</p>
                                            </> :
                                            !data ? <p>Failed to fetch data</p> : <p>No data currency selected</p>
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

export default ChartsPage;
