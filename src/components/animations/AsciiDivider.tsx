"use client";

import { motion, useReducedMotion } from "motion/react";

const CHARS = "▁▂▃▄▅▆▇█▇▆▅▄▃▂▁";
const WAVE = Array.from({ length: 8 }).flatMap(() => CHARS.split(""));

export function AsciiDivider() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <section className="border-t border-border py-6">
        <div className="mx-auto max-w-5xl px-6 text-center font-mono text-xs text-muted/50 tracking-[0.35em] select-none">
          ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-border py-2.5 overflow-hidden">
      <div className="flex justify-center">
        <div className="flex">
          {WAVE.map((char, i) => (
            <motion.span
              key={i}
              className="inline-block font-mono text-xs tracking-[0.18em] select-none will-change-transform"
              style={{ color: "rgba(99, 102, 241, 0.4)" }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scaleY: [1, 1.35, 1],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (i / WAVE.length) * 2.8,
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
