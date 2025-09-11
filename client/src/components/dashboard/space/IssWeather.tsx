import { fetchISSPosition, fetchSpaceWeatherNow } from '@/services/spaceService';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Satellite, Cloud } from "lucide-react";

export default function IssWeather() {
    const { data: issData, isLoading: issLoading } = useQuery({
        queryKey: ["issPosition"],
        queryFn: fetchISSPosition,
    });
    const { data: weatherNow, isLoading: weatherLoading } = useQuery({
        queryKey: ["spaceWeatherNow"],
        queryFn: fetchSpaceWeatherNow,
    });
    const iss = issData?.[0];
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


            <Card className="bg-gray-900/70 border border-blue-400/30 shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-400 font-bold">
                        <Satellite className="w-5 h-5" />
                        International Space Station
                    </CardTitle>
                </CardHeader>
                <CardContent className="max-h-[380px] overflow-y-auto custom-scrollbar">
                    {issLoading ? (
                        <p className="text-gray-400">Loading ISS data...</p>
                    ) : (
                        <div className="space-y-4 text-sm">
                            <div>
                                <h3 className="text-blue-300 font-semibold mb-1">
                                    Identifiers
                                </h3>
                                <ul className="space-y-1">
                                    <li><strong>NORAD:</strong> {iss?.NORAD_CAT_ID} <span className="text-gray-500"> (catalog ID used for tracking)</span></li>
                                    <li><strong>ID:</strong> {iss?.OBJECT_ID}</li>
                                    <li><strong>Name:</strong> {iss?.OBJECT_NAME}</li>
                                    <li><strong>Type:</strong> {iss?.OBJECT_TYPE} <span className="text-gray-500">(e.g. Payload, Rocket Body)</span></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-blue-300 font-semibold mb-1">Orbit</h3>
                                <ul className="space-y-1">
                                    <li><strong>Inclination:</strong> {iss?.INCLINATION}° <span className="text-gray-500">(tilt relative to Earth’s equator)</span></li>
                                    <li><strong>Apogee:</strong> {iss?.APOGEE} km <span className="text-gray-500">(farthest point from Earth)</span></li>
                                    <li><strong>Perigee:</strong> {iss?.PERIGEE} km <span className="text-gray-500">(closest point to Earth)</span></li>
                                    <li><strong>Mean Motion:</strong> {iss?.MEAN_MOTION} <span className="text-gray-500">(orbits per day)</span></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-blue-300 font-semibold mb-1">Telemetry</h3>
                                <ul className="space-y-1 text-gray-300">
                                    <li>Status: {iss?.DECAYED === "0" ? "🟢 Active in orbit" : "🔴 Decayed / re-entered"}</li>
                                    <li>Epoch: {new Date(iss?.EPOCH).toLocaleString()}</li>
                                    <li>
                                        TLE Data:
                                        <pre className="bg-black/40 p-2 rounded text-xs text-yellow-300 overflow-x-auto mt-1">
                                            {iss?.TLE_LINE0}{"\n"}{iss?.TLE_LINE1}{"\n"}{iss?.TLE_LINE2}
                                        </pre>
                                        <span className="text-gray-500 text-xs">Two-line element set describing orbit</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>


            <Card className="bg-gray-900/70 border border-green-400/30 shadow-lg rounded-2xl flex flex-col items-center justify-center">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-400 font-bold">
                        <Cloud className="w-5 h-5" />
                        Space Weather
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    {weatherLoading ? (
                        <p className="text-gray-400">Loading...</p>
                    ) : (
                        <>
                            <p className="text-gray-400 text-sm mb-2">🌌 Kp Index — geomagnetic activity scale</p>
                            <div className="text-6xl font-extrabold text-green-300">
                                {weatherNow ?? "--"}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Updated: {weatherNow && new Date().toLocaleString()}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-2">
                                Kp ≥ 5 indicates possible auroras and geomagnetic storms.
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
