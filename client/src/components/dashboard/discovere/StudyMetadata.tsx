/* eslint-disable */
"use client"

import { useQuery } from "@tanstack/react-query"
import { getStudyMetadata } from "@/services/spacedataService"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Bot } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import AiSupport from "./AiSupport"

export default function StudyMetadata({ studyId }: { studyId: string }) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["study-metadata", studyId],
        queryFn: () => getStudyMetadata(studyId),
    })

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading metadata...</span>
            </div>
        )
    }

    const studyKey = data && Object.keys(data.metadata)[0]
    const studyContainer = studyKey ? data.metadata[studyKey] : null
    const study = studyContainer?.studies?.[0]

    if (isError || !study) {
        return (
            <div className="text-center py-10 text-red-500">
                Failed to fetch metadata.
            </div>
        )
    }

    // Prepare clean metadata object to pass to AI
    const metadataForAI = {
        title: study.title,
        description: study.description,
        mission: study.comments?.find((c: any) => c.name === "Mission Name")?.value,
        missionStart: study.comments?.find((c: any) => c.name === "Mission Start")?.value,
        missionEnd: study.comments?.find((c: any) => c.name === "Mission End")?.value,
        nasaCenter: study.comments?.find((c: any) => c.name === "Managing NASA Center")?.value,
        projectTitle: study.comments?.find((c: any) => c.name === "Project Title")?.value,
        funding: study.comments?.find((c: any) => c.name === "Funding")?.value,
        contributors: studyContainer.people?.map((p: any) => ({
            name: `${p.firstName} ${p.lastName}`,
            affiliation: p.affiliation
        })),
        publications: studyContainer.publications?.map((pub: any) => ({
            title: pub.title,
            doi: pub.doi,
            authors: pub.authorList
        }))
    }

    return (
        <div className="grid gap-6">
            {/* Title */}
            <Card>
                <CardHeader>
                    <CardTitle>{study.title || "Untitled Study"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{study.description}</p>
                    {study.studyDesignDescriptors?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {study.studyDesignDescriptors.map((d: any, i: number) => (
                                <Badge key={i} variant="outline">
                                    {d.annotationValue}
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Contributors */}
            {metadataForAI.contributors?.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Contributors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {metadataForAI.contributors.map((p: any, i: any) => (
                                <li key={i}>
                                    <span className="font-medium">{p.name}</span>{" "}
                                    – {p.affiliation}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Publications */}
            {metadataForAI.publications?.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Publications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {metadataForAI.publications.map((pub: any, i: any) => (
                            <div key={i}>
                                <p className="font-medium">{pub.title}</p>
                                <p className="text-sm text-muted-foreground">{pub.authors}</p>
                                <p className="text-sm">
                                    DOI:{" "}
                                    <a
                                        href={`https://doi.org/${pub.doi}`}
                                        className="text-blue-600 hover:underline"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {pub.doi}
                                    </a>
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Key Metadata + AI Support */}
            <Card>
                <CardHeader>
                    <CardTitle>Key Study Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-1 mb-6">
                        {metadataForAI.mission && (
                            <li><span className="font-semibold">Mission:</span> {metadataForAI.mission}</li>
                        )}
                        {metadataForAI.missionStart && (
                            <li><span className="font-semibold">Start:</span> {metadataForAI.missionStart}</li>
                        )}
                        {metadataForAI.missionEnd && (
                            <li><span className="font-semibold">End:</span> {metadataForAI.missionEnd}</li>
                        )}
                        {metadataForAI.projectTitle && (
                            <li><span className="font-semibold">Project:</span> {metadataForAI.projectTitle}</li>
                        )}
                        {metadataForAI.nasaCenter && (
                            <li><span className="font-semibold">NASA Center:</span> {metadataForAI.nasaCenter}</li>
                        )}
                        {metadataForAI.funding && (
                            <li><span className="font-semibold">Funding:</span> {metadataForAI.funding}</li>
                        )}
                    </ul>

                    {/* AI Support Button */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                size="lg"
                                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 rounded-xl flex items-center justify-center gap-2"
                            >
                                <Bot className="w-5 h-5" />
                                Get AI Insights
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full sm:max-w-lg">
                            <AiSupport metadata={metadataForAI} />
                        </SheetContent>
                    </Sheet>
                </CardContent>
            </Card>
        </div>
    )
}
