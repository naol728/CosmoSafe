/* eslint-disable */
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Suspense, useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import TopMetrics from "@/components/dashboard/earth/TopMetrics";
import WeatherForcast from "@/components/dashboard/earth/WeatherForcast";
import FloodForcast from "@/components/dashboard/earth/FloodForcast";
import EarthquakeList from "@/components/dashboard/earth/EarthquakeList";
import DisasterList from "@/components/dashboard/earth/DisasterList";

const locations = [
    { name: "Addis Ababa", lat: 9.03, lon: 38.74 },
    { name: "Nairobi", lat: -1.29, lon: 36.82 },
    { name: "Cairo", lat: 30.04, lon: 31.24 },
    { name: "Johannesburg", lat: -26.20, lon: 28.04 },
    { name: "Lagos", lat: 6.52, lon: 3.37 },
    { name: "London", lat: 51.51, lon: -0.13 },
    { name: "New York", lat: 40.71, lon: -74.01 },
    { name: "Tokyo", lat: 35.68, lon: 139.69 },
    { name: "Dubai", lat: 25.27, lon: 55.30 },
];

export default function Earth() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState<{ lat: number; lon: number }>(locations[0]);
    const [openDialog, setOpenDialog] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState("");

    const limit = 10;

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                    setOpenDialog(false);
                },
                () => {

                    setLocation(locations[0]);
                }
            );
        }
    }, []);

    const handleManualSelect = () => {
        const loc = locations.find((l) => l.name === selectedLocation);
        if (loc) {
            setLocation({ lat: loc.lat, lon: loc.lon });
            setOpenDialog(false);
        }
    };

    return (
        <>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="bg-neutral-900 border border-neutral-700 backdrop-blur-xl rounded-2xl shadow-xl text-white">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-white">
                            🌍 Choose Your Location
                        </DialogTitle>
                        <p className="text-sm text-neutral-400">
                            Use geolocation or pick a city manually.
                        </p>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        {/* Geolocation Button - default colors */}
                        <Button
                            onClick={() => {
                                if (navigator.geolocation) {
                                    navigator.geolocation.getCurrentPosition(
                                        (pos) => {
                                            setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                                            setOpenDialog(false);
                                        },
                                        () => {
                                            setLocation(locations[0]);
                                            setOpenDialog(false);
                                        }
                                    );
                                }
                            }}
                            className="w-full"
                        >
                            📍 Use My Location
                        </Button>

                        {/* City selection dropdown */}
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full border border-neutral-600 rounded-xl p-2 bg-neutral-800 text-white focus:ring-2 focus:ring-pink-500"
                        >
                            <option value="">-- Select a city --</option>
                            {locations.map((loc) => (
                                <option key={loc.name} value={loc.name}>
                                    {loc.name}
                                </option>
                            ))}
                        </select>

                        {/* Confirm Button - default colors */}
                        <Button
                            onClick={handleManualSelect}
                            disabled={!selectedLocation}
                            className="w-full"
                        >
                            ✅ Confirm Selection
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>



            <div className="p-6 space-y-10 bg-background text-foreground">
                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        onClick={() => setOpenDialog(true)}
                        className="border-pink-400 text-pink-600 hover:bg-pink-50 rounded-xl"
                    >
                        🌍 Change Location
                    </Button>
                </div>

                <Suspense fallback={<Skeleton className="h-32 w-full rounded-xl" />}>
                    <TopMetrics location={location} page={page} search={search} />
                </Suspense>
                <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-xl" />}>
                    <WeatherForcast location={location} page={page} search={search} limit={limit} />
                </Suspense>
                <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-xl" />}>
                    <FloodForcast location={location} page={page} search={search} limit={limit} />
                </Suspense>
                <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-xl" />}>
                    <EarthquakeList location={location} page={page} search={search} limit={limit} />
                </Suspense>

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="🔍 Search events..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border-pink-300 focus:ring-pink-400"
                        />
                        <Button onClick={() => setPage(1)} className="bg-pink-500 text-white hover:bg-pink-600">
                            Search
                        </Button>
                    </div>

                    <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-xl" />}>
                        <DisasterList
                            location={location}
                            page={page}
                            search={search}
                            limit={limit}
                            setPage={setPage}
                        />
                    </Suspense>
                </div>
            </div>
        </>
    );
}
