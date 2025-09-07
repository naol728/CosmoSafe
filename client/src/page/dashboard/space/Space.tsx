import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts"
import { Satellite, Sun, Globe, Activity } from "lucide-react"

export default function Space() {
    // Dummy Data
    const satellites = 5678
    const issPosition = { lat: "23.4°N", lon: "45.6°E" }
    const solarFlares = [
        { date: "Aug 20", intensity: 2.3 },
        { date: "Aug 21", intensity: 1.8 },
        { date: "Aug 22", intensity: 3.1 },
        { date: "Aug 23", intensity: 2.9 },
    ]
    const asteroidThreats = [
        { name: "2025 AB", distance: 3.2 },
        { name: "2025 XY", distance: 5.7 },
        { name: "2025 QW", distance: 2.1 },
    ]

    return (
        <div className="p-6 space-y-6">
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-purple-900/40 to-black/80 border border-purple-700/30">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-purple-300">Active Satellites</CardTitle>
                        <Satellite className="h-5 w-5 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-white">{satellites}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-pink-900/40 to-black/80 border border-pink-700/30">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-pink-300">ISS Location</CardTitle>
                        <Globe className="h-5 w-5 text-pink-400" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-white">Lat: {issPosition.lat}</p>
                        <p className="text-lg text-white">Lon: {issPosition.lon}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-900/40 to-black/80 border border-yellow-700/30">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-yellow-300">Solar Storm Alerts</CardTitle>
                        <Sun className="h-5 w-5 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-white">{solarFlares.length}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-900/40 to-black/80 border border-red-700/30">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-red-300">Near-Earth Objects</CardTitle>
                        <Activity className="h-5 w-5 text-red-400" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-white">{asteroidThreats.length}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Graphs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/60 border border-purple-500/20">
                    <CardHeader>
                        <CardTitle className="text-purple-300">Solar Flare Intensity (last 7 days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={solarFlares}>
                                <XAxis dataKey="date" stroke="#aaa" />
                                <YAxis stroke="#aaa" />
                                <Tooltip />
                                <Line type="monotone" dataKey="intensity" stroke="#e879f9" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-black/60 border border-red-500/20">
                    <CardHeader>
                        <CardTitle className="text-red-300">Closest Asteroids (LD)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={asteroidThreats}>
                                <XAxis dataKey="name" stroke="#aaa" />
                                <YAxis stroke="#aaa" />
                                <Tooltip />
                                <Bar dataKey="distance" fill="#f87171" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
