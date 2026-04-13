"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { MagneticLink } from "@/components/hero/MagneticLink";
import { heroContent, socialLinks } from "@/lib/content/hero";

const HeroScene = dynamic(() => import("@/components/hero/HeroScene"), {
  ssr: false,
  loading: () => <div className="h-[420px] w-full rounded-3xl bg-white/[0.04]" />,
});

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.18,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function HeroSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="hero-shell relative min-h-screen overflow-hidden px-6 py-10 md:px-12 md:py-12 lg:px-20">
      <div className="hero-grid relative z-20 mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-7"
        >
          <motion.p
            variants={item}
            className="text-xs tracking-[0.26em] text-white/65 uppercase"
          >
            portfolio 2026
          </motion.p>

          <motion.h1
            variants={item}
            className="text-balance text-4xl font-semibold tracking-[-0.03em] text-[var(--hero-text)] sm:text-5xl lg:text-7xl"
          >
            {heroContent.title}
          </motion.h1>

          <motion.p
            variants={item}
              className="max-w-xl text-sm tracking-[0.08em] text-[var(--hero-muted)] sm:text-base leading-relaxed"
            >
              <strong className="font-semibold text-white">SWE @ AASTU</strong> | <strong className="font-semibold text-[var(--hero-accent)]">a2sv graduate</strong> | <strong className="font-semibold text-[#54c5f8]">flutter developer</strong></motion.p>
          <motion.p
            variants={item}
            className="max-w-2xl text-base leading-8 text-white/82 sm:text-lg"
          >
            {heroContent.intro}
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-4 pt-1">
            <MagneticLink href={heroContent.primaryCta.href} variant="primary">
              {heroContent.primaryCta.label}
            </MagneticLink>
            <MagneticLink
              href={heroContent.secondaryCta.href}
              variant="secondary"
              target="_blank"
              rel="noreferrer"
            >
              {heroContent.secondaryCta.label}
            </MagneticLink>
          </motion.div>

          <motion.div variants={item} className="flex items-center gap-4 pt-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group text-sm tracking-[0.16em] text-white/56 lowercase transition-colors hover:text-[var(--hero-accent)]"
              >
                <span className="relative inline-block">
                  {link.label}
                  <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[var(--hero-accent)] transition-transform duration-300 group-hover:scale-x-100" />
                </span>
              </a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reducedMotion ? 0.2 : 0.8,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.2,
          }}
          className="relative"
        >
          <div className="hero-glow absolute inset-8 -z-10 rounded-full blur-3xl" />
          <div className="hero-frame relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] shadow-[0_30px_120px_rgba(6,20,32,0.58)] lg:h-[520px]">
            <HeroScene reducedMotion={Boolean(reducedMotion)} />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.16),transparent_56%)]" />
          </div>
          <div className="mt-5 flex items-center gap-4 rounded-2xl border border-white/10 bg-black/35 p-3 backdrop-blur-md">
            <Image
              src={heroContent.profileImage}
              alt="abdrehim profile"
              width={56}
              height={56}
              className="h-14 w-14 rounded-xl border border-white/20 object-cover"
            />
            <p className="text-sm leading-6 text-white/72">
              always down to chat about mobile systems, clean architecture, and building things that actually help people.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex justify-center">
          <a href="#projects" className="pointer-events-auto flex flex-col items-center gap-2 text-white/45 hover:text-white transition-colors duration-300">
            <span className="text-xs tracking-[0.18em] lowercase">scroll</span>
            <span className="h-10 w-px animate-pulse bg-gradient-to-b from-transparent via-white/70 to-transparent" />
          </a>
        </div>

      <div className="pointer-events-none absolute left-6 top-10 z-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(95,198,255,0.22),rgba(95,198,255,0)_70%)] md:left-10" />
      <div className="pointer-events-none absolute right-10 top-28 z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(193,243,111,0.14),rgba(193,243,111,0)_72%)]" />
      <p className="pointer-events-none absolute bottom-5 left-6 z-20 text-xs tracking-[0.13em] text-white/45 lowercase md:left-12">
        {heroContent.quote}
      </p>
    </section>
  );
}

