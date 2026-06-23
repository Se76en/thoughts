"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
  texts: string[];
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}

export function Typewriter({
  texts,
  className = "",
  speed = 60,
  deleteSpeed = 30,
  pauseDuration = 2000,
}: TypewriterProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (charIndex < currentText.length) {
            setCharIndex((prev) => prev + 1);
          } else {
            setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        } else {
          if (charIndex > 0) {
            setCharIndex((prev) => prev - 1);
          } else {
            setIsDeleting(false);
            setTextIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? deleteSpeed : speed
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, speed, deleteSpeed, pauseDuration]);

  return (
    <span className={className}>
      {texts[textIndex].slice(0, charIndex)}
      <span className="animate-pulse text-accent">|</span>
    </span>
  );
}
