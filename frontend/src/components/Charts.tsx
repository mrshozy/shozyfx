import React, {memo} from 'react';
import {Line, LineChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis} from 'recharts';
import {useTheme} from "../hooks/useTheme";

interface ChartsProps {
    data: {
        time: string,
        average: number,
        strength: number,
    }[]
}
const dateFormatter = (date: number) => {
    const formattedDate = new Date(date * 1000);
    const hours = formattedDate.getHours().toString().padStart(2, '0');
    const minutes = formattedDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};


function timestampToDate(timestamp: number): string {
    const date = new Date(timestamp * 1000); // Convert the timestamp to milliseconds
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const month = monthNames[date.getMonth()];
    const day = dayNames[date.getDay()];
    const dateNumber = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${month} ${day} ${dateNumber} ${hours}:${minutes}`;
}

const Charts: React.FC<ChartsProps> = ({data}) => {
    const {theme} = useTheme()
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{top: 5, right: 5, left: 0, bottom: 5,}}>
                <XAxis className={"text-sm"} dataKey="time" tickFormatter={dateFormatter}/>
                <YAxis className={"text-sm"} />
                <Tooltip content={CustomToolTip}/>
                <Line type="monotone" dataKey="average"
                      strokeWidth={2}
                      activeDot={{
                          r: 6,
                          style: {fill: "var(--theme-primary)", opacity: 0.25},
                      }}
                      style={
                          {
                              stroke: "var(--theme-primary)",
                              opacity: 0.25,
                              "--theme-primary": `hsl(${
                                  theme == "dark" ? "0 0% 98%" : "0 0% 9%"
                              })`,
                          } as React.CSSProperties
                      }
                />
                <Line
                    type="monotone"
                    dataKey="strength"
                    strokeWidth={2}
                    activeDot={{
                        r: 8,
                        style: {fill: "var(--theme-primary)"},
                    }}
                    style={
                        {
                            stroke: "var(--theme-primary)",
                            "--theme-primary": `hsl(${
                                theme == "dark" ? "0 0% 98%" : "0 0% 9%"
                            })`,
                        } as React.CSSProperties
                    }
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

const CustomToolTip: React.FC<TooltipProps<any, any>> = ({active, payload}) => {

    if (active && payload && payload.length) {
        let {time, strength, average} = payload[0].payload
        return (
            <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                            <span className="text-sm uppercase text-muted-foreground">
                              Average
                            </span>
                        <span className="text-sm">
                              {average.toFixed(4)}
                            </span>
                    </div>
                    <div className="flex flex-col">
                            <span className="text-sm uppercase text-muted-foreground">
                              Strength
                            </span>
                        <span className="font-bold sm:text-sm">
                              {strength.toFixed(4)}
                        </span>
                    </div>
                    <div className="flex flex-col">
                            <span className="sm:text-sm uppercase text-muted-foreground">
                              Time
                            </span>
                        <span className="font-bold text-sm">
                              {timestampToDate(time)}
                        </span>
                    </div>
                </div>
            </div>
        )
    }
    return null
}

export default memo(Charts);
