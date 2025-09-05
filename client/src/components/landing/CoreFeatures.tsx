"use client"

import { motion } from "framer-motion"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, AlertTriangle, Satellite, LayoutDashboard, Brain } from "lucide-react"
import { CometCard } from "@/components/ui/comet-card";

const features = [
  {
    title: "Real-time Map",
    description: "Interactive Earth & space monitoring using Mapbox integration.",
    icon: Globe,
  },
  {
    title: "Climate & Disaster Alerts",
    description: "Stay updated with live alerts for earthquakes, storms, and hazards.",
    icon: AlertTriangle,
  },
  {
    title: "Space Debris Tracking",
    description: "Monitor satellites and space debris to ensure safe operations.",
    icon: Satellite,
  },
  {
    title: "Role-based Dashboard",
    description: "Custom dashboards for Admins, Premium & Regular users.",
    icon: LayoutDashboard,
  },
  {
    title: "AI-powered Insights",
    description: "Smart predictions and analysis for better decision-making.",
    icon: Brain,
  },
]

const CoreFeatures = () => {
  return (
    <section className="w-full py-20 px-6 bg-background" id="features">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-foreground"
        >
          🌍 Core Features
        </motion.h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Explore the powerful tools CosmoSafe provides to protect Earth and space.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <CometCard className="rounded-2xl shadow-md hover:shadow-2xl transition p-8 md:p-12 w-full max-w-xl mx-auto">
                <CardHeader className="flex flex-row items-center gap-5">
                  <div className="p-5 md:p-6 rounded-full bg-primary/10 text-primary">
                    <Icon className="h-8 w-8 md:h-10 md:w-10" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base md:text-lg text-muted-foreground">{feature.description}</p>
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
