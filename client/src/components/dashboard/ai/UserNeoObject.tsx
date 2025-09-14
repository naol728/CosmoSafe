/* eslint-disable */
"use client";

import useUserNeoObject from "@/hooks/spacehooks/useUserNeoObject";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AiButton from "@/components/AIButton";
import AiChat from "../discovere/AiSupport";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserNeo } from "@/services/spaceService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function UserNeoObject() {
    const { userNeoObjects, userNeoLoading } = useUserNeoObject();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteUserNeo,
        onSuccess: () => {
            toast.success("✅ Near-Earth Object deleted");
            queryClient.invalidateQueries({ queryKey: ["userNeoObjects"] });
        },
        onError: (err: any) => {
            toast.error(err.message);
        },
    });

    if (userNeoLoading)
        return <p className="text-muted-foreground">Loading Near-Earth objects...</p>;

    if (!userNeoObjects || userNeoObjects.length === 0)
        return (
            <div className="text-center py-16 border rounded-lg bg-muted/20">
                <p className="text-lg text-muted-foreground">
                    ☄️ No Near-Earth Objects recorded.
                </p>
            </div>
        );

    return (
        <div className="p-6 space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">
                    ☄️ Saved Near-Earth Objects
                </h2>

                <Sheet>
                    <SheetTrigger asChild>
                        <AiButton className="px-6 py-2">
                            🤖 Run AI Analysis
                        </AiButton>
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        className="w-full sm:w-[480px] lg:w-[550px] p-6"
                    >
                        <AiChat
                            metadata={userNeoObjects}
                            title="AI NEO Insights"
                            description="Ask AI to analyze Near-Earth Objects, potential risks, velocity, and orbital details."
                            placeholder="Ask about hazardous NEOs, velocity risks, or orbit patterns..."
                        />
                    </SheetContent>
                </Sheet>
            </div>

            {/* NEO Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userNeoObjects.map((neo: any) => (
                    <Card
                        key={neo.id}
                        className="shadow-sm border hover:shadow-lg transition-all duration-200"
                    >
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center justify-between gap-2">
                                <span className="truncate">{neo.name}</span>
                                <Badge variant={neo.isPotentiallyHazardous ? "destructive" : "secondary"}>
                                    {neo.isPotentiallyHazardous ? "⚠️ Hazardous" : "✅ Safe"}
                                </Badge>
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                                Close Approach: {new Date(neo.closeApproachDate).toLocaleDateString()}
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-3 text-sm">
                            <p>💡 <span className="font-medium">Magnitude:</span> {neo.magnitude}</p>
                            <p>🌍 <span className="font-medium">Orbiting Body:</span> {neo.orbitingBody}</p>
                            <p>🚀 <span className="font-medium">Velocity:</span> {neo.relativeVelocity.toLocaleString()} km/h</p>
                            <p>📏 <span className="font-medium">Miss Distance:</span> {neo.missDistance.toLocaleString()} km</p>

                            <a
                                href={neo.nasaJplUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 text-xs hover:underline"
                            >
                                🔗 View NASA JPL Details
                            </a>

                            {/* Footer Actions */}
                            <div className="flex justify-end mt-4">
                                <Button
                                    onClick={() => mutate(neo.id)}
                                    disabled={isPending}
                                    variant="destructive"
                                    size="icon"
                                    aria-label="Delete Near-Earth Object"
                                    className="h-8 w-8"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
