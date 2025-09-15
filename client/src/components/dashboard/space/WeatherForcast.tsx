import { fetchSpaceWeatherForecast } from '@/services/spaceService';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from '@tanstack/react-query';

type SpaceWeatherForecast = { x: string[]; y: number[] };

export default function WeatherForcast() {
  const { data: forecast, isLoading: forecastLoading } =
    useQuery<SpaceWeatherForecast>({
      queryKey: ["spaceWeatherForecast"],
      queryFn: fetchSpaceWeatherForecast,
    });
  return (
    <Card className="bg-gray-900/70 border border-yellow-400/30 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-400 font-bold">
          <Activity className="w-5 h-5" />
          Geomagnetic Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        {forecastLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading ...</span>
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={forecast?.x.map((t, i) => ({
                  time: t,
                  kp: forecast.y[i],
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: "#bbb" }}
                />
                <YAxis tick={{ fontSize: 10, fill: "#bbb" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "1px solid #333",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="kp"
                  stroke="#facc15"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-gray-400 text-[11px] mt-1">
              Forecast of geomagnetic conditions over time.
              <strong>Kp ≥ 5</strong> → potential storm, satellite disruptions, or auroras.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
