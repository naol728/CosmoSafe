"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Globe, Rocket } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

const ProblemSolution = () => {
    return (
        <section className="relative w-full py-28 px-6 bg-gradient-to-b from-background via-background/95 to-background">
            <div className="max-w-7xl mx-auto text-center mb-20">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold text-foreground"
                >
                    🚨 The Challenge & Our Solution
                </motion.h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl">
                    Understanding the threats to our planet and space — and how{" "}
                    <span className="text-primary font-semibold">CosmoSafe</span>
                    is designed to overcome them.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
                {/* Problem Card */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <Card className="group relative bg-gradient-to-br from-red-500/10 via-background to-background/80 backdrop-blur-xl border border-white/10 shadow-xl rounded-3xl p-10 overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-red-400/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 blur-2xl"></div>

                        <CardHeader className="flex items-center gap-4 relative z-10">
                            <AlertTriangle className="h-10 w-10 text-red-500 drop-shadow" />
                            <CardTitle className="text-3xl font-extrabold text-foreground">
                                The Problem
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10">
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Humanity faces urgent global & space challenges:
                            </p>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-center gap-3 hover:text-red-400 transition">
                                    <Globe className="h-6 w-6 text-green-500" />
                                    <span>Deforestation & climate hazards threatening ecosystems</span>
                                </li>
                                <li className="flex items-center gap-3 hover:text-blue-400 transition">
                                    <Rocket className="h-6 w-6 text-blue-500" />
                                    <span>Space debris endangering satellites & communication</span>
                                </li>
                                <li className="flex items-center gap-3 hover:text-yellow-400 transition">
                                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                                    <span>Environmental crises compromising human safety</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Solution Card */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <Card className="group relative bg-gradient-to-br from-primary/10 via-background to-background/80 backdrop-blur-xl border border-white/10 shadow-xl rounded-3xl p-10 overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 blur-2xl"></div>

                        <CardHeader className="flex items-center gap-4 relative z-10">
                            <Rocket className="h-10 w-10 text-primary drop-shadow" />
                            <CardTitle className="text-3xl font-extrabold text-foreground">
                                Our Solution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 relative z-10">
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                <span className="font-semibold text-foreground">CosmoSafe</span> provides a
                                futuristic platform that:
                            </p>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-center gap-3 hover:text-primary transition">
                                    <span className="w-4 h-4 bg-primary rounded-full shrink-0"></span>
                                    <span>Monitors Earth & space threats in real-time</span>
                                </li>
                                <li className="flex items-center gap-3 hover:text-primary transition">
                                    <span className="w-4 h-4 bg-primary rounded-full shrink-0"></span>
                                    <span>Delivers predictive smart alerts before danger strikes</span>
                                </li>
                                <li className="flex items-center gap-3 hover:text-primary transition">
                                    <span className="w-4 h-4 bg-primary rounded-full shrink-0"></span>
                                    <span>Empowers leaders with data-driven decision support</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    )
}

export default ProblemSolution
