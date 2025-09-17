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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const locations = [
    { name: "Addis Ababa", lat: 9.03, lon: 38.74 },
    { name: "Nairobi", lat: -1.29, lon: 36.82 },
    { name: "Cairo", lat: 30.04, lon: 31.24 },
    { name: "Johannesburg", lat: -26.2, lon: 28.04 },
    { name: "Lagos", lat: 6.52, lon: 3.37 },
    { name: "London", lat: 51.51, lon: -0.13 },
    { name: "New York", lat: 40.71, lon: -74.01 },
    { name: "Tokyo", lat: 35.68, lon: 139.69 },
    { name: "Dubai", lat: 25.27, lon: 55.3 },
    { name: "Paris", lat: 48.86, lon: 2.35 },
    { name: "Berlin", lat: 52.52, lon: 13.4 },
    { name: "Moscow", lat: 55.75, lon: 37.62 },
];

export default function Earth() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState<{ lat: number; lon: number }>(
        locations[0]
    );
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
            {/* Location Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="bg-background border border-border backdrop-blur-xl rounded-2xl shadow-xl text-foreground w-full max-w-md mx-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-primary">
                            🌍 Choose Your Location
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            Use geolocation or pick a city manually.
                        </p>
                    </DialogHeader>

                    <div className="space-y-4 mt-6">
                        <Button
                            onClick={() => {
                                if (navigator.geolocation) {
                                    navigator.geolocation.getCurrentPosition(
                                        (pos) => {
                                            setLocation({
                                                lat: pos.coords.latitude,
                                                lon: pos.coords.longitude,
                                            });
                                            setOpenDialog(false);
                                        },
                                        () => {
                                            setLocation(locations[0]);
                                            setOpenDialog(false);
                                        }
                                    );
                                }
                            }}
                            className="w-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                        >
                            📍 Use My Location
                        </Button>

                        <Select
                            value={selectedLocation}
                            onValueChange={(val) => setSelectedLocation(val)}
                        >
                            <SelectTrigger className="w-full border border-border rounded-xl bg-background text-foreground">
                                <SelectValue placeholder="-- Select a city --" />
                            </SelectTrigger>
                            <SelectContent className="bg-background text-foreground max-h-60 overflow-auto">
                                {locations.map((loc) => (
                                    <SelectItem key={loc.name} value={loc.name}>
                                        {loc.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            onClick={handleManualSelect}
                            disabled={!selectedLocation}
                            className="w-full bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90"
                        >
                            ✅ Confirm Selection
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Main Dashboard */}
            <div className="p-4  md:p-8 space-y-2 bg-background min-h-screen text-foreground">
                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        onClick={() => setOpenDialog(true)}
                        className="border-primary text-primary hover:bg-primary/10 rounded-xl"
                    >
                        🌍 Change Location
                    </Button>
                </div>

                {/* Top Metrics */}
                <Suspense fallback={<Skeleton className="h-32 w-full rounded-xl" />}>
                    <TopMetrics location={location} page={page} search={search} />
                </Suspense>

                {/* Forecasts Grid - Responsive */}
                <div className="flex flex-col  md:space-x-6 gap-6">
                    {/* Weather Forecast */}
                    <Suspense fallback={<Skeleton className="h-72 sm:h-96 w-full rounded-xl" />}>
                        <div className="flex-1 min-w-0">
                            <WeatherForcast
                                location={location}
                                page={page}
                                search={search}
                                limit={limit}
                            />
                        </div>
                    </Suspense>

                    {/* Flood Forecast */}
                    <Suspense fallback={<Skeleton className="h-72 sm:h-96 w-full rounded-xl" />}>
                        <div className="flex-1 min-w-0">
                            <FloodForcast
                                location={location}
                                page={page}
                                search={search}
                                limit={limit}
                            />
                        </div>
                    </Suspense>
                </div>


                {/* Earthquake List */}
                <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-xl" />}>
                    <EarthquakeList location={location} page={page} search={search} limit={limit} />
                </Suspense>

                {/* Search & Disaster List */}
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
                        <Input
                            placeholder="🔍 Search events..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 border-border focus:ring-primary"
                        />
                        <Button
                            onClick={() => setPage(1)}
                            className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                        >
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
