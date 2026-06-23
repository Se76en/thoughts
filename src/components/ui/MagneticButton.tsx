"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { ReactNode, useRef, useCallback } from "react";
import Link from "next/link";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
}

export function MagneticButton({ children, href, className = "", onClick }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 8 });
  const springY = useSpring(y, { stiffness: 150, damping: 8 });

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      if (reduce || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      x.set(distX * 0.2);
      y.set(distY * 0.2);
    },
    [reduce, x, y]
  );

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const baseClass =
    "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer";

  const content = href ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );

  if (reduce) {
    return <div className={baseClass}>{content}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className={baseClass}
    >
      {content}
    </motion.div>
  );
}
