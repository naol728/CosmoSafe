/* eslint-disable */
"use client";

import IssWeather from "@/components/dashboard/space/IssWeather";
import WeatherForcast from "@/components/dashboard/space/WeatherForcast";
import Collisions from "@/components/dashboard/space/Collisions";
import Nearby from "@/components/dashboard/space/Nearby";
export default function Space() {

    return (
        <section className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-gray-100 p-6 md:p-10 grid gap-8">
            <IssWeather />
            <WeatherForcast />
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <Collisions />
                <Nearby />
            </div>
        </section>
    );
}
