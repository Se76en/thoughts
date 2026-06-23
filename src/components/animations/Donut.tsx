"use client";

import { useEffect, useRef } from "react";
import { useScroll } from "motion/react";

export function Donut() {
  const preRef = useRef<HTMLPreElement>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      pre.textContent = "[donut]";
      return;
    }

    const reduceData = window.matchMedia("(prefers-reduced-data: reduce)").matches;

    let A = 0;
    let B = 0;
    let id: number;
    let lastScrollY = scrollY.get();

    const render = () => {
      const currentScrollY = scrollY.get();
      const dy = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      A += dy * 0.003;
      B += dy * 0.0015;

      A += 0.018;
      B += 0.009;

      const b: string[] = new Array(1760).fill(" ");
      const z: number[] = new Array(1760).fill(0);

      for (let j = 0; j < 6.28; j += 0.07) {
        const ct = Math.cos(j);
        const st = Math.sin(j);
        for (let i = 0; i < 6.28; i += 0.02) {
          const cp = Math.cos(i);
          const sp = Math.sin(i);

          const h = ct + 2;
          const D = 1 / (sp * h * Math.sin(A) + st * Math.cos(A) + 5);
          const t = sp * h * Math.cos(A) - st * Math.sin(A);

          const x = Math.floor(40 + 30 * D * (cp * h * Math.cos(B) - t * Math.sin(B)));
          const y = Math.floor(12 + 15 * D * (cp * h * Math.sin(B) + t * Math.cos(B)));
          const o = x + 80 * y;
          const N = Math.floor(
            8 * ((st * Math.sin(A) - sp * ct * Math.cos(A)) * Math.cos(B) -
              sp * ct * Math.sin(A) - st * Math.cos(A) - cp * ct * Math.sin(B))
          );

          if (y < 22 && y >= 0 && x >= 0 && x < 79 && D > z[o]) {
            z[o] = D;
            b[o] = ".,-~:;=!*#$@"[Math.max(0, N)];
          }
        }
      }

      let output = "";
      for (let k = 0; k < 1760; k++) {
        output += k % 80 ? b[k] : "\n";
      }

      if (!reduceData || id % 30 === 0) {
        pre.textContent = output;
      }
      id = requestAnimationFrame(render);
    };

    id = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(id);
    };
  }, [scrollY]);

  return (
    <pre
      ref={preRef}
      className="font-mono text-[7px] leading-[7px] text-accent/80 select-none"
      style={{ lineHeight: "6px" }}
    />
  );
}
