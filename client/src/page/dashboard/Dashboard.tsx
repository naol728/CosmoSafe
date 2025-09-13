/* eslint-disable */
"use client"

import { useState, useMemo } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useDebounce } from "use-debounce"
import { fetchArticles } from "@/services/spaceService"

// Article Card (no memo)
const ArticleCard = ({ article }: { article: any }) => (
    <Card className="overflow-hidden hover:shadow-lg transition">
        <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-40 object-cover"
            loading="lazy"
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
)

export default function Dashboard() {
    const [search, setSearch] = useState("")
    const [debouncedSearch] = useDebounce(search, 300)
    const [category, setCategory] = useState("all")
    const [debouncedCategory] = useDebounce(category, 200)

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ["articles"],
        queryFn: ({ pageParam = 1 }) => fetchArticles({ page: pageParam, limit: 10 }),
        getNextPageParam: lastPage => lastPage.page * lastPage.limit < lastPage.total ? lastPage.page + 1 : undefined,
        initialPageParam: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes caching
        // keepPreviousData: true,
    })

    const articles = useMemo(() => data?.pages.flatMap(page => page.results) || [], [data])

    const filteredArticles = useMemo(() => {
        return articles.filter(a => {
            const matchesSearch =
                a.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                a.summary.toLowerCase().includes(debouncedSearch.toLowerCase())
            const matchesCategory = debouncedCategory === "all" || a.news_site === debouncedCategory
            return matchesSearch && matchesCategory
        })
    }, [articles, debouncedSearch, debouncedCategory])

    const categories = useMemo(() => ["all", ...Array.from(new Set(articles.map(a => a.news_site)))], [articles])

    return (
        <div className="p-6 max-w-6xl mx-auto">


            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Input
                    placeholder="Search articles..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1"
                />
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by site" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="animate-pulse h-64 bg-gray-200" />
                    ))}
                </div>
            ) : isError ? (
                <p className="text-red-500">Failed to load articles.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArticles.map(article => (
                            <ArticleCard
                                key={`${article.id}-${debouncedSearch}-${debouncedCategory}`}
                                article={article}
                            />
                        ))}
                    </div>

                    {hasNextPage && (
                        <div className="flex justify-center mt-8">
                            <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                                {isFetchingNextPage && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                                Load more
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
