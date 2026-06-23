"use client";

import { motion, useReducedMotion } from "motion/react";

interface TextRevealProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
}

export function TextReveal({ children, as: Tag = "p", className, delay = 0 }: TextRevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <Tag className={className}>{children}</Tag>;
  }

  const words = children.split(" ");

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.3,
              delay: delay + i * 0.03,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
          >
            {word}{" "}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
