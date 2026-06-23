"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Bold,
  Italic,
  Link,
  Heading,
  Quote,
  Highlighter,
  Palette,
  Underline,
  Strikethrough,
} from "lucide-react";
import { useState } from "react";

const colors = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#6366f1", "#a855f7", "#ec4899",
];

interface ToolbarButtonProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  onClick: () => void;
}

function ToolbarButton({ label, icon: Icon, isActive, onClick }: ToolbarButtonProps) {
  const [tip, setTip] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
      <button
        className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors duration-200 ${
          isActive ? "bg-accent/20 text-accent" : "text-foreground/60 hover:bg-accent/10 hover:text-accent"
        }`}
        aria-label={label}
        onClick={onClick}
      >
        <Icon className="h-4 w-4" />
      </button>
      <AnimatePresence>
        {tip && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md bg-foreground/10 px-2 py-1 text-[10px] font-medium text-foreground/80 backdrop-blur-md"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Toolbar() {
  const [active, setActive] = useState<string[]>([]);

  const toggle = (name: string) => {
    setActive((prev) =>
      prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]
    );
  };

  const [colorOpen, setColorOpen] = useState(false);

  return (
    <div className="relative w-full flex items-center justify-center rounded-lg">
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="inline-flex items-center gap-0.5 rounded-xl border border-border bg-surface p-1.5 shadow-lg"
      >
        <ToolbarButton label="Bold" icon={Bold} isActive={active.includes("bold")} onClick={() => toggle("bold")} />
        <ToolbarButton label="Italic" icon={Italic} isActive={active.includes("italic")} onClick={() => toggle("italic")} />
        <ToolbarButton label="Underline" icon={Underline} isActive={active.includes("underline")} onClick={() => toggle("underline")} />
        <ToolbarButton label="Strikethrough" icon={Strikethrough} isActive={active.includes("strike")} onClick={() => toggle("strike")} />
        <ToolbarButton label="Link" icon={Link} isActive={active.includes("link")} onClick={() => toggle("link")} />
        <ToolbarButton label="Heading" icon={Heading} isActive={active.includes("heading")} onClick={() => toggle("heading")} />
        <ToolbarButton label="Quote" icon={Quote} isActive={active.includes("quote")} onClick={() => toggle("quote")} />

        <div className="mx-1 h-6 w-px bg-border" />

        <ToolbarButton label="Highlight" icon={Highlighter} isActive={active.includes("highlight")} onClick={() => toggle("highlight")} />

        <div className="relative">
          <ToolbarButton label="Text Color" icon={Palette} isActive={colorOpen} onClick={() => setColorOpen(!colorOpen)} />
          <AnimatePresence>
            {colorOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 flex gap-1.5 rounded-xl border border-border bg-surface p-2 shadow-lg"
              >
                {colors.map((c) => (
                  <button
                    key={c}
                    className="h-6 w-6 rounded-full border border-border transition-transform hover:scale-110"
                    style={{ backgroundColor: c }}
                    aria-label={`Color ${c}`}
                    onClick={() => setColorOpen(false)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
