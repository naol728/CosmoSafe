"use client";
import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { cn } from "@/lib/utils";

export const CometCard = ({
  rotateDepth = 15,
  translateDepth = 25,
  className,
  children,
}: {
  rotateDepth?: number;
  translateDepth?: number;
  className?: string;
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 30 });

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`-${rotateDepth}deg`, `${rotateDepth}deg`],
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`${rotateDepth}deg`, `-${rotateDepth}deg`],
  );

  const translateX = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`-${translateDepth}px`, `${translateDepth}px`],
  );
  const translateY = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`${translateDepth}px`, `-${translateDepth}px`],
  );

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);

  const glareBackground = useMotionTemplate`
    radial-gradient(
      circle at ${glareX}% ${glareY}%,
      rgba(255,255,255,0.9) 10%,
      rgba(255,255,255,0.4) 30%,
      rgba(255,255,255,0) 80%
    )
  `;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className={cn("perspective-distant transform-3d", className)}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          translateX,
          translateY,
          boxShadow:
            "0 30px 60px -10px rgba(0,0,0,0.4), 0 18px 36px -18px rgba(0,0,0,0.4)",
        }}
        initial={{ scale: 1 }}
        whileHover={{
          scale: 1.07,
          z: 60,
          transition: { duration: 0.25, ease: "easeOut" },
        }}
        className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-background to-muted/40 p-[2px] overflow-hidden group"
      >
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-70 blur-xl animate-pulse" />

        {/* Card content */}
        <div className="relative z-10 rounded-[1rem] bg-background/70 backdrop-blur-xl p-6">
          {children}
        </div>

        {/* Dynamic glare */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 rounded-[1rem] mix-blend-overlay"
          style={{
            background: glareBackground,
            opacity: 0.5,
          }}
        />
      </motion.div>
    </div>
  );
};
