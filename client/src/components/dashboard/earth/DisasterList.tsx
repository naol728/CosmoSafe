/* eslint-disable */
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useDisaster } from "@/hooks/earthhooks/useDisaster";
export default function DisasterList({ location, page, limit, search, setPage }: { location: { lat: number; lon: number } | null, page: number, search: string, limit: number, setPage: any }) {
    const {
        disaster: disasters,
        loadingdiaster: disastersLoading,
        disastererr: disastersError,
    } = useDisaster({ location, page, limit, search });
    return (
        <>
            {disastersLoading ? (
                <Skeleton className="h-[500px] w-full rounded-xl" />
            ) : disastersError ? (
                <p className="text-destructive">Error loading disasters</p>
            ) : (
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>🔥 Recent Natural Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Event</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Magnitude</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {disasters?.length > 0 ? (
                                    disasters.map((d: any) => (
                                        <TableRow
                                            key={d.id}
                                            className="hover:bg-muted/50 transition-colors"
                                        >
                                            <TableCell>{d.title}</TableCell>
                                            <TableCell>
                                                {d.categories?.[0]?.title}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    d.geometry[0]?.date
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {d.geometry[0]?.magnitudeValue
                                                    ? `${d.geometry[0].magnitudeValue} ${d.geometry[0].magnitudeUnit}`
                                                    : "N/A"}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            No events found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <div className="flex justify-between mt-6">
                            <Button
                                disabled={page === 1}
                                onClick={() => setPage((p: any) => Math.max(1, p - 1))}
                                variant="outline"
                            >
                                Previous
                            </Button>
                            <p className="text-sm text-muted-foreground">Page {page}</p>
                            <Button onClick={() => setPage((p: any) => p + 1)}>
                                Next
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    )
}
