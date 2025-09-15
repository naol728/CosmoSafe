"use client";
import UserCollison from "@/components/dashboard/ai/UserCollison";
import UserDisaster from "@/components/dashboard/ai/UserDisaster";
import UserEarthquake from "@/components/dashboard/ai/UserEarthquake";
import UserNeoObject from "@/components/dashboard/ai/UserNeoObject";

export default function AiInsight() {
    return (
        <>
            <UserDisaster />
            <UserEarthquake />
            <UserNeoObject />
            <UserCollison />
        </>
    );
}
