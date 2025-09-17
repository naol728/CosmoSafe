/* eslint-disable */
"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useEarthQuake } from "@/hooks/earthhooks/useEarthquake";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addEarthquake } from "@/services/earthService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Save, Map as MapIcon } from "lucide-react";
import useEarthquakedb from "@/hooks/earthhooks/useEarthquakedb";
import { useState } from "react";

import MapGL, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function EarthquakeList({
    location,
    page: initialPage,
    limit,
    search,
}: {
    location: { lat: number; lon: number } | null;
    page: number;
    search: string;
    limit: number;
}) {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(initialPage);

    const { isPending, mutate } = useMutation({
        mutationFn: addEarthquake,
        mutationKey: ["addEarthquake"],
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["earthquake"] });
        },
        onError: (error: any) => {
            console.log(error);
            toast.error(error.message);
        },
    });

    const { eqdb } = useEarthquakedb();
    const { earthquake, earthquakeloading, earthquekeerr } = useEarthQuake({
        location,
        page,
        limit,
        search,
    });

    const total = earthquake?.total || 0;
    const totalPages = Math.ceil(total / limit);

    // State for toggling maps
    const [openMaps, setOpenMaps] = useState<Record<string, boolean>>({});

    const toggleMap = (id: string) => {
        setOpenMaps((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    function handleAddEarthquake(eq: any) {
        const { id, magnitude, place, time, url } = eq;
        mutate({
            id,
            magnitude,
            place,
            time,
            depth: eq.coordinates.depth,
            latitude: eq.coordinates.lat,
            longitude: eq.coordinates.lon,
            url,
        });
    }

    return (
        <>
            {earthquakeloading ? (
                <Skeleton className="h-[500px] w-full rounded-xl" />
            ) : earthquekeerr ? (
                <p className="text-destructive">Error loading earthquakes</p>
            ) : (
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>🌍 Nearby Earthquakes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Magnitude</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Source</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Depth (km)</TableHead>
                                    <TableHead>Save</TableHead>
                                    <TableHead>Map</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {earthquake?.earthquakes?.length > 0 ? (
                                    earthquake.earthquakes.map((eq: any) => {
                                        const existsInDb = eqdb?.some(
                                            (dbEq: any) => dbEq.id === eq.id
                                        );

                                        return (
                                            <>
                                                <TableRow
                                                    key={eq.id}
                                                    className="hover:bg-muted/50 transition-colors"
                                                >
                                                    <TableCell className="font-bold text-red-500">
                                                        {eq.magnitude}
                                                    </TableCell>
                                                    <TableCell>{eq.place}</TableCell>
                                                    <TableCell>
                                                        <a target="_blank" href={eq.url}>
                                                            click here
                                                        </a>
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(eq.time).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>{eq.coordinates.depth} km</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            onClick={() => handleAddEarthquake(eq)}
                                                            disabled={isPending || existsInDb}
                                                        >
                                                            {existsInDb ? (
                                                                <>
                                                                    <Save /> Saved
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Save /> Save
                                                                </>
                                                            )}
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        {eq.coordinates.lat && eq.coordinates.lon && (
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => toggleMap(eq.id)}
                                                                className="flex items-center gap-1"
                                                            >
                                                                <MapIcon className="w-4 h-4" />
                                                                {openMaps[eq.id] ? "Hide Map" : "Show Map"}
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>

                                                {/* Map Row */}
                                                {openMaps[eq.id] &&
                                                    eq.coordinates.lat &&
                                                    eq.coordinates.lon && (
                                                        <TableRow>
                                                            <TableCell colSpan={7}>
                                                                <div className="h-[300px] w-full rounded-lg overflow-hidden border">
                                                                    <MapGL
                                                                        mapboxAccessToken={
                                                                            import.meta.env
                                                                                .VITE_PUBLIC_MAPBOX_TOKEN
                                                                        }
                                                                        initialViewState={{
                                                                            longitude: eq.coordinates.lon,
                                                                            latitude: eq.coordinates.lat,
                                                                            zoom: 5,
                                                                        }}
                                                                        mapStyle="mapbox://styles/mapbox/streets-v11"
                                                                        style={{ width: "100%", height: "100%" }}
                                                                    >
                                                                        <Marker
                                                                            longitude={eq.coordinates.lon}
                                                                            latitude={eq.coordinates.lat}
                                                                        >
                                                                            <div className="w-3 h-3 bg-red-500 rounded-full border border-white" />
                                                                        </Marker>
                                                                    </MapGL>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                            </>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center">
                                            No earthquakes found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <CardFooter className="flex justify-between items-center">
                            <Button
                                variant="outline"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <span>
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Next
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            )}
        </>
    );
}
