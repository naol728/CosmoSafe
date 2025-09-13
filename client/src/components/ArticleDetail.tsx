/* eslint-disable */
"use client"

import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import { fetchArticleById } from "@/services/spaceService"

export default function ArticleDetail() {
    const { id } = useParams<{ id: string }>()

    const { data: article, isLoading, isError } = useQuery({
        queryKey: ["article", id],
        queryFn: () => fetchArticleById(id!),
        enabled: !!id,
    })

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
            </div>
        )
    }

    if (isError) {
        return (
            <p className="text-red-500 text-center py-20">❌ Failed to load article.</p>
        )
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">

            {/* Back button */}
            <Link
                to="/dashboard"
                className="inline-flex items-center text-blue-500 hover:underline font-medium mb-2"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to articles
            </Link>

            {/* Header image */}
            <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                    <span className="text-white text-sm bg-blue-500/80 px-2 py-1 rounded">{article.news_site}</span>
                </div>
            </div>

            {/* Article title & metadata */}
            <Card className="shadow-md">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-3xl font-bold">{article.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {new Date(article.published_at).toLocaleString()}
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Summary */}
                    <p className="text-lg">{article.summary}</p>

                    {/* Authors */}
                    {article.authors?.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2 text-lg">Authors</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {article.authors.map((author: any, i: number) => (
                                    <div key={i} className="p-2 border rounded shadow-sm hover:shadow-md transition">
                                        👤 {author.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Launches */}
                    {article.launches?.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2 text-lg">Launches</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {article.launches.map((l: any, i: number) => (
                                    <div key={i} className="p-2 border rounded shadow-sm hover:shadow-md transition">
                                        🚀 {l.provider} ({l.launch_id})
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Full article link */}
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-blue-500 hover:underline font-medium"
                    >
                        Read full article →
                    </a>

                </CardContent>
            </Card>
        </div>
    )
}
