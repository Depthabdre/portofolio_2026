"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMemo } from "react";

type MagneticLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  target?: string;
  rel?: string;
  download?: boolean | string;
};

export function MagneticLink({
  href,
  children,
  variant = "secondary",
  target,
  rel,
  download,
}: MagneticLinkProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 20, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 220, damping: 20, mass: 0.3 });

  const baseClass =
    "relative inline-flex h-12 items-center justify-center rounded-full px-6 text-[14px] font-medium tracking-[0.05em] transition-colors duration-300";

  const variantClass = useMemo(() => {
    if (variant === "primary") {
      return "bg-[var(--hero-text)] text-[var(--hero-bg)] shadow-[0_0_24px_rgba(140,240,255,0.28)] hover:bg-[var(--hero-contrast)]";
    }

    return "border border-white/25 bg-white/5 text-[var(--hero-text)] hover:border-[var(--hero-accent)] hover:bg-white/10";
  }, [variant]);

  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      download={download}
      style={{ x: springX, y: springY }}
      className={`${baseClass} ${variantClass}`}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const offsetX = event.clientX - (rect.left + rect.width / 2);
        const offsetY = event.clientY - (rect.top + rect.height / 2);

        x.set(offsetX * 0.2);
        y.set(offsetY * 0.2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.a>
  );
}
