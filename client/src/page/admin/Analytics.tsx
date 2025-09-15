/* eslint-disable */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Tooltip, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";
import { Users, AlertTriangle, Activity, Database } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/services/admin";
import { Loading } from "@/components/Loading";

export default function AdminAnalytics() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["getAnalytics"],
        queryFn: getAnalytics,
    });

    if (isLoading) return <Loading />;
    if (isError || !data?.success) return <div>Failed to load analytics</div>;

    const stats = data.data;

    // Prepare chart data
    const userGrowth = [
        { month: "Jan", users: 0 },
        { month: "Feb", users: 0 },
        { month: "Mar", users: 0 },
        { month: "Apr", users: 0 },
        { month: "May", users: 5 },
    ];

    const disasterReports = [
        { type: "Earthquake", count: stats.earthquakes },
        { type: "Flood", count: stats.disasters },
        { type: "Wildfire", count: stats.collisionAlerts },
        { type: "Storm", count: stats.neoAlerts },
    ];

    const systemUsage = stats.apiRequestsLast7Days.map((item: any) => ({
        day: item.date,
        requests: item.count,
    }));

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">🚀 Cosmosafe Admin Analytics</h1>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="shadow-md">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-5 w-5 text-blue-500" />
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">{stats.users.total}</CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
                        <Activity className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">{stats.users.premium}</CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Total Revinue</CardTitle>
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">${stats.users.premium * 25}</CardContent>
                </Card>

                <Card className="shadow-md">
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">API Requests</CardTitle>
                        <Database className="h-5 w-5 text-purple-500" />
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">{stats.apiRequests}</CardContent>
                </Card>
            </div>

            {/* Tabs for charts */}
            <Tabs defaultValue="users" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="users">User Growth</TabsTrigger>
                    <TabsTrigger value="disasters">Disaster Reports</TabsTrigger>
                    <TabsTrigger value="system">System Usage</TabsTrigger>
                </TabsList>

                {/* User Growth Chart */}
                <TabsContent value="users">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Growth Over Time</CardTitle>
                        </CardHeader>
                        <CardContent className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={userGrowth}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Disaster Reports Chart */}
                <TabsContent value="disasters">
                    <Card>
                        <CardHeader>
                            <CardTitle>Disaster Reports Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="h-72 flex justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={disasterReports} dataKey="count" nameKey="type" outerRadius={100} fill="#ef4444" label />
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* System Usage Chart */}
                <TabsContent value="system">
                    <Card>
                        <CardHeader>
                            <CardTitle>System API Usage (Last 7 Days)</CardTitle>
                        </CardHeader>
                        <CardContent className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={systemUsage}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="requests" fill="#8b5cf6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
