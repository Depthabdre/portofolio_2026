"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MagneticLink } from "@/components/hero/MagneticLink";
import { FiArrowUpRight } from "react-icons/fi";
import { FaTelegramPlane, FaLinkedinIn, FaYoutube, FaEnvelope } from "react-icons/fa";
import { IconType } from "react-icons";

const techStack = [
  "flutter",
  "clean architecture",
  "bloc",
  "node.js",
  "express",
  "postgresql",
  "react",
  "c++",
  "python",
  "dart",
  "system design",
  "offline-first",
];

type SocialLink = {
  label: string;
  href: string;
  icon: IconType;
  colorClass: string;
};

const socialLinks: SocialLink[] = [
  {
    label: "telegram",
    href: "https://t.me/DepthAbdre",
    icon: FaTelegramPlane,
    colorClass: "text-[#24A1DE]",
  },
  {
    label: "linkedin",
    href: "https://linkedin.com/in/abdrehim-misbah",
    icon: FaLinkedinIn,
    colorClass: "text-[#0A66C2]",
  },
  {
    label: "email",
    href: "mailto:abdrehimmisbah@gmail.com",
    icon: FaEnvelope,
    colorClass: "text-[#10B981]",
  },
  {
    label: "youtube",
    href: "https://www.youtube.com/@remedialAbdre",
    icon: FaYoutube,
    colorClass: "text-[#FF0000]",
  },
];

export function FooterSection() {
  const reducedMotion = useReducedMotion();

  return (
    <footer id="contact" className="relative flex flex-col pt-16 md:pt-24 z-10 w-full overflow-hidden text-[var(--hero-text)]">
      {/* 1. The Tech Marquee (Infinite Scroll) */}
      <div 
        className="relative flex w-full flex-col overflow-hidden border-y border-white/5 bg-white/[0.02] py-5"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
        }}
      >
        <motion.div
          className="flex w-max items-center gap-6 md:gap-12"
          animate={reducedMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: 40,
                  ease: "linear",
                  repeat: Infinity,
                }
          }
        >
          {/* Double array for seamless loop */}
          {[...techStack, ...techStack, ...techStack].map((tech, i) => (
            <div key={i} className="flex items-center gap-6 md:gap-12 whitespace-nowrap">
              <span className="text-3xl font-medium tracking-[-0.02em] text-white/50 lowercase md:text-5xl">
                {tech}
              </span>
              <span className="text-white/20">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Main Content Layout */}
      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          
          {/* 2. Offline / Personal Life (Text Block) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <p className="text-[var(--hero-muted)] mb-3 text-xs tracking-[0.26em] uppercase">
              personal life
            </p>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.02em] text-[var(--hero-text)] sm:text-4xl">
              offline
            </h2>
            
            <div className="mt-8 flex w-full items-center gap-2 overflow-x-auto pb-2 sm:gap-3 sm:overflow-visible sm:pb-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.7rem] text-[var(--hero-text)] shadow-sm backdrop-blur-md transition-colors hover:border-white/20 sm:gap-2.5 sm:px-4 sm:py-2 sm:text-sm">
                <span className="text-[var(--hero-accent)] text-xs sm:text-base">🏋️‍♂️</span> <span className="whitespace-nowrap">lifting weights</span>
              </div>
              <div className="flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.7rem] text-[var(--hero-text)] shadow-sm backdrop-blur-md transition-colors hover:border-white/20 sm:gap-2.5 sm:px-4 sm:py-2 sm:text-sm">
                <span className="text-[#54c5f8] text-xs sm:text-base">📚</span> <span className="whitespace-nowrap">philosophy & self-help</span>
              </div>
              <div className="flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-[rgba(200,60,60,0.5)] bg-red-500/10 px-3 py-1.5 text-[0.7rem] text-[var(--hero-text)] shadow-sm backdrop-blur-md transition-colors hover:border-[rgba(200,60,60,0.8)] sm:gap-2.5 sm:px-4 sm:py-2 sm:text-sm">
                <span className="text-red-400 text-xs sm:text-base">⚽</span> <span className="whitespace-nowrap">liverpool fc</span>
              </div>
            </div>

            <p className="mt-8 max-w-lg text-base leading-8 text-[var(--hero-muted)] sm:text-lg">
              working on my physical side creates real balance with my mind, boosting both my energy and confidence. i also read constantly to gain new perspectives, and on weekends, you&apos;ll find me supporting the reds in full voice. a balanced life is everything.
            </p>
          </motion.div>

          <div className="hidden lg:col-span-2 lg:block"></div>

          {/* 3. The Footer (Contact) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="flex flex-col lg:col-span-5 lg:items-end lg:text-right"
          >
            <p className="text-xs tracking-[0.26em] text-white/65 uppercase mb-3">contact</p>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.02em] text-[var(--hero-text)] sm:text-4xl">
              let&apos;s connect
            </h2>
            <p className="mt-4 max-w-sm text-base leading-8 text-[var(--hero-muted)] sm:text-lg lg:max-w-[19rem]">
              always down to chat about mobile dev, problem solving, or the weekend&apos;s football match.
            </p>

            <ul className="mt-8 flex items-center justify-start gap-4 sm:gap-6 lg:justify-end">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <MagneticLink href={link.href} target="_blank" rel="noopener noreferrer">
                    <span 
                      className={`flex items-center justify-center transition-all duration-300 hover:scale-110 hover:opacity-80 ${link.colorClass}`}
                      aria-label={link.label}
                    >
                      <link.icon className="h-7 w-7 drop-shadow-sm" />
                    </span>
                  </MagneticLink>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Quote & Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-28 flex flex-col items-center justify-center gap-8 border-t border-white/10 pt-10 text-center"
        >
          <p className="text-sm font-light italic tracking-widest text-white/30 lowercase mix-blend-plus-lighter">
            &quot;we aren&apos;t given anything we can&apos;t handle.&quot;
          </p>
          <span className="text-xs text-white/20 lowercase tracking-widest">
            © {new Date().getFullYear()} abdrehim misbah.
          </span>
        </motion.div>
      </div>
    </footer>
  );
}