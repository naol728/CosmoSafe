"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function DataSource() {
    return (
        <div className="flex items-center justify-center min-h-[60vh] p-6">
            <Card className="max-w-md w-full text-center shadow-lg border border-dashed border-gray-300 bg-muted/30">
                <CardContent className="p-10 space-y-6">
                    <div className="flex justify-center">
                        <Clock className="h-16 w-16 text-muted-foreground animate-pulse" />
                    </div>
                    <h1 className="text-2xl font-bold">Data Source Management</h1>
                    <p className="text-muted-foreground">
                        This feature is under development. 🚀
                        Stay tuned for updates!
                    </p>
                    <div className="mt-4">
                        <span className="inline-block px-4 py-2 text-sm font-medium rounded-full bg-primary/10 text-primary">
                            Coming Soon
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
