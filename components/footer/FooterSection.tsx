"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MagneticLink } from "@/components/hero/MagneticLink";
import { FaTelegramPlane, FaLinkedinIn, FaYoutube, FaEnvelope } from "react-icons/fa";
import { IconType } from "react-icons";
import {
  SiFlutter,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiReact,
  SiCplusplus,
  SiPython,
  SiDart,
} from "react-icons/si";
import { MdLayers, MdCloudOff, MdArchitecture } from "react-icons/md";

// Custom Flutter BLoC Icon
const BlocIcon = (props: any) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img 
    src="https://plugins.jetbrains.com/files/12129/953327/icon/default.png" 
    alt="flutter bloc" 
    className={props.className} 
    style={{ ...props.style }}
  />
);

const techStack = [
  { name: "flutter", icon: SiFlutter, color: "text-[#54C5F8]", glow: "shadow-[#54C5F8]/20" },
  { name: "clean architecture", icon: MdLayers, color: "text-[#8BE8F4]", glow: "shadow-[#8BE8F4]/20" },
  { name: "bloc", icon: BlocIcon, color: "text-[#BD8CFF]", glow: "shadow-[#BD8CFF]/20" },
  { name: "node.js", icon: SiNodedotjs, color: "text-[#8AF07D]", glow: "shadow-[#8AF07D]/20" },
  { name: "express", icon: SiExpress, color: "text-[#D6E2F5]", glow: "shadow-[#D6E2F5]/20" },
  { name: "postgresql", icon: SiPostgresql, color: "text-[#336791]", glow: "shadow-[#336791]/20" },
  { name: "react", icon: SiReact, color: "text-[#61DAFB]", glow: "shadow-[#61DAFB]/20" },
  { name: "c++", icon: SiCplusplus, color: "text-[#00599C]", glow: "shadow-[#00599C]/20" },
  { name: "python", icon: SiPython, color: "text-[#3776AB]", glow: "shadow-[#3776AB]/20" },
  { name: "dart", icon: SiDart, color: "text-[#0175C2]", glow: "shadow-[#0175C2]/20" },
  { name: "system design", icon: MdArchitecture, color: "text-[#A6B5CB]", glow: "shadow-[#A6B5CB]/20" },
  { name: "offline-first", icon: MdCloudOff, color: "text-[#FF9E9E]", glow: "shadow-[#FF9E9E]/20" },
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
        className="relative flex w-full flex-col overflow-hidden border-y border-white/5 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent py-8"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
        }}
      >
        <motion.div
          className="flex w-max items-center gap-4 md:gap-8"
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
          {[...techStack, ...techStack, ...techStack].map((tech, i) => {
            const Icon = tech.icon;
            return (
              <div 
                key={i} 
                className="group flex items-center justify-center gap-3 md:gap-4 rounded-full border border-white/5 bg-white/[0.015] px-5 py-3 md:px-6 md:py-3.5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03] hover:-translate-y-0.5"
              >
                <div className={`flex items-center justify-center h-8 w-8 md:h-10 md:w-10 rounded-full border border-white/5 bg-[#070b12] shadow-inner ${tech.glow} transition-colors group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>
                  <Icon className={`h-4 w-4 md:h-5 md:w-5 ${tech.color}`} />
                </div>
                <span className="text-lg font-medium tracking-tight text-white/60 lowercase transition-colors group-hover:text-white/90 md:text-2xl">
                  {tech.name}
                </span>
              </div>
            );
          })}
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
            className="lg:col-span-5 flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <p className="text-[var(--hero-muted)] mb-3 text-xs tracking-[0.26em] uppercase">
              personal life
            </p>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.02em] text-[var(--hero-text)] sm:text-4xl">
              offline
            </h2>
            
            <div className="mt-8 grid w-full grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:justify-start sm:gap-3">
              <div className="group col-span-1 flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[linear-gradient(140deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-3 py-2 text-[0.75rem] text-[var(--hero-text)] shadow-[0_8px_22px_rgba(3,10,22,0.32)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 sm:min-h-0 sm:w-fit sm:rounded-full sm:px-4 sm:py-2 sm:text-sm">
                <span className="text-[var(--hero-accent)] text-sm sm:text-base">🏋️‍♂️</span>
                <span className="whitespace-nowrap">lifting weights</span>
              </div>
              <div className="group col-span-1 flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[linear-gradient(140deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-3 py-2 text-[0.75rem] text-[var(--hero-text)] shadow-[0_8px_22px_rgba(3,10,22,0.32)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 sm:min-h-0 sm:w-fit sm:rounded-full sm:px-4 sm:py-2 sm:text-sm">
                <span className="text-[#54c5f8] text-sm sm:text-base">📚</span>
                <span className="whitespace-nowrap">philosophy & self-help</span>
              </div>
              <div className="group col-span-2 flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[rgba(200,60,60,0.55)] bg-[linear-gradient(140deg,rgba(239,68,68,0.2),rgba(239,68,68,0.08))] px-3 py-2 text-[0.75rem] text-[var(--hero-text)] shadow-[0_8px_22px_rgba(35,8,10,0.32)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(200,60,60,0.8)] sm:min-h-0 sm:w-fit sm:rounded-full sm:px-4 sm:py-2 sm:text-sm">
                <span className="text-red-400 text-sm sm:text-base">⚽</span>
                <span className="whitespace-nowrap">liverpool fc</span>
              </div>
            </div>

            <p className="mt-6 sm:mt-8 max-w-lg text-[0.95rem] leading-7 sm:text-base sm:leading-8 text-[var(--hero-muted)] sm:text-lg">
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
            className="flex flex-col lg:col-span-5 items-center text-center lg:items-end lg:text-right"
          >
            <p className="text-xs tracking-[0.26em] text-white/65 uppercase mb-3">contact</p>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.02em] text-[var(--hero-text)] sm:text-4xl">
              let&apos;s connect
            </h2>
            <p className="mt-4 max-w-sm text-[0.95rem] sm:text-base leading-7 sm:leading-8 text-[var(--hero-muted)] sm:text-lg lg:max-w-[19rem]">
              always down to chat about mobile dev, problem solving, or the weekend&apos;s football match.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-end gap-4 sm:gap-6">
              {socialLinks.map((link) => (
                <MagneticLink key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                  <span 
                    className={`group flex items-center justify-center rounded-3xl sm:rounded-full border border-white/5 bg-white/[0.01] sm:bg-transparent shadow-lg sm:shadow-none p-3 sm:p-0 transition-all duration-300 hover:scale-110 hover:opacity-80 hover:bg-white/[0.03] ${link.colorClass}`}
                    aria-label={link.label}
                  >
                    <link.icon className="h-6 w-6 sm:h-7 sm:w-7 drop-shadow-sm transition-transform duration-300 group-hover:-translate-y-1" />
                  </span>
                </MagneticLink>
              ))}
            </div>
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
