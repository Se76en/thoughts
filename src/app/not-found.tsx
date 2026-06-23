"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const words = ["Uh", "oh..."];

const easeOut = [0.23, 1, 0.32, 1] as [number, number, number, number];

export default function NotFound() {
  const reduce = useReducedMotion();

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 pt-16">
      <div className="text-center">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: easeOut }}
          className="mb-6 font-mono text-xs tracking-[0.3em] text-muted-foreground/30 select-none"
        >
          404
        </motion.p>

        <div className="mb-3 flex flex-wrap justify-center gap-x-3">
          {words.map((word, i) => (
            <motion.span
              key={word}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.2 + i * 0.08,
                ease: easeOut,
              }}
              className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-foreground"
            >
              {word}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: 0.45,
            ease: easeOut,
          }}
          className="mb-10 text-base sm:text-lg text-foreground/70 text-balance max-w-md mx-auto"
        >
          Looks like you got lost!
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: 0.65,
            ease: easeOut,
          }}
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-7 py-3 text-sm font-medium text-white transition-all duration-150 ease-out hover:bg-accent-hover active:scale-[0.97]"
          >
            Return home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
