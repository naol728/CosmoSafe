/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCarbon } from "@/hooks/earthhooks/useCarbon";
import { useFlood } from "@/hooks/earthhooks/useFlood";
import { useEarthQuake } from "@/hooks/earthhooks/useEarthquake";
import { useDisaster } from "@/hooks/earthhooks/useDisaster";
import { Globe, AlertTriangle, Rocket, Satellite } from "lucide-react";

export default function TopMetrics({
    location,
    page,
    search,
}: {
    location: { lat: number; lon: number } | null;
    page: number;
    search: string;
}) {
    const limit = 5;
    const { carbon, carbonloading, carbonerr } = useCarbon({ location });
    const { flood, floodloading, flooderr } = useFlood({ location });
    const { earthquake, earthquakeloading, earthquekeerr } = useEarthQuake({
        location,
        page,
        limit,
        search,
    });
    const {
        disaster: disasters,
        loadingdiaster: disastersLoading,
        disastererr: disastersError,
    } = useDisaster({ location, page, limit, search });

    const floodData =
        flood?.daily?.time?.map((t: string, i: number) => ({
            date: t,
            discharge: flood.daily.river_discharge[i],
            mean: flood.daily.river_discharge_mean[i],
        })) ?? [];

    const cards = [
        {
            title: "🌱 Carbon Emission",
            data: carbon?.global_co2_ppm,
            sub: carbon?.trend || "+0 ppm",
            icon: Globe,
            gradient: "from-green-400/10 to-green-600/10",
            border: "border-green-500/20",
            loading: carbonloading,
            error: carbonerr,
            unit: "ppm",
        },
        {
            title: "🌋 Nearby Disasters",
            data: disasters?.length || 0,
            sub: `Next ${limit} shown below`,
            icon: AlertTriangle,
            gradient: "from-red-400/10 to-red-600/10",
            border: "border-red-500/20",
            loading: disastersLoading,
            error: disastersError,
        },
        {
            title: "🌊 Flood Risk",
            data: floodData?.[0]?.discharge || 0,
            sub: "Today’s forecast",
            icon: Satellite,
            gradient: "from-blue-400/10 to-blue-600/10",
            border: "border-blue-500/20",
            loading: floodloading,
            error: flooderr,
            unit: "m³/s",
        },
        {
            title: "🌍 Recent Earthquake",
            data:
                earthquake?.earthquakes?.length > 0
                    ? `${earthquake.earthquakes[0].magnitude} M`
                    : 0,
            sub:
                earthquake?.earthquakes?.length > 0
                    ? earthquake.earthquakes[0].place
                    : "No recent earthquakes nearby",
            extra:
                earthquake?.earthquakes?.length > 0
                    ? new Date(earthquake.earthquakes[0].time).toLocaleString()
                    : null,
            icon: Rocket,
            gradient: "from-orange-400/10 to-orange-600/10",
            border: "border-orange-500/20",
            loading: earthquakeloading,
            error: earthquekeerr,
        },
    ];

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <h1 className="text-xl sm:text-4xl font-bold 
    bg-gradient-to-r from-pink-400 to-red-400 
    bg-clip-text text-transparent text-center sm:text-left">
                🌍 Earth Dashboard
            </h1>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{ scale: 1.03 }}
                        >
                            <Card
                                className={`bg-gradient-to-br ${card.gradient} ${card.border} rounded-xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col justify-between h-full`}
                            >
                                <CardHeader className="flex items-center justify-between pb-2 px-4 pt-4">
                                    <CardTitle className="text-sm sm:text-base font-medium line-clamp-2">
                                        {card.title}
                                    </CardTitle>
                                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-current opacity-70" />
                                </CardHeader>
                                <CardContent className="px-4 pb-4 flex flex-col justify-between flex-1">
                                    {card.loading ? (
                                        <Skeleton className="h-20 w-full rounded-xl" />
                                    ) : card.error ? (
                                        <p className="text-destructive text-sm">Error loading data</p>
                                    ) : (
                                        <>
                                            <div className="text-xl sm:text-2xl font-bold truncate">
                                                {card.data} {card.unit || ""}
                                            </div>
                                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                                {card.sub}
                                            </p>
                                            {card.extra && (
                                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                                                    {card.extra}
                                                </p>
                                            )}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
