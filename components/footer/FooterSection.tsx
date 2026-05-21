"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MagneticLink } from "@/components/hero/MagneticLink";
import { FaTelegramPlane, FaLinkedinIn, FaYoutube, FaEnvelope } from "react-icons/fa";
import { IconType, IconBaseProps } from "react-icons";
import {
  SiFlutter,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiReact,
  SiCplusplus,
  SiPython,
  SiDart,
  SiNextdotjs,
} from "react-icons/si";
import { MdLayers, MdCloudOff, MdArchitecture } from "react-icons/md";

// Custom Flutter BLoC Icon
const BlocIcon = (props: IconBaseProps) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img 
    src="https://plugins.jetbrains.com/files/12129/953327/icon/default.png" 
    alt="flutter bloc" 
    className={props.className} 
    style={{ ...props.style }}
  />
);

const techStack = [
  { name: "FLUTTER", icon: SiFlutter, color: "text-[#54C5F8]", glow: "shadow-[#54C5F8]/20" },
  { name: "CLEAN ARCHITECTURE", icon: MdLayers, color: "text-[#8BE8F4]", glow: "shadow-[#8BE8F4]/20" },
  { name: "BLOC", icon: BlocIcon, color: "text-[#BD8CFF]", glow: "shadow-[#BD8CFF]/20" },
  { name: "NODE.JS", icon: SiNodedotjs, color: "text-[#8AF07D]", glow: "shadow-[#8AF07D]/20" },
  { name: "EXPRESS", icon: SiExpress, color: "text-[#D6E2F5]", glow: "shadow-[#D6E2F5]/20" },
  { name: "POSTGRESQL", icon: SiPostgresql, color: "text-[#336791]", glow: "shadow-[#336791]/20" },
  { name: "REACT", icon: SiReact, color: "text-[#61DAFB]", glow: "shadow-[#61DAFB]/20" },
  { name: "NEXT.JS", icon: SiNextdotjs, color: "text-[#ffffff]", glow: "shadow-[#ffffff]/20" },
  { name: "C++", icon: SiCplusplus, color: "text-[#00599C]", glow: "shadow-[#00599C]/20" },
  { name: "PYTHON", icon: SiPython, color: "text-[#3776AB]", glow: "shadow-[#3776AB]/20" },
  { name: "DART", icon: SiDart, color: "text-[#0175C2]", glow: "shadow-[#0175C2]/20" },
  { name: "SYSTEM DESIGN", icon: MdArchitecture, color: "text-[#A6B5CB]", glow: "shadow-[#A6B5CB]/20" },
  { name: "OFFLINE-FIRST", icon: MdCloudOff, color: "text-[#FF9E9E]", glow: "shadow-[#FF9E9E]/20" },
];

type SocialLink = {
  label: string;
  href: string;
  icon: IconType;
  colorClass: string;
};

const socialLinks: SocialLink[] = [
  {
    label: "Telegram",
    href: "https://t.me/DepthAbdre",
    icon: FaTelegramPlane,
    colorClass: "text-[#24A1DE]",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/abdrehim-misbah",
    icon: FaLinkedinIn,
    colorClass: "text-[#0A66C2]",
  },
  {
    label: "Email",
    href: "mailto:abdrehimmisbah@gmail.com",
    icon: FaEnvelope,
    colorClass: "text-[#10B981]",
  },
  {
    label: "YouTube",
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
                <span className="text-[18px] md:text-[24px] font-bold tracking-tight text-white/60 transition-colors group-hover:text-white/90">
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
            <p className="text-[var(--hero-muted)] mb-3 text-[13px] font-medium tracking-[0.1em] uppercase">
              PERSONAL LIFE
            </p>
            <h2 className="max-w-2xl text-[28px] font-bold tracking-[-0.02em] text-[var(--hero-text)] sm:text-[32px] lg:text-[36px]">
              Outside of Work
            </h2>
            
            <div className="mt-8 grid w-full grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:justify-start sm:gap-3">
              <div className="group col-span-1 flex min-h-12 items-center justify-center gap-1.5 sm:gap-2 rounded-2xl border border-white/10 bg-[linear-gradient(140deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-2 py-2 text-[11px] min-[375px]:text-[12px] sm:text-[14px] font-medium text-[var(--hero-text)] shadow-[0_8px_22px_rgba(3,10,22,0.32)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 sm:min-h-0 sm:w-fit sm:rounded-full sm:px-4 sm:py-2 text-center">
                <span className="text-[var(--hero-accent)] text-sm sm:text-base">🏋️‍♂️</span>
                <span className="leading-tight sm:whitespace-nowrap">Lifting Weights</span>
              </div>
              <div className="group col-span-1 flex min-h-12 items-center justify-center gap-1.5 sm:gap-2 rounded-2xl border border-white/10 bg-[linear-gradient(140deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-2 py-2 text-[11px] min-[375px]:text-[12px] sm:text-[14px] font-medium text-[var(--hero-text)] shadow-[0_8px_22px_rgba(3,10,22,0.32)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 sm:min-h-0 sm:w-fit sm:rounded-full sm:px-4 sm:py-2 text-center">
                <span className="text-[#54c5f8] text-sm sm:text-base">📚</span>
                <span className="leading-tight sm:whitespace-nowrap">Philosophy & Self-Help</span>
              </div>
              <div className="group col-span-2 flex min-h-12 items-center justify-center gap-1.5 sm:gap-2 rounded-2xl border border-[rgba(200,60,60,0.55)] bg-[linear-gradient(140deg,rgba(239,68,68,0.2),rgba(239,68,68,0.08))] px-2 py-2 text-[11px] min-[375px]:text-[12px] sm:text-[14px] font-medium text-[var(--hero-text)] shadow-[0_8px_22px_rgba(35,8,10,0.32)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(200,60,60,0.8)] sm:min-h-0 sm:w-fit sm:rounded-full sm:px-4 sm:py-2 text-center">
                <span className="text-red-400 text-sm sm:text-base">⚽</span>
                <span className="leading-tight sm:whitespace-nowrap">Liverpool FC</span>
              </div>
            </div>

            <p className="mt-6 sm:mt-8 max-w-[70ch] text-[16px] leading-[1.65] text-[var(--hero-muted)] text-left sm:text-balance">
              I balance my rigorous engineering schedule by lifting weights to build physical and mental resilience. I read extensively across philosophy and psychology to refine my mental models and spend weekends supporting Liverpool FC.
            </p>
          </motion.div>

          <div className="hidden lg:col-span-2 lg:block"></div>

          {/* 3. The Footer (Contact) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="flex flex-col lg:col-span-5 items-center text-center lg:items-center lg:text-center"
          >
            <p className="text-[13px] font-medium tracking-[0.1em] text-white/65 uppercase mb-3">CONTACT</p>
            <h2 className="max-w-2xl text-[28px] font-bold tracking-[-0.02em] text-[var(--hero-text)] sm:text-[32px] lg:text-[36px]">
              Let&apos;s Connect
            </h2>
            <p className="mt-4 max-w-[70ch] text-[16px] leading-[1.65] text-[var(--hero-muted)]">
              Open to freelance and full-time roles — let&apos;s talk.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
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
          <p className="text-[14px] font-normal italic tracking-wide text-white/30 mix-blend-plus-lighter">
            &quot;We aren&apos;t given anything we can&apos;t handle.&quot;
          </p>
          <span className="text-[13px] text-white/20 tracking-wider">
            © {new Date().getFullYear()} Abdrehim Misbah.
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
