"use client"

import { motion } from "framer-motion"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Globe,
  AlertTriangle,
  Satellite,
  LayoutDashboard,
  Brain,
} from "lucide-react"
import { CometCard } from "@/components/ui/comet-card"

const features = [
  {
    title: "Real-time Map",
    description:
      "Interactive Earth & space monitoring powered by Mapbox integration.",
    icon: Globe,
  },
  {
    title: "Climate & Disaster Alerts",
    description:
      "Stay updated with instant alerts for earthquakes, storms, and hazards.",
    icon: AlertTriangle,
  },
  {
    title: "Space Debris Tracking",
    description:
      "Track satellites and space debris to safeguard global operations.",
    icon: Satellite,
  },
  {
    title: "Role-based Dashboard",
    description:
      "Personalized dashboards for Admins, Premium & Regular users.",
    icon: LayoutDashboard,
  },
  {
    title: "AI-powered Insights",
    description:
      "Leverage machine learning for smarter predictions & analysis.",
    icon: Brain,
  },
]

const CoreFeatures = () => {
  return (
    <section
      className="relative w-full py-24 px-6 overflow-hidden bg-gradient-to-b from-background via-background/90 to-black"
      id="features"
    >
      {/* Decorative gradient blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />

      {/* Heading */}
      <div className="relative max-w-6xl mx-auto text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          🌍 Core Features
        </motion.h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Unlock the tools that make <span className="text-primary">CosmoSafe</span>
          your ultimate guardian for Earth and space.
        </p>
      </div>

      {/* Features Grid */}
      <div className="relative grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <CometCard className="relative rounded-2xl shadow-lg hover:shadow-primary/30 transition-all duration-300 p-8 md:p-10 w-full max-w-xl mx-auto">
                {/* Glow behind icon */}
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition" />

                <CardHeader className="flex flex-row items-center gap-5">
                  <div className="p-5 md:p-6 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    <Icon className="h-8 w-8 md:h-10 md:w-10 text-primary drop-shadow-lg" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl font-semibold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </CometCard>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export default CoreFeatures
