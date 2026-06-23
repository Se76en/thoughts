"use client";

import { motion, useReducedMotion } from "motion/react";
import { ReactNode } from "react";

interface FloatingBadgeProps {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  delay?: number;
}

export function FloatingBadge({
  children,
  className = "",
  amplitude = 8,
  duration = 3,
  delay = 0,
}: FloatingBadgeProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
