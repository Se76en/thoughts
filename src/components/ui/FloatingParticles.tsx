"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "motion/react";

interface ParticleData {
  size: number;
  x: string;
  y: string;
  diamond: boolean;
  dur: number;
  del: number;
  x1: number; y1: number;
  x2: number; y2: number;
  x3: number; y3: number;
}

function generate(count: number): ParticleData[] {
  const out: ParticleData[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      size: 2 + Math.random() * 4,
      x: `${3 + Math.random() * 94}%`,
      y: `${3 + Math.random() * 94}%`,
      diamond: Math.random() > 0.55,
      dur: 20 + Math.random() * 18,
      del: Math.random() * -30,
      x1: Math.round(6 + Math.random() * 22) * (Math.random() > 0.5 ? 1 : -1),
      y1: Math.round(6 + Math.random() * 22) * (Math.random() > 0.5 ? 1 : -1),
      x2: Math.round(6 + Math.random() * 22) * (Math.random() > 0.5 ? 1 : -1),
      y2: Math.round(6 + Math.random() * 22) * (Math.random() > 0.5 ? 1 : -1),
      x3: Math.round(6 + Math.random() * 22) * (Math.random() > 0.5 ? 1 : -1),
      y3: Math.round(6 + Math.random() * 22) * (Math.random() > 0.5 ? 1 : -1),
    });
  }
  return out;
}

export function FloatingParticles({ count = 18 }: { count?: number }) {
  const reduce = useReducedMotion();
  const [particles, setParticles] = useState<ParticleData[]>([]);

  useEffect(() => {
    setParticles(generate(count));
  }, [count]);

  if (reduce) return null;
  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      {particles.map((p, i) => {
        const size = p.diamond ? p.size + 3 : p.size;
        return (
          <div
            key={i}
            className={`absolute particle-float ${p.diamond ? "bg-accent/25" : "bg-accent/20"}`}
            style={{
              width: size,
              height: size,
              left: p.x,
              top: p.y,
              borderRadius: p.diamond ? "2px" : "9999px",
              opacity: p.diamond ? 0.3 : 0.2,
              "--p-dur": `${p.dur}s`,
              "--p-del": `${p.del}s`,
              "--p-x1": `${p.x1}px`,
              "--p-y1": `${p.y1}px`,
              "--p-x2": `${p.x2}px`,
              "--p-y2": `${p.y2}px`,
              "--p-x3": `${p.x3}px`,
              "--p-y3": `${p.y3}px`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
