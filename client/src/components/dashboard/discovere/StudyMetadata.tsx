/* eslint-disable */
"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getStudyMetadata } from "@/services/spacedataService"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Bot, ChevronDown } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import AiSupport from "./AiSupport"
import AiButton from "@/components/AIButton"

export default function StudyMetadata({ studyId }: { studyId: string }) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["study-metadata", studyId],
        queryFn: () => getStudyMetadata(studyId),
    })

    const [showContributors, setShowContributors] = useState(false)
    const [showPublications, setShowPublications] = useState(false)
    const [showKeyDetails, setShowKeyDetails] = useState(false)

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
        <div className="flex flex-col gap-6 w-full px-4 sm:px-6 lg:px-8">
            {/* Title */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl lg:text-2xl break-words">{study.title || "Untitled Study"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm sm:text-base text-muted-foreground break-words">{study.description}</p>
                    {study.studyDesignDescriptors?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {study.studyDesignDescriptors.map((d: any, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs sm:text-sm">
                                    {d.annotationValue}
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Contributors Accordion */}
            {metadataForAI.contributors?.length > 0 && (
                <Card className="w-full overflow-x-auto">
                    <CardHeader className="cursor-pointer flex justify-between items-center" onClick={() => setShowContributors(!showContributors)}>
                        <CardTitle>Contributors</CardTitle>
                        <ChevronDown className={`w-5 h-5 transition-transform ${showContributors ? "rotate-180" : ""}`} />
                    </CardHeader>
                    {showContributors && (
                        <CardContent>
                            <ul className="space-y-2 min-w-[200px] sm:min-w-full">
                                {metadataForAI.contributors.map((p: any, i: any) => (
                                    <li key={i} className="text-sm sm:text-base break-words">
                                        <span className="font-medium">{p.name}</span> – {p.affiliation}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    )}
                </Card>
            )}

            {/* Publications Accordion */}
            {metadataForAI.publications?.length > 0 && (
                <Card className="w-full overflow-x-auto">
                    <CardHeader className="cursor-pointer flex justify-between items-center" onClick={() => setShowPublications(!showPublications)}>
                        <CardTitle>Publications</CardTitle>
                        <ChevronDown className={`w-5 h-5 transition-transform ${showPublications ? "rotate-180" : ""}`} />
                    </CardHeader>
                    {showPublications && (
                        <CardContent className="space-y-4 min-w-[200px] sm:min-w-full">
                            {metadataForAI.publications.map((pub: any, i: any) => (
                                <div key={i} className="break-words">
                                    <p className="font-medium text-sm sm:text-base">{pub.title}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">{pub.authors}</p>
                                    <p className="text-xs sm:text-sm break-words">
                                        DOI:{" "}
                                        <a
                                            href={`https://doi.org/${pub.doi}`}
                                            className="text-blue-600 hover:underline break-all"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {pub.doi}
                                        </a>
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    )}
                </Card>
            )}

            {/* Key Metadata + AI Support Accordion */}
            <Card className="w-full">
                <CardHeader className="cursor-pointer flex justify-between items-center" onClick={() => setShowKeyDetails(!showKeyDetails)}>
                    <CardTitle>Key Study Details</CardTitle>
                    <ChevronDown className={`w-5 h-5 transition-transform ${showKeyDetails ? "rotate-180" : ""}`} />
                </CardHeader>
                {showKeyDetails && (
                    <CardContent className="flex flex-col gap-4">
                        <ul className="space-y-1 text-sm sm:text-base">
                            {metadataForAI.mission && <li><span className="font-semibold">Mission:</span> {metadataForAI.mission}</li>}
                            {metadataForAI.missionStart && <li><span className="font-semibold">Start:</span> {metadataForAI.missionStart}</li>}
                            {metadataForAI.missionEnd && <li><span className="font-semibold">End:</span> {metadataForAI.missionEnd}</li>}
                            {metadataForAI.projectTitle && <li><span className="font-semibold">Project:</span> {metadataForAI.projectTitle}</li>}
                            {metadataForAI.nasaCenter && <li><span className="font-semibold">NASA Center:</span> {metadataForAI.nasaCenter}</li>}
                            {metadataForAI.funding && <li><span className="font-semibold">Funding:</span> {metadataForAI.funding}</li>}
                        </ul>

                        {/* AI Support Button */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <AiButton
                                    className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 rounded-xl flex items-center justify-center gap-2"
                                >
                                    <Bot className="w-5 h-5" />
                                    Get AI Insights
                                </AiButton>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full sm:max-w-lg">
                                <AiSupport metadata={metadataForAI} />
                            </SheetContent>
                        </Sheet>
                    </CardContent>
                )}
            </Card>
        </div>
    )
}
