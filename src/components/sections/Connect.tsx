"use client";

import { useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FloatingBadge } from "@/components/animations/FloatingBadge";
import { socialLinks } from "@/lib/social";

export function Connect() {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const fadeIn = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
      };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  };

  return (
    <section className="py-32 relative overflow-hidden bg-dot-accent">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-accent/[0.15] blur-[70px] animate-ambient-glow" style={{ "--gdur": "24s", "--gdel": "0s", "--gx1": "18px", "--gy1": "-12px", "--gx2": "-14px", "--gy2": "16px" } as CSSProperties} />
        <div className="absolute bottom-1/4 right-1/4 h-56 w-56 rounded-full bg-accent/[0.10] blur-[60px] animate-ambient-glow" style={{ "--gdur": "20s", "--gdel": "-6s", "--gx1": "-12px", "--gy1": "14px", "--gx2": "10px", "--gy2": "-10px" } as CSSProperties} />
      </div>

      <div className="mx-auto max-w-2xl px-6 text-center">
        <motion.h2
          {...fadeIn}
          className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl text-balance"
        >
          Stay in touch
        </motion.h2>
        <motion.p
          {...fadeIn}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="mb-8 text-foreground/80"
        >
          Get notified when I publish something new. No spam, ever.
        </motion.p>
        <motion.form
          {...fadeIn}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="mx-auto flex max-w-md gap-3 max-sm:flex-col"
          onSubmit={handleSubmit}
        >
          <div className="flex-1">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (status !== "idle") setStatus("idle"); }}
              required
            />
          </div>
          <Button type="submit">Subscribe</Button>
        </motion.form>
        {status === "success" && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-green-400"
          >
            Thanks — you&apos;re subscribed.
          </motion.p>
        )}
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-red-400"
          >
            Please enter a valid email address.
          </motion.p>
        )}
      </div>

      <FloatingBadge
        className="absolute left-[15%] top-[20%] hidden lg:block"
        amplitude={6}
        duration={5}
      >
        <span className="text-3xl text-muted-foreground/20">✦</span>
      </FloatingBadge>

      <FloatingBadge
        className="absolute right-[20%] bottom-[25%] hidden lg:block"
        amplitude={8}
        duration={4}
        delay={1.5}
      >
        <span className="text-2xl text-muted-foreground/15">✦</span>
      </FloatingBadge>

      <motion.div
        {...fadeIn}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="mt-16 text-center"
      >
        <p className="mb-4 text-sm text-foreground/80">Find me elsewhere</p>
        <div className="flex items-center justify-center gap-6">
          {socialLinks.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.3 }}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
