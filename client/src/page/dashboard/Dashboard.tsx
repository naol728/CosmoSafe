"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Globe, Satellite, Rocket } from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts"

const spaceActivity = [
    { name: "Jan", satellites: 120, debris: 45 },
    { name: "Feb", satellites: 140, debris: 50 },
    { name: "Mar", satellites: 160, debris: 48 },
    { name: "Apr", satellites: 180, debris: 60 },
    { name: "May", satellites: 200, debris: 62 },
]

const earthStatus = [
    { name: "Mon", co2: 410, ozone: 300 },
    { name: "Tue", co2: 420, ozone: 295 },
    { name: "Wed", co2: 430, ozone: 310 },
    { name: "Thu", co2: 440, ozone: 305 },
    { name: "Fri", co2: 450, ozone: 298 },
]

export default function Dashboard() {
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
                🌍 CosmoSafe Dashboard
            </h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-pink-500/10 to-red-500/10 border-pink-500/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Satellites</CardTitle>
                        <Satellite className="h-5 w-5 text-pink-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,245</div>
                        <p className="text-xs text-muted-foreground">+12 since last week</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-500/10 to-purple-500/10 border-red-500/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Space Debris</CardTitle>
                        <Rocket className="h-5 w-5 text-red-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8,934</div>
                        <p className="text-xs text-muted-foreground">+230 this month</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Earth Alerts</CardTitle>
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">15</div>
                        <p className="text-xs text-muted-foreground">3 critical alerts</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Global CO₂ Levels</CardTitle>
                        <Globe className="h-5 w-5 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">450 ppm</div>
                        <p className="text-xs text-muted-foreground">+10 ppm this week</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Space Activity Chart */}
                <Card className="border border-pink-500/20">
                    <CardHeader>
                        <CardTitle>🚀 Space Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={spaceActivity}>
                                <XAxis dataKey="name" stroke="#8884d8" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="satellites" stroke="#ec4899" strokeWidth={2} />
                                <Line type="monotone" dataKey="debris" stroke="#ef4444" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Earth Status Chart */}
                <Card className="border border-purple-500/20">
                    <CardHeader>
                        <CardTitle>🌍 Earth Status</CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={earthStatus}>
                                <XAxis dataKey="name" stroke="#8884d8" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="co2" fill="#ec4899" />
                                <Bar dataKey="ozone" fill="#8b5cf6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
