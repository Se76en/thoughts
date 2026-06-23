"use client";

import { useRef, useCallback, useState, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltDegree?: number;
}

export function TiltCard({ children, className = "", tiltDegree = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [prefersHover] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(hover: hover) and (pointer: fine)").matches
      : false
  );

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 30 });

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      if (reduce || !prefersHover || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const percentX = (e.clientX - centerX) / (rect.width / 2);
      const percentY = (e.clientY - centerY) / (rect.height / 2);
      rotateY.set(percentX * tiltDegree);
      rotateX.set(-percentY * tiltDegree);
    },
    [reduce, prefersHover, tiltDegree, rotateX, rotateY]
  );

  const handleLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <div style={{ transformStyle: "preserve-3d" }} className="[&>*]:[transform-style:preserve-3d]">
        {children}
      </div>
    </motion.div>
  );
}
