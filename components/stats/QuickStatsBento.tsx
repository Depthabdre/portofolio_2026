"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  type Variants,
} from "framer-motion";
import { useState, type ReactNode } from "react";

type StatCard = {
  id: string;
  title: ReactNode;
  subtext: ReactNode;
  className: string;
};

const cards: StatCard[] = [
  {
    id: "gpa",
    title: "3.93 GPA",
    subtext:
      "Software Engineering at AASTU. I balance rigorous academics with building production-grade software.",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "problems",
    title: "800+ Problems Solved",
    subtext:
      "Across LeetCode and Codeforces. I continuously practice algorithms to maintain sharp problem-solving skills.",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "community",
    title: "15k+ YouTube Subs & 3k+ Students",
    subtext:
      "I create videos sharing software engineering insights and tutor university freshmen and remedial students. Breaking down complex topics accelerates my own technical growth.",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    id: "mentor",
    title: "GDG Flutter Mentor",
    subtext:
      "I guide the 2026 Google Developer Group (GDG) batch, helping peers debug complex issues and instilling clean architecture principles.",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "a2sv",
    title: "A2SV Grad & SWE Intern",
    subtext:
      "I completed the highly selective A2SV program and interned at Eskalate, leveling up my system design and collaboration skills.",
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
    <section id="work" className="relative overflow-hidden px-6 py-12 md:py-24 md:px-12 lg:px-20">
      <div className="relative mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 flex flex-col items-center justify-center space-y-2 text-center sm:mb-16"
          >
            <p className="text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--hero-muted)]">
              QUICK STATS
            </p>
            <h2 className="max-w-2xl text-[28px] font-bold tracking-[-0.02em] text-[var(--hero-text)] sm:text-[32px] lg:text-[36px]">
              A Few Numbers From My Journey So Far
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
                  <h3 className="text-[20px] font-bold tracking-[-0.01em] text-white sm:text-[22px]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-[16px] leading-[1.65] text-white/74 text-left">
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

