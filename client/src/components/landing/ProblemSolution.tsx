"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Globe, Rocket } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

const ProblemSolution = () => {
    return (
        <section className="relative w-full py-24 px-6 bg-gradient-to-b from-background to-muted">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">


                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-3xl p-8">
                        <CardHeader className="flex items-center gap-4">
                            <AlertTriangle className="h-10 w-10 text-red-500" />
                            <CardTitle className="text-3xl font-extrabold text-foreground">
                                The Problem
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                                Humanity faces critical challenges that require immediate attention:
                            </p>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-center gap-3 hover:text-red-400 transition">
                                    <Globe className="h-6 w-6 text-green-500" />
                                    <span>Deforestation & climate hazards impacting ecosystems</span>
                                </li>
                                <li className="flex items-center gap-3 hover:text-blue-400 transition">
                                    <Rocket className="h-6 w-6 text-blue-500" />
                                    <span>Space debris threatening satellites and communications</span>
                                </li>
                                <li className="flex items-center gap-3 hover:text-yellow-400 transition">
                                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                                    <span>Environmental threats compromising human safety</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-3xl p-8">
                        <CardHeader className="flex items-center gap-4">
                            <Rocket className="h-10 w-10 text-primary" />
                            <CardTitle className="text-3xl font-extrabold text-foreground">
                                Our Solution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                                <span className="font-semibold text-foreground">CosmoSafe</span> delivers a
                                state-of-the-art real-time dashboard that:
                            </p>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex items-center gap-3 hover:text-primary transition">
                                    <span className="w-4 h-4 bg-primary rounded-full shrink-0"></span>
                                    <span>Tracks Earth & Space threats in real-time</span>
                                </li>
                                <li className="flex items-center gap-3 hover:text-primary transition">
                                    <span className="w-4 h-4 bg-primary rounded-full shrink-0"></span>
                                    <span>Sends smart alerts before danger happens</span>
                                </li>
                                <li className="flex items-center gap-3 hover:text-primary transition">
                                    <span className="w-4 h-4 bg-primary rounded-full shrink-0"></span>
                                    <span>Supports data-driven decision making for safety</span>
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
