"use client";
/* eslint-disable */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStudyFiles, searchStudies } from "@/services/spacedataService";
import StudyMetadata from "@/components/dashboard/discovere/StudyMetadata";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader2 } from "lucide-react";

interface StudyFile {
    category: string;
    date_created: number;
    file_name: string;
    file_size: number;
    remote_url: string;
    restricted: boolean;
    visible: boolean;
}

export default function Discovery() {
    const [studyIds, setStudyIds] = useState("87");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const firstStudyId = studyIds.split(",")[0].trim()
        ? `OSD-${studyIds.split(",")[0].trim()}`
        : "";

    // Files query
    const filesQuery = useQuery({
        queryKey: ["studyFiles", studyIds],
        queryFn: () => getStudyFiles(studyIds),
        enabled: !!studyIds,
    });

    // Search query
    const searchQuery = useQuery({
        queryKey: ["search", searchTerm],
        queryFn: () => searchStudies({ term: searchTerm, size: 10 }),
        enabled: !!searchTerm,
    });

    // Handle pagination
    const files =
        filesQuery.data?.studies &&
        Object.values(filesQuery.data.studies).flatMap(
            (study: any) => study.study_files
        );

    const totalFiles = files ? files.length : 0;
    const totalPages = Math.ceil(totalFiles / pageSize);

    const paginatedFiles = files
        ? files.slice((page - 1) * pageSize, page * pageSize)
        : [];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold mb-6">🚀 Space & Earth Discoveries</h1>

            {/* Study IDs Input */}
            <div>
                <label className="block font-semibold mb-1">
                    Study IDs (comma separated)
                </label>
                <input
                    type="text"
                    value={studyIds}
                    onChange={(e) => setStudyIds(e.target.value)}
                    className="border p-2 w-full rounded"
                    placeholder="e.g., 87, 123"
                />
            </div>

            {/* Metadata */}
            {firstStudyId && (
                <section>
                    <h2 className="text-2xl font-semibold mb-4">🧪 Study Metadata</h2>
                    <StudyMetadata studyId={firstStudyId} />
                </section>
            )}

            {/* Study Files */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">📂 Study Files</h2>
                {filesQuery.isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-muted-foreground">Loading files...</span>
                    </div>
                ) : filesQuery.isError ? (
                    <p className="text-red-500">Error fetching files</p>
                ) : (
                    <>
                        {paginatedFiles.map((file: StudyFile) => (
                            <div
                                key={file.file_name}
                                className="flex justify-between items-center border rounded p-3 mb-2 shadow-sm bg-background"
                            >
                                <div>
                                    <p className="font-medium">{file.file_name}</p>
                                    <p className="text-sm text-gray-500">{file.category}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">
                                        {(file.file_size / (1024 * 1024)).toFixed(2)} MB
                                    </span>
                                    <a
                                        href={file.remote_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Download
                                    </a>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Pagination className="mt-6">
                                <PaginationContent>
                                    {/* Previous */}
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setPage((p) => Math.max(p - 1, 1));
                                            }}
                                        />
                                    </PaginationItem>

                                    {/* Page numbers with fixed window */}
                                    {(() => {
                                        const maxVisible = 5; // show at most 5 numbered pages
                                        const pages: number[] = [];

                                        if (totalPages <= maxVisible) {
                                            // Show all pages if they fit
                                            for (let i = 1; i <= totalPages; i++) {
                                                pages.push(i);
                                            }
                                        } else {
                                            // Always show first and last, window around current page
                                            const left = Math.max(2, page - 1);
                                            const right = Math.min(totalPages - 1, page + 1);

                                            pages.push(1);

                                            if (left > 2) pages.push(-1); // -1 means ellipsis

                                            for (let i = left; i <= right; i++) {
                                                pages.push(i);
                                            }

                                            if (right < totalPages - 1) pages.push(-2); // -2 means ellipsis

                                            pages.push(totalPages);
                                        }

                                        return pages.map((p, i) =>
                                            p < 0 ? (
                                                <PaginationItem key={i}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            ) : (
                                                <PaginationItem key={p}>
                                                    <PaginationLink
                                                        href="#"
                                                        isActive={page === p}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setPage(p);
                                                        }}
                                                    >
                                                        {p}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        );
                                    })()}

                                    {/* Next */}
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setPage((p) => Math.min(p + 1, totalPages));
                                            }}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}

                    </>
                )}
            </section>

            {/* Search Studies */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">🔍 Search Studies</h2>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for studies..."
                    className="border p-2 w-full rounded mb-4"
                />

                {searchQuery.isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-muted-foreground">Searching</span>
                    </div>
                ) : searchQuery.isError ? (
                    <p className="text-red-500">Error searching studies</p>
                ) : (
                    (() => {
                        const results =
                            searchQuery.data?.results && Array.isArray(searchQuery.data.results)
                                ? searchQuery.data.results
                                : [];

                        if (!results.length) {
                            return <p className="text-gray-500">No results found.</p>;
                        }

                        return results.map((result: any) => (
                            <div
                                key={result.identifier || result.id}
                                className="mb-3 border p-3 rounded shadow-sm bg-background"
                            >
                                <h3 className="font-semibold">{result.title}</h3>
                                <p className="text-sm text-gray-600">
                                    {result.description || "No description available"}
                                </p>
                                {result.organism && (
                                    <p className="text-xs text-muted-foreground">
                                        Organism: {result.organism}
                                    </p>
                                )}
                                {result.project && (
                                    <p className="text-xs text-muted-foreground">
                                        Project: {result.project}
                                    </p>
                                )}
                                <div>{result.identifier}</div>
                            </div>
                        ));
                    })()
                )}
            </section>
        </div>
    );
}
