"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  type Variants,
} from "framer-motion";
import { useState } from "react";

type StatCard = {
  id: string;
  title: string;
  subtext: string;
  className: string;
};

const cards: StatCard[] = [
  {
    id: "gpa",
    title: "3.93 gpa",
    subtext:
      "software engineering at aastu. just trying to keep my grades up while building side projects.",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "problems",
    title: "800+ problems solved",
    subtext:
      "leetcode & codeforces. i just really enjoy logic puzzles and practicing algorithms in my free time to stay sharp.",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "community",
    title: "15k+ youtube subs & 3k+ students",
    subtext:
      "i make tutorials and tutor university freshmen in math & psych. honestly, teaching others is the only way i truly understand things.",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    id: "mentor",
    title: "gdsc flutter mentor",
    subtext:
      "helping the 2026 batch figure out flutter. mostly we just debug things together and learn as we go.",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "a2sv",
    title: "a2sv grad & swe intern",
    subtext:
      "completed the a2sv program and interned at eskalate. incredibly grateful for the people i met and learned from there.",
    className: "md:col-span-1 md:row-span-1",
  },
];

const gridVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function QuickStatsBento() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hovered, setHovered] = useState(false);

  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, rgba(130, 224, 255, 0.24), transparent 58%)`;

  return (
    <section id="work" className="relative overflow-hidden px-6 py-24 md:px-12 lg:px-20">
      <div className="relative mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 flex flex-col items-center justify-center space-y-3 text-center sm:mb-16"
          >
            <p className="text-xs tracking-[0.26em] uppercase text-[var(--hero-muted)]">
              quick stats
            </p>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.02em] text-[var(--hero-text)] sm:text-4xl lg:text-5xl">
              a few numbers from my journey so far
            </h2>
          </motion.div>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="group relative"
          onMouseMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            mouseX.set(event.clientX - bounds.left);
            mouseY.set(event.clientY - bounds.top);
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-2 rounded-[1.65rem] opacity-0 blur-xl transition-opacity duration-300"
            style={{ background: spotlight, opacity: hovered ? 1 : 0 }}
          />

          <div className="relative grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[minmax(170px,1fr)]">
            {cards.map((card) => (
              <motion.article
                key={card.id}
                variants={cardVariants}
                whileHover={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
                className={`relative overflow-hidden rounded-2xl border border-white/14 bg-white/[0.04] p-6 backdrop-blur-xl ${card.className}`}
              >
                <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(130deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_40%,rgba(255,255,255,0.01))]" />
                <span className="pointer-events-none absolute inset-0 rounded-2xl border border-white/14" />

                <div className="relative flex h-full flex-col">
                  <h3 className="text-xl font-semibold tracking-[-0.01em] text-white lowercase">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/74 lowercase">
                    {card.subtext}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

