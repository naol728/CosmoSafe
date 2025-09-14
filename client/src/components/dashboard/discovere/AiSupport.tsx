/* eslint-disable */
"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export interface Message {
    role: "user" | "ai" | "error";
    content: string;
}

interface AiChatProps {
    metadata?: any; // extra context data
    title?: string; // customizable title
    description?: string; // customizable description
    placeholder?: string; // customizable input placeholder
    className?: string; // optional wrapper styling
}

export default function AiChat({
    metadata,
    title = "AI Insights",
    description = "Ask AI to analyze and explain based on given metadata.",
    placeholder = "Ask AI anything...",
    className,
}: AiChatProps) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const eventSourceRef = useRef<EventSource | null>(null);

    const handleSend = () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);

        setInput("");
        setLoading(true);

        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }

        // Add AI placeholder
        setMessages((prev) => [...prev, { role: "ai", content: "" }]);

        const queryPayload = JSON.stringify({ query: input, metadata });
        const queryParams = encodeURIComponent(queryPayload);

        const eventSource = new EventSource(
            `http://localhost:8000/api/ai/ai-stream?payload=${queryParams}`
        );
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (e) => {
            if (e.data === "[DONE]") {
                eventSource.close();
                setLoading(false);
                eventSourceRef.current = null;
                return;
            }

            try {
                const parsedData = JSON.parse(e.data);

                if (parsedData.error) {
                    setMessages((prev) => [
                        ...prev,
                        { role: "error", content: `Error: ${parsedData.error}` },
                    ]);
                    setLoading(false);
                    eventSource.close();
                    eventSourceRef.current = null;
                    return;
                }

                const aiText = parsedData.candidates?.[0]?.content?.parts?.[0]?.text;

                if (aiText) {
                    setMessages((prev) => {
                        const newMessages = [...prev];
                        const lastIdx = newMessages.length - 1;
                        if (newMessages[lastIdx]?.role === "ai") {
                            newMessages[lastIdx].content += aiText;
                        } else {
                            newMessages.push({ role: "ai", content: aiText });
                        }
                        return newMessages;
                    });
                }
            } catch {
                // Append raw fallback
                setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastIdx = newMessages.length - 1;
                    if (newMessages[lastIdx]?.role === "ai") {
                        newMessages[lastIdx].content += e.data;
                    } else {
                        newMessages.push({ role: "ai", content: e.data });
                    }
                    return newMessages;
                });
            }
        };

        eventSource.onerror = (e) => {
            console.error("EventSource failed:", e);
            setMessages((prev) => [
                ...prev,
                { role: "error", content: "Connection error." },
            ]);
            setLoading(false);
            eventSource.close();
            eventSourceRef.current = null;
        };
    };

    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, loading]);

    return (
        <div
            className={`flex flex-col h-full p-4 space-y-4 ${className || ""}`}
        >
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto rounded-md border p-3 space-y-3 bg-muted/20"
            >
                {messages.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center">
                        No messages yet. Start a conversation!
                    </p>
                )}
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-2 rounded-md max-w-[85%] whitespace-pre-line ${msg.role === "user"
                            ? "ml-auto bg-primary text-primary-foreground"
                            : msg.role === "ai"
                                ? "mr-auto bg-muted"
                                : "mr-auto bg-red-100 text-red-700 border border-red-300"
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

            {/* Input */}
            <div className="flex items-end gap-2">
                <Textarea
                    placeholder={placeholder}
                    className="min-h-[60px] resize-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    disabled={loading}
                />
                <Button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
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
