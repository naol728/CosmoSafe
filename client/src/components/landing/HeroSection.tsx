"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useAppSelector } from "@/store/hook"

export default function HeroSection() {
    const { loading, user } = useAppSelector((state) => state.auth)
    return (
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">

            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/hero.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>


            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <div className="relative z-10 text-center max-w-3xl px-6">
                <motion.h1
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg"
                >
                    Protecting Earth & Space <br /> with Data Intelligence
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="mt-6 text-lg md:text-xl text-gray-200"
                >
                    Real-time monitoring for planetary and orbital safety — powered by AI,
                    data, and innovation.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button
                        size="lg"
                        className="rounded-full px-8 py-4 text-lg bg-primary text-black hover:bg-primary/90"
                    > <Link to={loading ? "/" : user ? "/dashboard" : "/auth"}>
                            {loading ? "Loading" : user ? "Dashboard" : "Get Started"}
                        </Link>

                    </Button>

                </motion.div>
            </div>
        </section>
    )
}
