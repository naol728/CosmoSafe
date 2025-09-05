"use client"

import { motion } from "framer-motion"

const MapPreview = () => {
    return (
        <section
            id="map-preview"
            className="relative w-full py-20 px-6 bg-gradient-to-b from-background to-muted"
        >
            <div className="max-w-6xl mx-auto text-center">
                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold text-foreground"
                >
                    🌐 Interactive Map Preview
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mt-4 text-muted-foreground max-w-2xl mx-auto"
                >
                    See Earth & Space activity in real time with live monitoring and alerts.
                </motion.p>

                {/* Map Preview Box */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="mt-12 relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl border border-border"
                >
                    <iframe
                        title="Map Preview"
                        src={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12.html?title=view&access_token=${import.meta.env.MAPBOX_ACCESS_TOKEN}`}
                        className="w-full h-full"
                    />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur px-6 py-2 rounded-full text-sm font-medium shadow-md">
                        Real-time Earth & Space Safety Monitoring
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default MapPreview
