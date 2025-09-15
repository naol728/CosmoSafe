import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Success() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-pink-900 via-black to-pink-800 text-center px-6">
            {/* Animated Icon */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 150, damping: 12 }}
                className="mb-6"
            >
                <CheckCircle2 className="w-20 h-20 text-green-500 drop-shadow-lg" />
            </motion.div>

            {/* Heading */}
            <motion.h1
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl font-extrabold text-green-600"
            >
                Payment Successful 🎉
            </motion.h1>

            {/* Subtext */}
            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-3 text-lg text-gray-600"
            >
                Your <span className="font-semibold text-green-700">premium access</span> has been activated!
            </motion.p>

            {/* Button */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-8"
            >
                <Link to="/dashboard">
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition-all duration-300">
                        🚀 Back to Dashboard
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}
