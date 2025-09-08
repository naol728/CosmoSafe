import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useFlood } from "@/hooks/earthhooks/useFlood";

export default function FloodForecast({
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
    const { flood, floodloading, flooderr } = useFlood({
        location,
        page,
        limit,
        search,
    });

    const floodData =
        flood?.daily?.time?.map((t: string, i: number) => ({
            date: t,
            discharge: flood.daily.river_discharge[i],
            mean: flood.daily.river_discharge_mean[i],
        })) ?? [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {floodloading ? (
                <Skeleton className="h-[500px] w-full rounded-xl" />
            ) : flooderr ? (
                <p className="text-destructive">Error loading flood forecast</p>
            ) : floodData.length > 0 ? (
                <Card className="bg-gradient-to-br from-gray-900/90 via-pink-900/50 to-purple-900/50 border border-gray-700 shadow-lg hover:shadow-2xl transition-shadow rounded-xl overflow-hidden">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-pink-400">
                            🌊 Flood Risk Forecast
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart
                                data={floodData}
                                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: "#f9a8d4", fontSize: 12 }}
                                />
                                <YAxis
                                    tick={{ fill: "#f9a8d4", fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#111827",
                                        borderRadius: 8,
                                        border: "none",
                                        color: "#fff",
                                    }}
                                    itemStyle={{ color: "#fff" }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="discharge"
                                    stroke="#f472b6"
                                    strokeWidth={3}
                                    dot={{ r: 4, stroke: "#f472b6", strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                    name="River Discharge"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="mean"
                                    stroke="#c084fc"
                                    strokeWidth={3}
                                    dot={{ r: 4, stroke: "#c084fc", strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                    name="Mean Discharge"
                                />
                            </LineChart>
                        </ResponsiveContainer>

                        <div className="mt-4 flex justify-around text-sm text-gray-300">
                            <span className="flex items-center gap-1 text-pink-400">🌊 River Discharge</span>
                            <span className="flex items-center gap-1 text-purple-400">📈 Mean Discharge</span>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <p className="text-gray-300">No flood forecast data available</p>
            )}
        </motion.div>
    );
}
