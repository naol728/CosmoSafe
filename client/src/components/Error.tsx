import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorComponentProps {
    message?: string;
    onRetry?: () => void;
}

export default function Error({ message = "Something went wrong.", onRetry }: ErrorComponentProps) {
    return (
        <div className="flex justify-center items-center h-full">
            <Card className="max-w-sm w-full border-red-500">
                <CardHeader className="flex flex-col items-center text-center">
                    <AlertCircle className="text-red-500 w-12 h-12 mb-2" />
                    <CardTitle className="text-red-600">Error</CardTitle>
                    <CardDescription>{message}</CardDescription>
                </CardHeader>
                {onRetry && (
                    <CardContent className="flex justify-center">
                        <Button variant="destructive" onClick={onRetry}>
                            Retry
                        </Button>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
