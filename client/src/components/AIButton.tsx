/* eslint-disable */
"use client";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hook";
import { createCheckoutSession } from "@/services/stripe";

interface AiButtonProps {
    label?: string;
    className?: string;
    onClick?: () => void;
    children?: React.ReactNode;
}

export default function AiButton({
    label,
    children,
    className,
    onClick,
}: AiButtonProps) {
    const user = useAppSelector((state) => state.auth.user);
    const is_premium = !!user?.user?.is_premium; // ensure boolean
    const email = user?.user?.email;

    const handleClick = () => {
        if (email) {
            createCheckoutSession(email);
        }
        else {
            alert("Please log in to upgrade.");
        }
    }

    const buttonText = is_premium
        ? children || label || "Use AI"
        : "Upgrade to Premium $25";

    return (
        <Button
            onClick={is_premium ? onClick : handleClick}
            className={`bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-lg hover:opacity-90 transition-all duration-300 ${className}`}
        >
            {buttonText}
        </Button>
    );
}

