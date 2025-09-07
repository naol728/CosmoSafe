"use client"

import { motion } from "framer-motion"

const MapPreview = () => {
    return (
        <section
            id="map-preview"
            className="relative w-full py-24 px-6 bg-background overflow-hidden"
        >

            <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full bg-[radial-gradient(circle_at_top,#ffffff05,#0000)] mix-blend-screen" />
                <div className="absolute top-0 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse opacity-30" />
                <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse opacity-20" />
                <div className="absolute bottom-1/4 left-2/3 w-1 h-1 bg-white rounded-full animate-pulse opacity-25" />
            </div>

            <div className="relative max-w-6xl mx-auto text-center z-10">

                <motion.h2
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight"
                >
                    🌌 Real-Time Space & Earth Monitoring
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mt-4 text-muted-foreground max-w-3xl mx-auto text-lg"
                >
                    Visualize cosmic events, satellites, and Earth activity with live alerts and precision tracking.
                </motion.p>


                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-12 relative w-full h-[550px] rounded-3xl overflow-hidden shadow-2xl border border-border/50"
                >
                    <iframe
                        title="Map Preview"
                        src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12.html?title=view&access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`}
                        className="w-full h-full"
                    />

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent/70 via-primary/70 to-secondary/70 backdrop-blur-sm px-8 py-3 rounded-full text-sm md:text-base font-semibold tracking-wide shadow-lg text-foreground">
                        🚀 Live Space & Earth Safety Monitoring
                    </div>


                    <div className="absolute inset-0 rounded-3xl border border-accent/50 pointer-events-none animate-pulse-slow" />
                </motion.div>
            </div>
        </section>
    )
}

export default MapPreview
