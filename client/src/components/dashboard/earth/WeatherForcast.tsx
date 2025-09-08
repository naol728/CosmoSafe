import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {weatherloading ? (
                <Skeleton className="h-[500px] w-full rounded-xl" />
            ) : weathererr ? (
                <p className="text-destructive">Error loading weather forecast</p>
            ) : weatherData.length > 0 ? (
                <Card className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 shadow-lg hover:shadow-2xl transition-shadow rounded-xl overflow-hidden">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-pink-200">
                            🌦️ 7-Day Weather Forecast
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart
                                data={weatherData}
                                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0d7f5" />
                                <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1e293b",
                                        borderRadius: 8,
                                        border: "none",
                                        color: "#fff",
                                    }}
                                    itemStyle={{ color: "#fff" }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="temp"
                                    stroke="#ec4899"
                                    strokeWidth={3}
                                    dot={{ r: 5, stroke: "#ec4899", strokeWidth: 2 }}
                                    activeDot={{ r: 7 }}
                                    name="Temp (°C)"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="rain"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{ r: 5, stroke: "#8b5cf6", strokeWidth: 2 }}
                                    activeDot={{ r: 7 }}
                                    name="Rain (mm)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="mt-4 flex justify-around text-sm text-gray-600">
                            <span className="flex items-center gap-1 text-pink-500">🌡 Temp (°C)</span>
                            <span className="flex items-center gap-1 text-purple-500">💧 Rain (mm)</span>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <p className="text-muted-foreground">No weather data available</p>
            )}
        </motion.div>
    );
}
