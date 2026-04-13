"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MagneticLink } from "@/components/hero/MagneticLink";
import { FiArrowUpRight } from "react-icons/fi";

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
  username: string;
};

const socialLinks: SocialLink[] = [
  {
    label: "telegram",
    username: "@DepthAbdre",
    href: "https://t.me/DepthAbdre",
  },
  {
    label: "linkedin",
    username: "abdrehim-misbah",
    href: "https://linkedin.com/in/abdrehim-misbah",
  },
  {
    label: "email",
    username: "abdellaabdre@gmail.com",
    href: "mailto:abdellaabdre@gmail.com",
  },
];

export function FooterSection() {
  const reducedMotion = useReducedMotion();

  return (
    <footer id="contact" className="relative flex flex-col pt-16 md:pt-24 z-10 w-full overflow-hidden bg-black text-white/80">
      {/* 1. The Tech Marquee (Infinite Scroll) */}
      <div className="relative flex w-full flex-col overflow-hidden border-y border-white/5 bg-white/[0.02] py-5">
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-24 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-l from-black to-transparent" />
        
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
      <div className="mx-auto w-full max-w-[82rem] px-6 pb-20 pt-20 md:px-12 lg:px-20 md:pt-32">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          
          {/* 2. Offline / Personal Life (Text Block) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <h2 className="text-2xl font-medium tracking-tight text-white lowercase sm:text-3xl">
              offline
            </h2>
            <div className="mt-6 space-y-4 text-[0.95rem] leading-[1.8] text-[#aeb6c2] lowercase sm:text-base">
              <p>
                when i&apos;m away from the keyboard, i spend a lot of time at the gym. lifting weights helps me clear my mind, builds my physical discipline, and gives me the energy to focus when i&apos;m coding.
              </p>
              <p>
                i also read a lot of philosophy and self-help books to keep growing as a person. on weekends, i&apos;m usually watching football—massive liverpool fan (ynwa).
              </p>
            </div>
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
            <h2 className="text-2xl font-medium tracking-tight text-white lowercase sm:text-3xl">
              let&apos;s connect
            </h2>
            <p className="mt-4 max-w-sm text-[0.95rem] leading-[1.7] text-[#aeb6c2] lowercase sm:text-base lg:max-w-[19rem]">
              always down to chat about mobile dev, problem solving, or the weekend&apos;s football match.
            </p>

            <ul className="mt-8 flex flex-col items-start gap-4 lg:items-end">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <MagneticLink href={link.href} target="_blank" rel="noopener noreferrer">
                    <span className="flex items-center gap-2">
                      <span className="text-white/50">{link.label}:</span>
                      <span className="text-[var(--hero-text)]">{link.username}</span>
                      <FiArrowUpRight className="h-3.5 w-3.5 opacity-60 ml-0.5" />
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