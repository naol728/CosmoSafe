"use client"

import { useState, useMemo } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import {
    Breadcrumb,
    BreadcrumbItem,

    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"



async function fetchArticles({ pageParam = "https://api.spaceflightnewsapi.net/v4/articles/?limit=10&offset=0" }) {
    const res = await fetch(pageParam)
    if (!res.ok) throw new Error("Failed to fetch")
    return res.json()
}

export default function Dashboard() {
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("all")


    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["articles"],
        queryFn: fetchArticles,
        getNextPageParam: (lastPage) => lastPage.next || undefined,
        initialPageParam: "https://api.spaceflightnewsapi.net/v4/articles/?limit=10&offset=0",
    })


    const articles = useMemo(() => {
        return data?.pages.flatMap((page) => page.results) || []
    }, [data])


    const filteredArticles = useMemo(() => {
        return articles.filter((a) => {
            const matchesSearch =
                a.title.toLowerCase().includes(search.toLowerCase()) ||
                a.summary.toLowerCase().includes(search.toLowerCase())
            const matchesCategory = category === "all" || a.news_site === category
            return matchesSearch && matchesCategory
        })
    }, [articles, search, category])


    const categories = useMemo(() => {
        const sites = new Set(articles.map((a) => a.news_site))
        return ["all", ...Array.from(sites)]
    }, [articles])

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="p-6 max-w-6xl mx-auto">


                {/* Page Title */}
                <h1 className="text-3xl font-bold mb-6">🚀 Space & Earth News</h1>

                {/* Breadcrumb */}
                <Breadcrumb className="mb-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link to="/dashboard" className="text-blue-500 hover:underline">
                                Dashboard
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <Input
                        placeholder="Search articles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1"
                    />

                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by site" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((c) => (
                                <SelectItem key={c} value={c}>
                                    {c}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Articles */}
                {isLoading && <p>Loading...</p>}
                {isError && <p className="text-red-500">Failed to load articles.</p>}

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredArticles.map((article) => (
                        <Card key={article.id} className="overflow-hidden hover:shadow-lg transition">
                            <img
                                src={article.image_url}
                                alt={article.title}
                                className="w-full h-40 object-cover"
                            />
                            <CardHeader>
                                <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-3">{article.summary}</p>
                                <p className="mt-2 text-xs text-gray-400">
                                    {new Date(article.published_at).toLocaleString()} · {article.news_site}
                                </p>
                                <Link
                                    to={`/dashboard/articles/${article.id}`}
                                    className="text-blue-500 text-sm font-medium hover:underline"
                                >
                                    Read more →
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-center mt-8">
                    {hasNextPage && (
                        <Button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                        >
                            {isFetchingNextPage && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                            Load more
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
