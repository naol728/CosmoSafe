/* eslint-disable */
"use client";

import useUserDisaster from "@/hooks/earthhooks/useUserDisaster";
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
import { deleteUserDisaster } from "@/services/earthService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function UserDisaster() {
    const { userdisaster, udloading, uderror } = useUserDisaster();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteUserDisaster,
        mutationKey: ["deleteUserDisaster"],
        onSuccess: () => {
            toast.success("✅ Disaster deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["userdisaster"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const disasters = userdisaster?.disasters || [];

    if (udloading)
        return <p className="text-muted-foreground">Loading disasters...</p>;
    if (uderror)
        return <p className="text-red-500">❌ Failed to load disasters.</p>;

    return (
        <div className="p-6 space-y-10">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">
                    🌍 Saved Disasters
                </h2>

                {disasters.length > 0 && (
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
                                metadata={disasters}
                                title="AI Disaster Insights"
                                description="Ask AI to analyze and explain the recorded disasters with patterns, risks, and potential impacts."
                                placeholder="Ask about disaster risks, categories, or regional effects..."
                            />
                        </SheetContent>
                    </Sheet>
                )}
            </div>

            {/* Empty State */}
            {disasters.length === 0 ? (
                <div className="text-center py-16 border rounded-lg bg-muted/30">
                    <p className="text-lg text-muted-foreground">
                        🚫 No saved disasters recorded yet.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Add disasters to see them here and run AI insights.
                    </p>
                </div>
            ) : (
                /* Disaster Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {disasters.map((dis: any) => (
                        <Card
                            key={dis.id}
                            className="shadow-sm border hover:shadow-md transition-all duration-200"
                        >
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex justify-between items-center gap-2">
                                    <span className="truncate">{dis.title}</span>
                                    <Badge
                                        variant={dis.closed ? "secondary" : "destructive"}
                                        className="whitespace-nowrap"
                                    >
                                        {dis.closed ? "Closed" : "Ongoing"}
                                    </Badge>
                                </CardTitle>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(
                                        dis?.geometry?.at(0)?.date || dis.created_at
                                    ).toLocaleDateString()}
                                </p>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {/* Description */}
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {dis.description || "No description available."}
                                </p>

                                {/* Location */}
                                {dis.geometry?.[0]?.coordinates && (
                                    <p className="text-xs">
                                        📍 Location:{" "}
                                        <span className="font-medium">
                                            {dis.geometry[0].coordinates.join(", ")}
                                        </span>
                                    </p>
                                )}

                                {/* Categories */}
                                {dis.categories?.length > 0 && (
                                    <p className="text-xs">
                                        🏷 Category:{" "}
                                        <span className="font-medium">
                                            {dis.categories.map((c: any) => c.title).join(", ")}
                                        </span>
                                    </p>
                                )}

                                {/* Links */}
                                <div className="flex flex-col gap-1 mt-2">
                                    <a
                                        href={dis.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 text-xs hover:underline"
                                    >
                                        🌐 View Details
                                    </a>
                                    {dis.sources?.map((src: any, idx: number) => (
                                        <a
                                            key={idx}
                                            href={src.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 text-xs hover:underline"
                                        >
                                            Source: {src.id}
                                        </a>
                                    ))}
                                </div>

                                {/* Footer Actions */}
                                <div className="flex justify-end mt-4">
                                    <Button
                                        onClick={() => mutate(dis.id)}
                                        disabled={isPending}
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8"
                                        aria-label="Delete disaster"
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
