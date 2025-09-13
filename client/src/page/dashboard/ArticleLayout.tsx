import { Link, Outlet, useParams } from "react-router-dom"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useQuery } from "@tanstack/react-query"
import { fetchArticleById } from "@/services/spaceService"
import { Loader2 } from "lucide-react"

export default function ArticleLayout() {
    const { id } = useParams<{ id: string }>()

    const { data: article, isLoading } = useQuery({
        queryKey: ["article", id],
        queryFn: () => id ? fetchArticleById(id) : null,
        enabled: !!id,
    })

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">🚀 Space & Earth News</h1>

            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Link to="/dashboard" className="text-blue-500 hover:underline">Dashboard</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    {id ? (
                        <>
                            <BreadcrumbItem>
                                {isLoading ? (
                                    <span className="flex items-center gap-2 text-gray-400">
                                        <Loader2 className="animate-spin w-4 h-4" /> Loading...
                                    </span>
                                ) : (
                                    <BreadcrumbPage>{article.title.slice(0, 30)}...</BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                        </>
                    ) : (
                        <BreadcrumbItem>
                            <BreadcrumbPage>Articles</BreadcrumbPage>
                        </BreadcrumbItem>
                    )}
                </BreadcrumbList>
            </Breadcrumb>


            <Outlet />
        </div>
    )
}
