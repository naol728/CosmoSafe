/* eslint-disable */
"use client";

import useEarthquakedb from "@/hooks/earthhooks/useEarthquakedb";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AiButton from "@/components/AIButton";
import AiChat from "../discovere/AiSupport";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserEarthQuake } from "@/services/earthService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

export default function UserEarthquake() {
    const { eqdb, eqdberror, eqdbloading } = useEarthquakedb();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteUserEarthQuake,
        onSuccess: () => {
            toast.success("✅ Earthquake deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["earthquakedb"] });
        },
        onError: (err: any) => {
            toast.error(err.message);
        },
    });

    if (eqdbloading)
        return <div className="flex justify-center items-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading...</span>
        </div>
    if (eqdberror)
        return <p className="text-red-500">❌ Failed to load earthquakes.</p>;

    const earthquakes = eqdb || [];

    return (
        <div className="p-6 space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">
                    🌋 Saved Earthquakes
                </h2>

                {earthquakes.length > 0 && (
                    <Sheet>
                        <SheetTrigger asChild>
                            <AiButton className="px-6 py-2">
                                🤖 Run AI Analytics
                            </AiButton>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-full sm:w-[480px] lg:w-[550px] p-6"
                        >
                            <AiChat
                                metadata={earthquakes}
                                title="AI Earthquake Insights"
                                description="Ask AI to analyze recorded earthquakes, identify patterns, risks, and potential impacts."
                                placeholder="Ask about magnitude trends, depth correlations, or regional risks..."
                            />
                        </SheetContent>
                    </Sheet>
                )}
            </div>

            {/* Empty State */}
            {earthquakes.length === 0 ? (
                <div className="text-center py-16 border rounded-lg bg-muted/20">
                    <p className="text-lg text-muted-foreground">
                        No earthquakes recorded yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {earthquakes.map((quake: any) => (
                        <Card
                            key={quake.id}
                            className="shadow-sm border hover:shadow-lg transition-all duration-200"
                        >
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold line-clamp-1">
                                    {quake.place}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(quake.time).toLocaleString()}
                                </p>
                            </CardHeader>

                            <CardContent className="space-y-3 text-sm">
                                <p>🌍 <span className="font-medium">Lat:</span> {quake.latitude}, <span className="font-medium">Lng:</span> {quake.longitude}</p>
                                <p>📏 <span className="font-medium">Depth:</span> {quake.depth} km</p>
                                <p>💥 <span className="font-medium">Magnitude:</span> {quake.magnitude}</p>

                                <a
                                    href={quake.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 text-xs hover:underline"
                                >
                                    🌐 View details
                                </a>

                                {/* Footer Actions */}
                                <div className="flex justify-end mt-4">
                                    <Button
                                        onClick={() => mutate(quake.id)}
                                        disabled={isPending}
                                        variant="destructive"
                                        size="icon"
                                        aria-label="Delete Earthquake"
                                        className="h-8 w-8"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
