/* eslint-disable */
"use client";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface AiButtonProps {
    label?: string;
    className?: string;
    onClick?: () => void;
    children: ReactNode
}

export default function AiButton({
    children,
    className,
    onClick,
}: AiButtonProps) {
    return (
        <Button
            onClick={onClick}
            className={`bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-lg hover:opacity-90 transition-all duration-300 ${className}`}
        >
            {children}
        </Button>
    );
}
