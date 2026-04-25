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
    badge: "current",
    title: "4th-year software engineering student @ aastu",
    description:
      "currently in my 4th year at addis ababa science and technology university. balancing heavy coursework with building side projects and keeping my grades up. just trying to absorb as much knowledge as possible before graduation.",
  },
  {
    id: "item-2",
    badge: "current",
    title: (
      <>
        <span className="normal-case">GDG</span> flutter mentor
      </>
    ),
    description:
      (
        <>
          mentoring the 2026 batch of <span className="normal-case">Google Developer Group (GDG)</span> in flutter. i try my best to help my peers understand clean architecture and debug state management issues. guiding others through their blockers constantly makes me a better developer.
        </>
      ),
  },
  {
    id: "item-3",
    badge: "internship",
    title: "software engineer intern @ eskalate",
    description:
      "had the opportunity to work on a production e-commerce app. i collaborated with the backend team to build secure authentication, product management, and a real-time socket.io chat feature using flutter. wrote a lot of unit tests to make sure we didn't break anything.",
  },
  {
    id: "item-4",
    badge: "academy",
    title: "a2sv (africa to silicon valley) graduate",
    description:
      "completed an intensive, life-changing software engineering program backed by google. spent months diving deep into data structures, algorithms, and system design alongside an incredibly inspiring community.",
  },
  {
    id: "item-5",
    badge: "the roots",
    title: "teaching & community",
    description:
      "i’ve been volunteering to teach and mentor since elementary school (somehow collected 15+ community certificates along the way). i just genuinely believe that the best way to master something is to share it with someone else.",
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
      className="relative overflow-hidden px-6 py-24 md:px-12 lg:px-20"
    >
      <div className="relative mx-auto w-full max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex flex-col items-center justify-center space-y-3 text-center sm:mb-16"
        >
          <p className="text-xs tracking-[0.26em] uppercase text-[var(--hero-muted)]">
            experience
          </p>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.02em] text-[var(--hero-text)] sm:text-4xl lg:text-5xl">
            my journey
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
                <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-[1.5px] border-white/20 bg-[#070b12] outline outline-4 outline-[#070b12] lg:-left-[6px]" />

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.7rem] font-medium tracking-widest text-[#8be8f4] lowercase backdrop-blur-sm">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="mt-2 text-xl font-medium tracking-tight text-white/90 lowercase sm:text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-[#aeb6c2] lowercase sm:text-base">
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
