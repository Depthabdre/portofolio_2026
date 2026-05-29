"use client";

import dynamic from "next/dynamic";
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
    <section id="hero" className="hero-shell relative min-h-[100svh] overflow-hidden px-5 pt-28 pb-12 sm:px-6 sm:pt-32 sm:pb-12 md:px-12 md:pb-24 lg:px-20 flex flex-col justify-center">
      <div className="hero-grid relative z-20 mx-auto grid w-full max-w-7xl gap-8 sm:gap-12 md:grid-cols-2 md:items-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6 sm:space-y-7 text-center md:text-left flex flex-col items-center md:items-start"
        >
          {/* Typography: Hero heading 48-56px (text-5xl to text-6xl), Title Case, font-bold, tracking-[-0.02em], leading-tight */}
          <motion.h1
            variants={item}
            className="text-balance text-5xl font-bold tracking-[-0.02em] leading-[1.1] text-[var(--hero-text)] sm:text-[56px] lg:text-[64px]"
          >
            {heroContent.title}
          </motion.h1>

          <motion.p
            variants={item}
            className="max-w-2xl text-[13px] sm:text-sm font-medium tracking-[0.08em] text-[var(--hero-muted)] uppercase"
          >
              <strong className="font-semibold text-white">Software Engineer</strong> · <strong className="font-semibold text-[var(--hero-accent)]">A2SV Graduate</strong> · <strong className="font-semibold text-[#54c5f8]">Flutter Developer</strong></motion.p>
          
          {/* Typography: Body 16-18px, font-normal, leading-relaxed, text-balance */}
          <motion.p
            variants={item}
            className="max-w-[70ch] text-base font-normal leading-[1.65] text-white/82 sm:text-lg text-left sm:text-balance"
          >
            {heroContent.intro}
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 pt-2">
            <MagneticLink href={heroContent.primaryCta.href} variant="primary">
              <span className="font-medium">{heroContent.primaryCta.label}</span>
            </MagneticLink>
            <MagneticLink
              href={heroContent.secondaryCta.href}
              variant="secondary"
              target="_blank"
              rel="noreferrer"
              download="Abdrehim_Misbah_Resume.pdf"
            >
              <span className="font-medium">{heroContent.secondaryCta.label}</span>
            </MagneticLink>
          </motion.div>

          <motion.div variants={item} className="flex justify-center md:justify-start items-center gap-4 sm:gap-6 pt-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group text-[13px] tracking-[0.1em] text-white/56 transition-colors hover:text-[var(--hero-accent)]"
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
          className="relative hidden md:block mt-8 md:mt-0"
        >
          <div className="hero-glow absolute inset-8 -z-10 rounded-full blur-3xl" />
          <div className="hero-frame relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] shadow-[0_20px_80px_rgba(6,20,32,0.4)] lg:h-[520px]">
            <HeroScene reducedMotion={Boolean(reducedMotion)} />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.16),transparent_56%)]" />
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute left-6 top-10 z-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(95,198,255,0.22),rgba(95,198,255,0)_70%)] md:left-10" />
      <div className="pointer-events-none absolute right-10 top-28 z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(193,243,111,0.14),rgba(193,243,111,0)_72%)]" />
    </section>
  );
}

