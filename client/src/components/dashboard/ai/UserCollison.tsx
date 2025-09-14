/* eslint-disable */
"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useUserCollision from "@/hooks/spacehooks/useUserCollision";
import AiButton from "@/components/AIButton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AiSupport from "../discovere/AiSupport";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserCollision } from "@/services/spaceService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function UserCollision() {
    const { usercollisonsRaw, usercollisionsLoading } = useUserCollision();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteUserCollision,
        onSuccess: () => {
            toast.success("✅ Collision deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["userCollisionAlerts"] });
        },
        onError: (err: any) => {
            toast.error(err.message);
        },
    });

    const usercollisons = usercollisonsRaw?.collision || [];

    if (usercollisionsLoading)
        return (
            <div className="p-6 flex justify-center items-center">
                <p className="text-muted-foreground animate-pulse">
                    🚀 Loading satellite collision events...
                </p>
            </div>
        );

    if (!usercollisons || usercollisons.length === 0)
        return (
            <div className="p-6 text-center py-16 border rounded-lg bg-muted/20">
                <p className="text-lg text-muted-foreground">
                    No collision events recorded.
                </p>
            </div>
        );

    return (
        <div className="p-6 space-y-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">
                    🛰️ Satellite Collision Events
                </h2>

                <Sheet>
                    <SheetTrigger asChild>
                        <AiButton className="px-6 py-2">🤖 Run AI Analytics</AiButton>
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        className="w-full sm:w-[480px] lg:w-[550px] p-6 overflow-y-auto"
                    >
                        <h3 className="text-xl font-semibold mb-4">AI Collision Insights</h3>
                        <AiSupport
                            metadata={usercollisons}
                            title="AI Collision Analysis"
                            description="Ask AI about potential risks and insights for these collisions."
                            placeholder="Ask about collision probabilities or risk mitigation..."
                        />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Collision Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {usercollisons.map((collision: any) => (
                    <Card
                        key={collision.id}
                        className="shadow-sm border hover:shadow-lg transition-all duration-200"
                    >
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center justify-between">
                                <span className="line-clamp-1">
                                    {collision.sat1Name} <span className="text-muted-foreground">vs</span>{" "}
                                    {collision.sat2Name}
                                </span>
                                {collision.emergencyReportable ? (
                                    <Badge variant="destructive">⚠️ Emergency</Badge>
                                ) : (
                                    <Badge variant="secondary">Normal</Badge>
                                )}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="font-medium">TCA:</span>{" "}
                                {new Date(collision.tca).toLocaleString()}
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Satellite 1 */}
                                <div className="space-y-1">
                                    <p className="font-medium text-muted-foreground">🚀 Satellite 1</p>
                                    <p>{collision.sat1Name} ({collision.sat1Type})</p>
                                    <p>RCS: {collision.sat1Rcs}</p>
                                    <p>Excl. Volume: {collision.sat1ExclVol} km</p>
                                </div>
                                {/* Satellite 2 */}
                                <div className="space-y-1">
                                    <p className="font-medium text-muted-foreground">🛰️ Satellite 2</p>
                                    <p>{collision.sat2Name} ({collision.sat2Type})</p>
                                    <p>RCS: {collision.sat2Rcs}</p>
                                    <p>Excl. Volume: {collision.sat2ExclVol} km</p>
                                </div>
                            </div>

                            <div className="pt-3 border-t text-sm space-y-1">
                                <p>
                                    <span className="font-medium">Min Range:</span> {collision.minRangeKm} km
                                </p>
                                <p>
                                    <span className="font-medium">Probability:</span>{" "}
                                    {parseFloat(collision.probability).toExponential(2)}
                                </p>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex justify-end mt-3">
                                <Button
                                    onClick={() => mutate(collision.cdmId)}
                                    disabled={isPending}
                                    variant="destructive"
                                    size="icon"
                                    aria-label="Delete Collision"
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
