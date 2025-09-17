/* eslint-disable */
"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useWeather } from "@/hooks/earthhooks/useWeather";

export default function WeatherForecast({
    location,
    page,
    limit,
    search,
}: {
    location: { lat: number; lon: number } | null;
    page: number;
    search: string;
    limit: number;
}) {
    const { weather, weatherloading, weathererr } = useWeather({
        location,
        page,
        limit,
        search,
    });

    const weatherData =
        weather?.daily?.time?.map((t: string, i: number) => ({
            date: t,
            temp: weather.daily.temperature_2m_max[i],
            rain: weather.daily.precipitation_sum[i],
        })) ?? [];

    if (weatherloading)
        return <Skeleton className="h-72 sm:h-96 w-full rounded-xl" />;
    if (weathererr)
        return (
            <p className="text-destructive text-center mt-4">
                Error loading weather forecast
            </p>
        );
    if (weatherData.length === 0)
        return (
            <p className="text-muted-foreground text-center mt-4">
                No weather data available
            </p>
        );

    return (
        <Card className="bg-card border border-border shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden w-full">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 pt-4 pb-2">
                <CardTitle className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
                    🌦️ 7-Day Weather Forecast
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2 sm:mt-0">
                    Forecast updated daily
                </p>
            </CardHeader>

            <CardContent className="px-2 sm:px-4 pb-4 flex flex-col gap-4">
                {/* Responsive Chart */}
                <div className="w-full h-64 sm:h-80 md:h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={weatherData}
                            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                                interval="preserveStartEnd"
                                angle={-30}
                                textAnchor="end"
                                minTickGap={15}
                            />
                            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "var(--card)",
                                    borderRadius: 8,
                                    border: "none",
                                    color: "var(--foreground)",
                                }}
                                itemStyle={{ color: "var(--foreground)" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="temp"
                                stroke="var(--primary)"
                                strokeWidth={3}
                                dot={{ r: 4, stroke: "var(--primary)", strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                                name="Temp (°C)"
                            />
                            <Line
                                type="monotone"
                                dataKey="rain"
                                stroke="var(--secondary)"
                                strokeWidth={3}
                                dot={{ r: 4, stroke: "var(--secondary)", strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                                name="Rain (mm)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="mt-2 flex flex-col sm:flex-row justify-center sm:justify-around gap-2 sm:gap-4 text-sm sm:text-base">
                    <span className="flex items-center gap-2 text-primary font-medium">
                        🌡 Temp (°C)
                        <div className="w-4 h-1 bg-primary rounded-full" />
                    </span>
                    <span className="flex items-center gap-2 text-secondary font-medium">
                        💧 Rain (mm)
                        <div className="w-4 h-1 bg-secondary rounded-full" />
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
