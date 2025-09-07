/* eslint-disable */
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Suspense, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import { useCarbon } from "./useCarbon";
import { useWeather } from "./useWeather";
import { useFlood } from "./useFlood";
import { useDisaster } from "./useDisaster";

export default function Earth() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [openDialog, setOpenDialog] = useState(true);
    const limit = 5;

    const askLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                    setOpenDialog(false);
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    setOpenDialog(false);
                }
            );
        } else {
            setOpenDialog(false);
        }
    };


    const { carbon, carbonloading, carbonerr } = useCarbon({ location });
    const { weather, weatherloading, weathererr } = useWeather({ location });
    const { flood, floodloading, flooderr } = useFlood({ location });
    const { disaster: disasters, loadingdiaster: disastersLoading, disastererr: disastersError } =
        useDisaster({ location, page, limit, search });

    const weatherData =
        weather?.daily?.time?.map((t: string, i: number) => ({
            date: t,
            temp: weather.daily.temperature_2m_max[i],
            rain: weather.daily.precipitation_sum[i],
        })) ?? [];

    const floodData =
        flood?.daily?.time?.map((t: string, i: number) => ({
            date: t,
            discharge: flood.daily.river_discharge[i],
            mean: flood.daily.river_discharge_mean[i],
        })) ?? [];

    return (
        <>
            {/* Location Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>🌍 Allow Location Access</DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            To personalize forecasts and disasters near you, we need your location.
                        </p>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={askLocation}>Allow</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="p-6 space-y-6">
                {/* Top Metrics */}
                <Suspense fallback={<p>Loading top metrics...</p>}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Carbon */}
                        <Card>
                            <CardHeader>
                                <CardTitle>🌱 Carbon Emission</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {carbonloading ? (
                                    <p>Loading...</p>
                                ) : carbonerr ? (
                                    <p className="text-red-500">Error loading carbon data</p>
                                ) : (
                                    <>
                                        <p className="text-2xl font-bold">{carbon?.global_co2_ppm || "NA"} ppm</p>
                                        <p className="text-muted-foreground">{carbon?.trend}</p>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Disasters */}
                        <Card>
                            <CardHeader>
                                <CardTitle>🌋 Nearby Disasters</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {disastersLoading ? (
                                    <p>Loading...</p>
                                ) : disastersError ? (
                                    <p className="text-red-500">Error loading disasters</p>
                                ) : (
                                    <>
                                        <p className="text-2xl font-bold">{disasters?.length || 0}</p>
                                        <p className="text-muted-foreground">Next {limit} shown below</p>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Flood */}
                        <Card>
                            <CardHeader>
                                <CardTitle>🌊 Flood Risk</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {floodloading ? (
                                    <p>Loading...</p>
                                ) : flooderr ? (
                                    <p className="text-red-500">Error loading flood data</p>
                                ) : (
                                    <p className="text-2xl font-bold">{floodData?.[0]?.discharge || "NA"} m³/s</p>
                                )}
                                <p className="text-muted-foreground">Today’s forecast</p>
                            </CardContent>
                        </Card>
                    </div>
                </Suspense>

                {/* Weather Forecast */}
                <Suspense fallback={<p>Loading weather forecast...</p>}>
                    {weatherloading ? (
                        <p>Loading weather forecast...</p>
                    ) : weathererr ? (
                        <p className="text-red-500">Error loading weather forecast</p>
                    ) : (
                        weatherData.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>🌦️ 7-Day Weather Forecast</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={weatherData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="temp" stroke="#f472b6" name="Temp (°C)" />
                                            <Line type="monotone" dataKey="rain" stroke="#60a5fa" name="Rain (mm)" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )
                    )}
                </Suspense>

                {/* Flood Forecast */}
                <Suspense fallback={<p>Loading flood forecast...</p>}>
                    {floodloading ? (
                        <p>Loading flood forecast...</p>
                    ) : flooderr ? (
                        <p className="text-red-500">Error loading flood forecast</p>
                    ) : (
                        floodData.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>🌊 Flood Risk Forecast</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={floodData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="discharge" stroke="#34d399" name="River Discharge" />
                                            <Line type="monotone" dataKey="mean" stroke="#fbbf24" name="Mean Discharge" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )
                    )}
                </Suspense>

                {/* Disasters Table */}
                <Suspense fallback={<p>Loading recent disasters...</p>}>
                    {disastersLoading ? (
                        <p>Loading recent disasters...</p>
                    ) : disastersError ? (
                        <p className="text-red-500">Error loading disasters</p>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>🔥 Recent Natural Events</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 mb-4">
                                    <Input
                                        placeholder="Search events..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <Button onClick={() => setPage(1)}>Search</Button>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Event</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Magnitude</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {disasters?.length > 0 ? (
                                            disasters.map((d: any) => (
                                                <TableRow key={d.id}>
                                                    <TableCell>{d.title}</TableCell>
                                                    <TableCell>{d.categories?.[0]?.title}</TableCell>
                                                    <TableCell>{new Date(d.geometry[0]?.date).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        {d.geometry[0]?.magnitudeValue
                                                            ? `${d.geometry[0].magnitudeValue} ${d.geometry[0].magnitudeUnit}`
                                                            : "N/A"}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center">
                                                    No events found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>

                                <div className="flex justify-between mt-4">
                                    <Button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                                        Previous
                                    </Button>
                                    <p>Page {page}</p>
                                    <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </Suspense>
            </div>
        </>
    );
}
