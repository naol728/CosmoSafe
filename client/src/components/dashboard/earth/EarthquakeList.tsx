/* eslint-disable */
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
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
import { Save } from "lucide-react";
import useEarthquakedb from "@/hooks/earthhooks/useEarthquakedb";


export default function EarthquakeList({ location, page, limit, search }: { location: { lat: number; lon: number } | null, page: number, search: string, limit: number }) {
    const queryClient = useQueryClient();
    const { isPending, mutate } = useMutation({

        mutationFn: addEarthquake,
        mutationKey: ["addEarthquake"],
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({ queryKey: ["earthquake"] })
        },
        onError: (error) => {
            console.log(error)
            toast.error(error.message)
        }
    })
    const { eqdb, eqdberror, eqdbloading } = useEarthquakedb()


    function handleaddEarthqueke(eq: any) {
        const { id,
            magnitude,
            place,
            time,
            url, } = eq
        mutate({
            id,
            magnitude,
            place,
            time,
            depth: eq.coordinates.depth,
            latitude: eq.coordinates.lat,
            longitude: eq.coordinates.lon,
            url,
        })
    }

    const { earthquake, earthquakeloading, earthquekeerr } = useEarthQuake({
        location,
        page,
        limit,
        search,
    })
    console.log(eqdb)
    console.group(earthquake)


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
                                    <TableHead>Source </TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Depth (km)</TableHead>
                                    <TableHead>Save for Analytics </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {earthquake?.earthquakes?.length > 0 ? (
                                    earthquake.earthquakes.map((eq: any) => {
                                        const existsInDb = eqdb?.some((dbEq: any) => dbEq.id === eq.id);

                                        return (
                                            <TableRow
                                                key={eq.id}
                                                className="hover:bg-muted/50 transition-colors"
                                            >
                                                <TableCell className="font-bold text-red-500">
                                                    {eq.magnitude}
                                                </TableCell>
                                                <TableCell>{eq.place}</TableCell>
                                                <TableCell>
                                                    <a target="_blank" href={eq.url}>click here</a>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(eq.time).toLocaleString()}
                                                </TableCell>
                                                <TableCell>{eq.coordinates.depth} km</TableCell>
                                                <TableCell>
                                                    <Button
                                                        onClick={() => handleaddEarthqueke(eq)}
                                                        disabled={isPending || existsInDb}
                                                    >
                                                        {existsInDb ? "Saved" : <Save />}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            No earthquakes found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>

                        </Table>
                    </CardContent>
                </Card>
            )}
        </>
    )
}
