/* eslint-disable */
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, Satellite, Cloud, Activity, Globe } from "lucide-react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import {
    fetchISSPosition,
    fetchSpaceWeatherNow,
    fetchSpaceWeatherForecast,
    fetchCollisionAlerts,
    fetchNearByObjects,
} from "@/services/spaceService";


type SpaceWeatherForecast = { x: string[]; y: number[] };
type CollisionAlert = { [key: string]: any };
type NearbyObject = { name: string; inclination: number; altitude: number; epoch: string };

export default function Space() {
    const { data: issData, isLoading: issLoading } = useQuery({
        queryKey: ["issPosition"],
        queryFn: fetchISSPosition,
    });

    const { data: weatherNow, isLoading: weatherLoading } = useQuery({
        queryKey: ["spaceWeatherNow"],
        queryFn: fetchSpaceWeatherNow,
    });

    const { data: forecast, isLoading: forecastLoading } = useQuery<SpaceWeatherForecast>({
        queryKey: ["spaceWeatherForecast"],
        queryFn: fetchSpaceWeatherForecast,
    });

    const { data: collisions, isLoading: collisionLoading } = useQuery<CollisionAlert[]>({
        queryKey: ["collisionAlerts"],
        queryFn: fetchCollisionAlerts,
    });

    const { data: nearbyObjects, isLoading: nearbyLoading } = useQuery<NearbyObject[]>({
        queryKey: ["nearbyObjects"],
        queryFn: fetchNearByObjects,
    });

    const iss = issData?.[0];

    return (
        <section className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-gray-100 p-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

            {/* Left Column: ISS + Space Weather */}
            <div className="grid grid-cols-1 gap-6 md:col-span-1">

                {/* ISS Card */}
                <Card className="bg-gray-950/80 backdrop-blur-md border border-blue-500/40 shadow-lg hover:shadow-blue-400/40 hover:scale-[1.01] transition-all">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-400 font-bold text-lg">
                            <Satellite className="w-5 h-5" />
                            International Space Station (ISS)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {issLoading ? (
                            <p className="text-gray-400">Loading ISS data...</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                {/* Identifiers */}
                                <div>
                                    <h3 className="text-blue-300 font-semibold mb-1">Identifiers</h3>
                                    <ul className="space-y-1">
                                        <li><strong>NORAD ID:</strong> {iss.NORAD_CAT_ID}</li>
                                        <li><strong>Object ID:</strong> {iss.OBJECT_ID}</li>
                                        <li><strong>INTL Designator:</strong> {iss.INTLDES}</li>
                                        <li><strong>Name:</strong> {iss.OBJECT_NAME}</li>
                                        <li><strong>Type:</strong> {iss.OBJECT_TYPE}</li>
                                    </ul>
                                </div>

                                {/* Orbit */}
                                <div>
                                    <h3 className="text-blue-300 font-semibold mb-1">Orbit</h3>
                                    <ul className="space-y-1">
                                        <li><strong>Inclination:</strong> {iss.INCLINATION}°</li>
                                        <li><strong>RA Asc Node:</strong> {iss.RA_OF_ASC_NODE}°</li>
                                        <li><strong>Mean Motion:</strong> {iss.MEAN_MOTION} rev/day</li>
                                        <li><strong>Apogee:</strong> {iss.APOGEE} km</li>
                                        <li><strong>Perigee:</strong> {iss.PERIGEE} km</li>
                                    </ul>
                                </div>

                                {/* Extra */}
                                <div className="sm:col-span-2">
                                    <h3 className="text-blue-300 font-semibold mb-1">Telemetry</h3>
                                    <ul className="space-y-1 text-gray-300">
                                        <li><strong>Status:</strong> {iss.DECAYED === "0" ? "🟢 Active" : "🔴 Decayed"}</li>
                                        <li><strong>Epoch:</strong> {new Date(iss.EPOCH).toLocaleString()}</li>
                                        <li><strong>BSTAR:</strong> {iss.BSTAR}</li>
                                        <li><strong>Rev @ Epoch:</strong> {iss.REV_AT_EPOCH}</li>
                                        <li><strong>TLE:</strong>
                                            <pre className="bg-gray-900/60 p-2 rounded text-xs text-yellow-300 overflow-x-auto">
                                                {iss.TLE_LINE0}{"\n"}{iss.TLE_LINE1}{"\n"}{iss.TLE_LINE2}
                                            </pre>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Space Weather Now */}
                <Card className="bg-gray-950/80 backdrop-blur-md border border-green-500/40 shadow-lg hover:shadow-green-400/30 hover:scale-[1.01] transition-all">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-400 font-semibold">
                            <Cloud className="w-5 h-5" />
                            Space Weather (Now)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {weatherLoading ? (
                            <p className="text-gray-500">Loading weather...</p>
                        ) : (
                            <div className="flex flex-col items-center">
                                <p className="text-sm text-gray-400 mb-2">
                                    Kp Index (0 = calm, 9 = storm)
                                </p>
                                <p className="text-4xl font-extrabold text-green-300 drop-shadow-lg">{weatherNow}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Updated: {weatherNow && new Date(weatherNow.timestamp).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Forecast */}
            <Card className="bg-gray-950/80 backdrop-blur-md border border-yellow-500/40 shadow-lg hover:shadow-yellow-400/30 hover:scale-[1.01] transition-all md:col-span-1 lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-400 font-semibold">
                        <Activity className="w-5 h-5" />
                        Geomagnetic Forecast (Kp)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {forecastLoading ? (
                        <p className="text-gray-500">Loading forecast...</p>
                    ) : (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={forecast?.x.map((t, i) => ({ time: t, kp: forecast.y[i] }))}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#bbb" }} />
                                    <YAxis tick={{ fill: "#bbb" }} />
                                    <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #444", color: "#fff" }} />
                                    <Line type="monotone" dataKey="kp" stroke="#facc15" strokeWidth={2} dot={{ fill: "#facc15" }} />
                                </LineChart>
                            </ResponsiveContainer>
                            <p className="text-sm text-gray-400 mt-3">
                                Kp ≥ 5 → geomagnetic storms visible at lower latitudes.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Collisions */}
            <Card className="bg-gray-950/80 backdrop-blur-md border border-red-500/40 shadow-lg hover:shadow-red-400/30 hover:scale-[1.01] transition-all md:col-span-2 lg:col-span-3">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-400 font-semibold">
                        <AlertCircle className="w-5 h-5" />
                        Potential Satellite Collisions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {collisionLoading ? (
                        <p className="text-gray-500">Loading collision alerts...</p>
                    ) : collisions && collisions.length > 0 ? (
                        <ul className="space-y-4 text-sm max-h-96 overflow-y-auto custom-scrollbar">
                            {collisions.map((c, i) => (
                                <li key={i} className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg hover:bg-red-900/30 transition">
                                    <h3 className="text-red-300 font-bold mb-2">
                                        ID: {c.CDM_ID} | Emergency: {c.EMERGENCY_REPORTABLE}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <div>
                                            <p><strong>Sat 1:</strong> {c.SAT_1_NAME} ({c.SAT_1_ID})</p>
                                            <p><strong>Type:</strong> {c.SAT1_OBJECT_TYPE}</p>
                                        </div>
                                        <div>
                                            <p><strong>Sat 2:</strong> {c.SAT_2_NAME} ({c.SAT_2_ID})</p>
                                            <p><strong>Type:</strong> {c.SAT2_OBJECT_TYPE}</p>
                                        </div>
                                    </div>
                                    <p className="mt-2"><strong>Closest Approach:</strong> {new Date(c.TCA).toLocaleString()}</p>
                                    <p className="mt-1"><strong>Min Range:</strong> {c.MIN_RNG} km</p>
                                    {c.PC && <p><strong>Probability:</strong> {c.PC}</p>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No recent collision alerts 🚀</p>
                    )}
                </CardContent>
            </Card>

            {/* Nearby Objects */}
            <Card className="bg-gray-950/80 backdrop-blur-md border border-purple-500/40 shadow-lg hover:shadow-purple-400/30 hover:scale-[1.01] transition-all md:col-span-2 lg:col-span-3">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-400 font-semibold">
                        <Globe className="w-5 h-5" />
                        Nearby Objects Around Earth
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {nearbyLoading ? (
                        <p className="text-gray-500">Loading nearby objects...</p>
                    ) : nearbyObjects && nearbyObjects.length > 0 ? (
                        <ul className="space-y-3 text-sm max-h-96 overflow-y-auto custom-scrollbar">
                            {nearbyObjects.map((obj, i) => (
                                <li key={i} className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg hover:bg-purple-900/30 transition">
                                    <p className="font-bold text-purple-200">{obj.name}</p>
                                    <p><strong>Inclination:</strong> {obj.inclination}°</p>
                                    <p><strong>Altitude:</strong> {obj.altitude} km</p>
                                    <p className="text-xs text-gray-400">Last updated: {new Date(obj.epoch).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No nearby objects detected 🌌</p>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
