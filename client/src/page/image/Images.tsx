/* eslint-disable */
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type ApodResponse = {
    date: string;
    explanation: string;
    hdurl?: string;
    media_type: "image" | "video";
    title: string;
    url: string;
    copyright?: string;
};

// Fetch 10 random APODs each time
const fetchAPODs = async ({ pageParam = 10 }): Promise<ApodResponse[]> => {
    const res = await fetch(
        `https://api.nasa.gov/planetary/apod?count=${pageParam}&api_key=DEMO_KEY`
    );
    if (!res.ok) {
        throw new Error("Failed to fetch APODs");
    }
    const data: ApodResponse[] = await res.json();
    return data.filter((item) => item.media_type === "image");
};

export default function Images() {
    const {
        data,
        fetchNextPage,

        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["apod-infinite"],
        queryFn: fetchAPODs,
        initialPageParam: 10,
        getNextPageParam: () => 10, // always fetch 10 more
    });

    if (status === "pending") return <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading....
    </div>
    if (status === "error")
        return <p className="text-center text-red-500">Error loading images</p>;

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.pages.map((page, pageIndex) =>
                    page.map((item, idx) => (
                        <Card key={`${pageIndex}-${idx}`} className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                                <p className="text-xs text-muted-foreground">{item.date}</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <img
                                    src={item.hdurl || item.url}
                                    alt={item.title}
                                    className="w-full h-60 object-cover rounded-lg shadow"
                                />
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {item.explanation}
                                </p>
                                {item.copyright && (
                                    <p className="text-xs text-right text-muted-foreground">
                                        © {item.copyright}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <div className="flex justify-center mt-6">
                <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    {isFetchingNextPage ? "Loading more..." : "Load More"}
                </Button>
            </div>
        </div>
    );
}
