/* eslint-disable */
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, SendHorizonal } from "lucide-react";

// Define a type for your messages
interface Message {
    role: "user" | "ai" | "error"; // Added 'error' role
    content: string;
}

// Define an interface for potential error responses from your API
interface ApiErrorResponse {
    error: string;
}

export default function AiSupport({ metadata }: { metadata: any }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const eventSourceRef = useRef<EventSource | null>(null);

    const handleSend = () => {
        if (!input.trim() || loading) return; // Prevent sending if loading or input is empty

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);

        setInput("");
        setLoading(true);

        // Close any existing EventSource before starting a new one
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }

        let aiMessage: Message = { role: "ai", content: "" };
        setMessages((prev) => [...prev, aiMessage]); // Add an empty AI message placeholder

        const queryParams = encodeURIComponent(
            JSON.stringify({ query: input, metadata })
        );
        const eventSource = new EventSource(
            `http://localhost:8000/api/ai/ai-stream?payload=${queryParams}`
        );

        eventSourceRef.current = eventSource;

        eventSource.onmessage = (e) => {
            if (e.data === "[DONE]") {
                // This would be a custom signal from your backend to indicate completion
                eventSource.close();
                setLoading(false);
                eventSourceRef.current = null; // Clear ref on completion
            } else {
                try {
                    // Attempt to parse data as JSON to catch error messages
                    const parsedData: ApiErrorResponse = JSON.parse(e.data);
                    if (parsedData.error) {
                        setMessages((prev) => {
                            const newMessages = [...prev];
                            // Replace the last AI message placeholder with the error message
                            newMessages[newMessages.length - 1] = {
                                role: "error", // Mark as error message
                                content: `Error: ${parsedData.error}`,
                            };
                            return newMessages;
                        });
                        setLoading(false);
                        eventSource.close();
                        eventSourceRef.current = null;
                        return; // Stop processing further data for this stream
                    }
                } catch (jsonError) {
                    // If not an error JSON, it's regular AI content
                    setMessages((prev) => {
                        const newMessages = [...prev];
                        // Ensure the last message is an 'ai' role before appending
                        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === "ai") {
                            newMessages[newMessages.length - 1].content += e.data;
                        } else {
                            // This case should ideally not happen if you're always adding a placeholder
                            // but as a fallback, create a new AI message.
                            newMessages.push({ role: "ai", content: e.data });
                        }
                        return newMessages;
                    });
                }
            }
        };

        eventSource.onerror = (e) => {
            console.error("EventSource failed:", e);
            setMessages((prev) => {
                const newMessages = [...prev];
                // Replace the last AI message placeholder with a generic network error
                newMessages[newMessages.length - 1] = {
                    role: "error", // Mark as error message
                    content: "Network or stream connection failed. Please try again.",
                };
                return newMessages;
            });
            setLoading(false);
            eventSource.close();
            eventSourceRef.current = null;
        };
    };

    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // Scroll to bottom when new messages arrive or loading state changes
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, loading]); // Added loading to dependency array for scroll

    return (
        <div className="flex flex-col h-full">
            <SheetHeader>
                <SheetTitle className="text-xl font-semibold">
                    AI Study Insights
                </SheetTitle>
                <SheetDescription>
                    Ask AI to analyze and explain this study based on its metadata.
                </SheetDescription>
            </SheetHeader>

            <div
                ref={scrollRef}
                className="flex-1 mt-4 overflow-y-auto rounded-md border p-3 space-y-3 bg-muted/20"
            >
                {messages.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center">
                        No messages yet. Ask something about this study!
                    </p>
                )}
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-2 rounded-md max-w-[85%] ${msg.role === "user"
                            ? "ml-auto bg-primary text-primary-foreground"
                            : msg.role === "ai"
                                ? "mr-auto bg-muted"
                                : "mr-auto bg-red-100 text-red-700 border border-red-300" // Style for error messages
                            }`}
                    >
                        {msg.content}
                    </div>
                ))}
                {loading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        AI is thinking...
                    </div>
                )}
            </div>

            <div className="mt-3 flex items-end gap-2">
                <Textarea
                    placeholder="Ask AI about this study..."
                    className="min-h-[60px] resize-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault(); // Prevent new line
                            handleSend();
                        }
                    }}
                    disabled={loading} // Disable input while loading
                />
                <Button
                    onClick={handleSend}
                    disabled={loading || !input.trim()} // Disable send button if loading or input is empty
                    className="shrink-0 h-[60px] px-4 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:via-pink-600 hover:to-red-600 transition-all"
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <SendHorizonal className="h-5 w-5" />
                    )}
                </Button>
            </div>
        </div>
    );
}