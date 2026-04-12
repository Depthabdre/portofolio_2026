"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import type { IconType } from "react-icons";
import {
  SiExpress,
  SiFlutter,
  SiNodedotjs,
  SiOpenai,
} from "react-icons/si";
import { MdAccountTree, MdLayers, MdLock } from "react-icons/md";

// Custom Flutter BLoC Icon based on the official bloclibrary.dev logo structure
const BlocIcon = (props: React.ComponentProps<"svg">) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-3H8v-3h3v-3h3v3h3v3h-3v3h-3z" />
  </svg>
);

type TechIcon = {
  id: string;
  label: string;
  icon: IconType;
  iconClass: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  techIcons: TechIcon[];
  buttonLabel: string;
  buttonHref: string;
  onButtonClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  railTone: "cyan" | "lime";
};

const projects: Project[] = [
  {
    id: "a-plus",
    title: "A+ tutorial class (client project)",
    description:
      "i built this with a backend friend for a tutorial agency. i mostly focused on keeping learning content secure while still keeping the app simple for students.",
    bullets: [
      "serving 2K+ active university students.",
      "added live mcq contests with real-time updates.",
      "uses offline drm with kernel-uptime checks and single-device access.",
    ],
    techIcons: [
      { id: "flutter", label: "flutter", icon: SiFlutter, iconClass: "text-[#67d8ff]" },
      {
        id: "bloc",
        label: "flutter bloc",
        icon: BlocIcon,
        iconClass: "text-[#bd8cff]",
      },
      {
        id: "clean-architecture",
        label: "clean architecture",
        icon: MdLayers,
        iconClass: "text-[#8be8f4]",
      },
      {
        id: "encryption",
        label: "encryption",
        icon: MdLock,
        iconClass: "text-[#c9efff]",
      },
    ],
    buttonLabel: "[ private repo ]",
    buttonHref: "#",
    onButtonClick: (e) => {
      e.preventDefault();
      alert("This is a private repo for client's privacy.");
    },
    railTone: "cyan",
  },
  {
    id: "real-english",
    title: "Real English (personal project)",
    description:
      "i built this because i wanted language learning to feel natural, not stressful. i handled both flutter and node.js to keep the experience simple and immersive for learners.",
    bullets: [
      "fully ai-powered story engine using gemini api for story paths, gemini text-to-voice, and pollination ai scene images.",
      "immersion feed uses a tiktok-style experience with smooth preloading.",
      "growth garden tracks streaks through a simple gamified tree profile.",
    ],
    techIcons: [
      { id: "flutter", label: "flutter", icon: SiFlutter, iconClass: "text-[#67d8ff]" },
      {
        id: "nodejs",
        label: "node.js",
        icon: SiNodedotjs,
        iconClass: "text-[#8af07d]",
      },
      {
        id: "express",
        label: "express",
        icon: SiExpress,
        iconClass: "text-[#d6e2f5]",
      },
      {
        id: "modular-monolith",
        label: "modular monolith",
        icon: MdLayers,
        iconClass: "text-[#a1f3c6]",
      },
      {
        id: "ai-integration",
        label: "ai integration",
        icon: SiOpenai,
        iconClass: "text-[#b9f0cf]",
      },
    ],
    buttonLabel: "[ view code ]",
    buttonHref: "https://github.com/Depthabdre/real_english",
    railTone: "lime",
  },
];

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function UiRail({ tone }: { tone: "cyan" | "lime" }) {
  const reducedMotion = useReducedMotion();
  const palette =
    tone === "cyan"
      ? [
          "from-[#15263d] to-[#0f1c2d]",
          "from-[#182f46] to-[#122537]",
          "from-[#123248] to-[#10263a]",
          "from-[#0f2942] to-[#122135]",
        ]
      : [
          "from-[#1e2f27] to-[#16231f]",
          "from-[#263a30] to-[#1a2720]",
          "from-[#223728] to-[#1b2b20]",
          "from-[#293d2c] to-[#1d2a22]",
        ];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-black/35 p-3">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.12),transparent_54%)]" />
      <motion.div
        className="flex w-max gap-4"
        animate={reducedMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reducedMotion
            ? undefined
            : {
                duration: 24,
                ease: "linear",
                repeat: Infinity,
              }
        }
      >
        {[...Array(6)].map((_, index) => {
          const toneClass = palette[index % palette.length];

          return (
            <div
              key={`screen-${index}`}
              className={`relative h-[220px] w-[132px] shrink-0 rounded-2xl border border-white/12 bg-gradient-to-b ${toneClass} p-3 shadow-[0_16px_35px_rgba(2,8,15,0.4)]`}
            >
              <div className="h-3 w-16 rounded-full bg-white/20" />
              <div className="mt-3 h-16 rounded-xl bg-white/8" />
              <div className="mt-3 h-3 w-10/12 rounded-full bg-white/18" />
              <div className="mt-2 h-3 w-8/12 rounded-full bg-white/12" />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="h-10 rounded-lg bg-white/10" />
                <div className="h-10 rounded-lg bg-white/10" />
              </div>
            </div>
          );
        })}
        {[...Array(6)].map((_, index) => {
          const toneClass = palette[index % palette.length];

          return (
            <div
              key={`screen-dup-${index}`}
              className={`relative h-[220px] w-[132px] shrink-0 rounded-2xl border border-white/12 bg-gradient-to-b ${toneClass} p-3 shadow-[0_16px_35px_rgba(2,8,15,0.4)]`}
            >
              <div className="h-3 w-16 rounded-full bg-white/20" />
              <div className="mt-3 h-16 rounded-xl bg-white/8" />
              <div className="mt-3 h-3 w-10/12 rounded-full bg-white/18" />
              <div className="mt-2 h-3 w-8/12 rounded-full bg-white/12" />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="h-10 rounded-lg bg-white/10" />
                <div className="h-10 rounded-lg bg-white/10" />
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

function ProjectCard({
  project,
}: {
  project: Project;
}) {
  return (
    <motion.article
      variants={sectionVariants}
      className="relative h-full w-full rounded-[1.75rem] border border-white/14 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03)_48%,rgba(255,255,255,0.015))] p-5 shadow-[0_24px_90px_rgba(3,10,20,0.46)] backdrop-blur-xl md:p-6 xl:p-7"
      whileHover={{ y: -4, scale: 0.995 }}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-[radial-gradient(circle_at_8%_0%,rgba(130,224,255,0.12),transparent_36%),radial-gradient(circle_at_85%_0%,rgba(191,249,122,0.08),transparent_40%)]" />

      <div className="relative flex h-full flex-col">
        <div
          data-align="title"
          className="flex items-start gap-4"
        >
          <h3 className="max-w-5xl text-[1.45rem] font-semibold tracking-[-0.015em] text-[var(--hero-text)] md:text-[1.62rem] xl:text-[1.74rem]">
            {project.title}
          </h3>
        </div>

        <p
          data-align="description"
          className="mt-3 max-w-5xl text-sm leading-6 text-white/80 lowercase md:text-[0.93rem]"
        >
          {project.description}
        </p>

        <div
          data-align="bullets"
          className="mt-5"
        >
          <ul className="list-disc space-y-2.5 pl-5 text-sm leading-6.5 text-white/76 lowercase md:text-[0.92rem]">
            {project.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>

        <div
          data-align="meta"
          className="mt-5 grid grid-cols-1 gap-3 border-y border-white/10 py-3 md:grid-cols-[auto_1fr] md:items-center md:gap-4"
        >
          <a
            href={project.buttonHref}
            onClick={project.onButtonClick}
            target={project.buttonHref !== "#" ? "_blank" : undefined}
            rel={project.buttonHref !== "#" ? "noopener noreferrer" : undefined}
            className="inline-flex w-fit items-center rounded-full border border-white/24 bg-white/7 px-4.5 py-2.5 text-sm tracking-[0.11em] text-white/84 lowercase transition-colors duration-300 hover:border-[var(--hero-accent)] hover:text-[var(--hero-accent)]"
          >
            {project.buttonLabel}
          </a>

          <div className="flex flex-wrap items-center gap-2 md:justify-end" role="list" aria-label="technology used">
            {project.techIcons.map((tech) => {
              const TechIconComponent = tech.icon;

              return (
                <span
                  key={tech.id}
                  title={tech.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/15 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                >
                  <TechIconComponent className={`h-5 w-5 ${tech.iconClass}`} aria-hidden="true" />
                  <span className="sr-only">{tech.label}</span>
                </span>
              );
            })}
          </div>
        </div>

        <div className="relative mt-5 flex min-h-[230px] flex-1 flex-col">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-[0.72rem] tracking-[0.17em] text-white/52 lowercase">
              product ui preview rail
            </span>
            <span className="text-[0.72rem] tracking-[0.17em] text-white/45 lowercase">
              replaceable with real screenshots later
            </span>
          </div>
          <div className="flex-1">
            <UiRail tone={project.railTone} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function FeaturedProjects() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) {
      return;
    }

    const sections = ["title", "description", "bullets", "meta"] as const;

    const measure = () => {
      if (!cardsRef.current) {
        return;
      }

      sections.forEach((section) => {
        const nodes = Array.from(
          cardsRef.current?.querySelectorAll<HTMLElement>(`[data-align="${section}"]`) ?? []
        );

        if (nodes.length <= 1) return;

        // Reset to natural height
        nodes.forEach((node) => {
          node.style.minHeight = "0px";
        });

        // Find max natural height
        let maxHeight = 0;
        nodes.forEach((node) => {
          maxHeight = Math.max(maxHeight, Math.ceil(node.scrollHeight));
        });

        // Apply explicitly
        nodes.forEach((node) => {
          node.style.minHeight = `${maxHeight}px`;
        });
      });
    };

    measure();

    const observer = new ResizeObserver(() => {
      // Need `requestAnimationFrame` to avoid "ResizeObserver loop limit exceeded" errors.
      requestAnimationFrame(() => measure());
    });

    const nodes = Array.from(cardsRef.current.querySelectorAll<HTMLElement>("[data-align]"));
    nodes.forEach((node) => observer.observe(node));

    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section id="projects" className="relative px-6 pb-20 pt-6 md:px-12 lg:px-20">
      <div className="relative mx-auto w-full max-w-[82rem]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3"
        >
          <p className="text-xs tracking-[0.26em] text-white/60 lowercase">featured projects</p>
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-[var(--hero-text)] lowercase sm:text-4xl">
            stuff i&apos;ve built
          </h2>
        </motion.div>

        <div
          ref={cardsRef}
          className="relative mt-10 grid grid-cols-1 gap-6 lg:auto-rows-fr lg:grid-cols-2 lg:items-stretch"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="h-full"
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
