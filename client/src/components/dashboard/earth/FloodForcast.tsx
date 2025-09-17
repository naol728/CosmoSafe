/* eslint-disable */
"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useFlood } from "@/hooks/earthhooks/useFlood";

export default function FloodForcast({
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
    const { flood, floodloading, flooderr } = useFlood({ location, page, limit, search });

    const floodData =
        flood?.daily?.time?.map((t: string, i: number) => ({
            date: t,
            discharge: flood.daily.river_discharge[i],
            mean: flood.daily.river_discharge_mean[i],
        })) ?? [];

    return floodloading ? (
        <Skeleton className="h-72 sm:h-96 w-full rounded-xl" />
    ) : flooderr ? (
        <p className="text-destructive text-center mt-4">Error loading flood forecast</p>
    ) : floodData.length === 0 ? (
        <p className="text-muted-foreground text-center mt-4">No flood data available</p>
    ) : (
        <Card className="bg-gradient-to-br from-blue-400/10 to-purple-600/20 border border-blue-500/20 rounded-xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden w-full">
            <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-lg sm:text-xl font-bold text-blue-400">
                    🌊 Flood Risk Forecast
                </CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-4 pb-4 flex flex-col">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={floodData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                        <XAxis dataKey="date" tick={{ fill: "#f9a8d4", fontSize: 10 }} />
                        <YAxis tick={{ fill: "#f9a8d4", fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: "#111827", borderRadius: 8, border: "none" }} itemStyle={{ color: "#fff" }} />
                        <Line type="monotone" dataKey="discharge" stroke="#f472b6" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} name="River Discharge" />
                        <Line type="monotone" dataKey="mean" stroke="#c084fc" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Mean Discharge" />
                    </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-around text-sm sm:text-base text-gray-300">
                    <span className="text-pink-400">🌊 River Discharge</span>
                    <span className="text-purple-400">📈 Mean Discharge</span>
                </div>
            </CardContent>
        </Card>
    );
}
