/* eslint-disable */
"use client"

import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


async function fetchArticle(id: string) {
    const res = await fetch(`https://api.spaceflightnewsapi.net/v4/articles/${id}/`)
    if (!res.ok) throw new Error("Failed to fetch article")
    return res.json()
}

export default function ArticleDetail() {
    const { id } = useParams<{ id: string }>()

    const { data: article, isLoading, isError } = useQuery({
        queryKey: ["article", id],
        queryFn: () => fetchArticle(id!),
        enabled: !!id,
    })

    if (isLoading) {
        return <p className="flex items-center gap-2 text-gray-400"><Loader2 className="animate-spin w-4 h-4" /> Loading...</p>
    }
    if (isError) {
        return <p className="text-red-500">❌ Failed to load article.</p>
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Link to="/dashboard">Dashboard</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{article.title.slice(0, 30)}...</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Back button */}
            <Link to="/dashboard" className="inline-flex items-center text-blue-400 hover:underline mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to articles
            </Link>

            {/* Article card */}
            <Card className="overflow-hidden">
                <img src={article.image_url} alt={article.title} className="w-full h-72 object-cover" />
                <CardHeader>
                    <CardTitle className="text-2xl">{article.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {new Date(article.published_at).toLocaleString()} · {article.news_site}
                    </p>
                </CardHeader>
                <CardContent>
                    <p className="text-lg mb-4">{article.summary}</p>

                    {article.authors?.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Authors</h3>
                            <ul className="space-y-1">
                                {article.authors.map((author: any, i: number) => (
                                    <li key={i} className="text-sm">
                                        👤 {author.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {article.launches?.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Launches</h3>
                            <ul className="space-y-1">
                                {article.launches.map((l: any, i: number) => (
                                    <li key={i} className="text-sm">🚀 {l.provider} ({l.launch_id})</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-block text-blue-500 hover:underline"
                    >
                        Read full article →
                    </a>
                </CardContent>
            </Card>
        </div>
    )
}
