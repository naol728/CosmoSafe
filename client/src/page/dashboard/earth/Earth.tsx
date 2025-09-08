/* eslint-disable */
"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Suspense, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import TopMetrics from "@/components/dashboard/earth/TopMetrics";
import WeatherForcast from "@/components/dashboard/earth/WeatherForcast";
import FloodForcast from "@/components/dashboard/earth/FloodForcast";
import EarthquakeList from "@/components/dashboard/earth/EarthquakeList";
import DisasterList from "@/components/dashboard/earth/DisasterList";

export default function Earth() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
        null
    );
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
    return (
        <>
            {/* Location Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="bg-background/95 backdrop-blur-xl border-border">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">
                            🌍 Allow Location Access
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            To personalize forecasts and show nearby disasters, we need your
                            location.
                        </p>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={askLocation} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Allow
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="p-6 space-y-10 bg-background text-foreground">
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
                        />
                        <Button onClick={() => setPage(1)}>Search</Button>
                    </div>

                    <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-xl" />}>
                        <DisasterList location={location} page={page} search={search} limit={limit} setPage={setPage} />
                    </Suspense>
                </div>
            </div>
        </>
    );
}
