/* eslint-disable */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDisaster } from "@/hooks/earthhooks/useDisaster";
import useUserDisaster from "@/hooks/earthhooks/useUserDisaster";
import { addDisaster } from "@/services/earthService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function DisasterList({ location, page, limit, search, setPage }: { location: { lat: number; lon: number } | null, page: number, search: string, limit: number, setPage: any }) {
    const { disaster: disasters, loadingdiaster: disastersLoading, disastererr: disastersError } = useDisaster({ location, page, limit, search });
    const queryClient = useQueryClient();
    const { userdisaster } = useUserDisaster()
    console.log(userdisaster)

    const { mutate, isPending } = useMutation({
        mutationFn: addDisaster,
        mutationKey: ["addDisaster"],
        onSuccess: () => {
            toast.success("Successfully saved");
            queryClient.invalidateQueries({ queryKey: ["userdisaster"] });
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error.message);
        }
    });

    const handleAddDisaster = (disaster: any) => {
        mutate(disaster);
    };

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
                                    <TableHead>Coordinates</TableHead>
                                    <TableHead>Sources</TableHead>
                                    <TableHead>Magnitude</TableHead>
                                    <TableHead>Save</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {disasters?.length > 0 ? (
                                    disasters.map((d: any) => {
                                        const categoryId = d.categories?.[0]?.id;
                                        const categoryTitle = d.categories?.[0]?.title;
                                        const firstGeometry = d.geometry?.[0];
                                        const coords = firstGeometry?.coordinates || [];
                                        const date = firstGeometry?.date ? new Date(firstGeometry.date).toLocaleString() : "N/A";


                                        const isSaved = userdisaster?.disasters?.some((ud: any) => ud.id === d.id);

                                        return (
                                            <TableRow key={d.id} className="hover:bg-muted/50 transition-colors">
                                                <TableCell>
                                                    <a href={d.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{d.title}</a>
                                                </TableCell>
                                                <TableCell>{categoryTitle || "N/A"}</TableCell>
                                                <TableCell>{date}</TableCell>
                                                <TableCell>{coords.length === 2 ? `${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}` : "N/A"}</TableCell>
                                                <TableCell>
                                                    {d.sources?.map((s: any, idx: number) => (
                                                        <div key={idx}>
                                                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{s.id}</a>
                                                        </div>
                                                    )) || "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {categoryId === "wildfires" ? "N/A" : firstGeometry?.magnitudeValue ? `${firstGeometry.magnitudeValue} ${firstGeometry.magnitudeUnit || ""}` : "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    <Button onClick={() => handleAddDisaster(d)} disabled={isPending || isSaved}>
                                                        {isSaved ? <><Save /> Saved</> : <><Save /> Save </>}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center">No events found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>

                        </Table>

                        <div className="flex justify-between mt-6">
                            <Button disabled={page === 1} onClick={() => setPage((p: any) => Math.max(1, p - 1))} variant="outline">Previous</Button>
                            <p className="text-sm text-muted-foreground">Page {page}</p>
                            <Button onClick={() => setPage((p: any) => p + 1)}>Next</Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
