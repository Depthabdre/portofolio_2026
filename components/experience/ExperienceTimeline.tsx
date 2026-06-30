"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

type TimelineItem = {
  id: string;
  badge: string;
  title: ReactNode;
  description: ReactNode;
};

const items: TimelineItem[] = [
  {
    id: "item-1",
    badge: "CURRENT",
    title: "Frontend Engineering Intern @ Horan Technologies",
    description:
      "Building responsive, accessible web interfaces using modern frontend frameworks. Collaborating with UI/UX designers to implement pixel-accurate designs and integrating frontend components with backend APIs on live client products.",
  },
  {
    id: "item-2",
    badge: "MENTORSHIP",
    title: "GDG Flutter Mentor",
    description:
      "I mentor the 2026 batch of the Google Developer Group (GDG) in Flutter. I help peers debug state management issues, enforce clean architecture, and navigate technical blockers, accelerating their development velocity.",
  },
  {
    id: "item-3",
    badge: "EDUCATION",
    title: "Software Engineering · AASTU",
    description:
      "I am currently completing my final year, balancing academic coursework with continuous real-world client engagements and personal application development.",
  },
  {
    id: "item-4",
    badge: "INTERNSHIP",
    title: "Software Engineer Intern @ Eskalate",
    description:
      "I collaborated with a cross-functional team to engineer a production e-commerce application. I designed secure authentication flows, product management dashboards, and a real-time socket.io chat architecture using Flutter.",
  },
  {
    id: "item-5",
    badge: "ACADEMY",
    title: "A2SV Graduate",
    description:
      "I completed an intensive software engineering program backed by Google, focusing on advanced data structures, algorithms, and system design alongside top-tier engineers.",
  },
  {
    id: "item-6",
    badge: "COMMUNITY",
    title: "Teaching & Community",
    description:
      "I actively volunteer to teach and mentor software concepts. Explaining complex technical problems ensures I deeply understand the systems I build.",
  },
];

export function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress roughly through the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Calculate beam scaleY based on scroll progress
  // It stretches vertically from top to bottom
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="experience"
      className="relative overflow-hidden px-6 py-12 md:py-24 md:px-12 lg:px-20"
    >
      <div className="relative mx-auto w-full max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex flex-col items-center justify-center space-y-2 text-center sm:mb-16"
        >
          <p className="text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--hero-muted)]">
            EXPERIENCE
          </p>
          <h2 className="max-w-2xl text-[28px] font-bold tracking-[-0.02em] text-[var(--hero-text)] sm:text-[32px] lg:text-[36px]">
            My Journey
          </h2>
        </motion.div>

        {/* Timeline Container */}
        <div ref={containerRef} className="relative ml-4 sm:ml-8 md:ml-12 lg:ml-20">
          {/* Background Static Line */}
          <div className="absolute bottom-0 left-0 top-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent lg:-left-px" />

          {/* Animated Tracing Beam Line */}
          <motion.div
            className="absolute bottom-0 left-0 top-0 w-[1px] origin-top bg-gradient-to-b from-transparent via-white/80 to-[var(--hero-accent)] lg:-left-px shadow-[0_0_12px_2px_rgba(255,255,255,0.4)]"
            style={{ scaleY }}
          />

          {/* Timeline Items */}
          <div className="space-y-16">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                className="relative pl-8 md:pl-12"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: index * 0.1,
                }}
              >
                {/* Glowing Dot on the Line */}
                <div className="absolute -left-1.25 top-1.5 h-2.5 w-2.5 rounded-full border-[1.5px] border-white/20 bg-[#070b12] outline outline-[#070b12] lg:-left-[6px]" />

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[13px] font-medium tracking-widest text-[#8be8f4] uppercase backdrop-blur-sm">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="mt-2 text-[20px] font-bold tracking-tight text-white/90 sm:text-[22px]">
                    {item.title}
                  </h3>

                  <p className="mt-2 max-w-[70ch] text-[16px] leading-[1.65] text-[#aeb6c2] text-left">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}