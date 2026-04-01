"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type TrailPoint = {
  id: number;
  x: number;
  y: number;
};

export function CustomCursor() {
  const enabled = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => undefined;
      }

      const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
      const handleChange = () => onStoreChange();

      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    },
    () => {
      if (typeof window === "undefined") {
        return false;
      }

      return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    },
    () => false,
  );
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const idRef = useRef(0);

  const cursorX = useSpring(0, { stiffness: 460, damping: 34, mass: 0.25 });
  const cursorY = useSpring(0, { stiffness: 460, damping: 34, mass: 0.25 });
  const ringX = useSpring(0, { stiffness: 220, damping: 22, mass: 0.6 });
  const ringY = useSpring(0, { stiffness: 220, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleMove = (event: MouseEvent) => {
      cursorX.set(event.clientX - 4);
      cursorY.set(event.clientY - 4);
      ringX.set(event.clientX - 16);
      ringY.set(event.clientY - 16);

      setTrail((prev) => {
        idRef.current += 1;
        const next = [
          { id: idRef.current, x: event.clientX, y: event.clientY },
          ...prev,
        ];

        return next.slice(0, 8);
      });
    };

    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, [cursorX, cursorY, enabled, ringX, ringY]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      {trail.map((point, index) => (
        <motion.span
          key={point.id}
          className="pointer-events-none fixed z-[70] h-1.5 w-1.5 rounded-full bg-[var(--hero-accent)]"
          style={{
            left: point.x - 3,
            top: point.y - 3,
            opacity: Math.max(0.12, 0.52 - index * 0.06),
            scale: Math.max(0.4, 1 - index * 0.09),
          }}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: Math.max(0.08, 0.44 - index * 0.06) }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        />
      ))}
      <motion.span
        className="pointer-events-none fixed z-[80] h-2 w-2 rounded-full bg-[var(--hero-accent)]"
        style={{ x: cursorX, y: cursorY }}
      />
      <motion.span
        className="pointer-events-none fixed z-[75] h-8 w-8 rounded-full border border-white/30"
        style={{ x: ringX, y: ringY }}
      />
    </>
  );
}
