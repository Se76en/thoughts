"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  label: string;
  suffix?: string;
  duration?: number;
}

export function AnimatedCounter({
  from = 0,
  to,
  label,
  suffix = "",
  duration = 2,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || hasTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasTriggered(true);
          const startTime = performance.now();
          const step = (currentTime: number) => {
            const elapsed = (currentTime - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(from + (to - from) * eased));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasTriggered, from, to, duration, reduce]);

  if (reduce) {
    return (
      <div className="text-center">
        <span className="text-2xl font-semibold text-foreground">{to}{suffix}</span>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="text-center">
      <motion.span
        className="text-2xl font-semibold text-foreground"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {count}{suffix}
      </motion.span>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
