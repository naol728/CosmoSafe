"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Globe, Rocket } from "lucide-react"

const ProblemSolution = () => {
    return (
        <section className="relative w-full py-20 px-6 bg-gradient-to-b from-background to-muted">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                {/* Left Side - Problem */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                        <h2 className="text-2xl font-bold text-foreground">The Problem</h2>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Humanity faces serious challenges:
                    </p>
                    <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-center space-x-3">
                            <Globe className="h-5 w-5 text-green-500" />
                            <span>Deforestation & climate hazards</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <Rocket className="h-5 w-5 text-blue-500" />
                            <span>Space debris threatening satellites</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            <span>Environmental threats to human safety</span>
                        </li>
                    </ul>
                </motion.div>

                {/* Right Side - Solution */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <div className="flex items-center space-x-3">
                        <Rocket className="h-8 w-8 text-primary" />
                        <h2 className="text-2xl font-bold text-foreground">Our Solution</h2>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        <span className="font-semibold text-foreground">CosmoSafe</span> provides a
                        real-time dashboard that:
                    </p>
                    <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-center space-x-3">
                            <span className="w-3 h-3 bg-primary rounded-full"></span>
                            <span>Tracks Earth & Space threats in real-time</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <span className="w-3 h-3 bg-primary rounded-full"></span>
                            <span>Sends smart alerts before danger happens</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <span className="w-3 h-3 bg-primary rounded-full"></span>
                            <span>Supports data-driven decision making</span>
                        </li>
                    </ul>
                </motion.div>

            </div>
        </section>
    )
}

export default ProblemSolution
