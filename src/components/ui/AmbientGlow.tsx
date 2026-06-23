"use client";

import { useReducedMotion } from "motion/react";

interface Orb {
  size: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  color: string;
  blur?: string;
  duration?: number;
  delay?: number;
  driftX?: number;
  driftY?: number;
}

interface AmbientGlowProps {
  orbs: Orb[];
}

export function AmbientGlow({ orbs }: AmbientGlowProps) {
  const reduce = useReducedMotion();

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${reduce ? "" : "animate-ambient-glow"}`}
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
            background: orb.color,
            filter: `blur(${orb.blur || "80px"})`,
            opacity: reduce ? 0.06 : undefined,
            "--gdur": `${orb.duration || 22}s`,
            "--gdel": `${orb.delay || 0}s`,
            "--gx1": `${orb.driftX || 15}px`,
            "--gy1": `${orb.driftY || -10}px`,
            "--gx2": `${-(orb.driftX || 15)}px`,
            "--gy2": `${-(orb.driftY || -10)}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
