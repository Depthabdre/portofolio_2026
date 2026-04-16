"use client";

import { motion, useReducedMotion, AnimatePresence, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  SiExpress,
  SiFlutter,
  SiNodedotjs,
  SiGooglegemini,
  SiGithub,
} from "react-icons/si";
import { MdLayers, MdLock } from "react-icons/md";
import type { IconBaseProps } from "react-icons";
import Image from "next/image";

// Custom Flutter BLoC Icon using the provided official image
const BlocIcon = (props: IconBaseProps) => (
  /* eslint-disable-next-line @next/next/no-img-element */
  <img 
    src="https://plugins.jetbrains.com/files/12129/953327/icon/default.png" 
    alt="flutter bloc" 
    className={props.className} 
    style={{ display: "inline-block", ...props.style }}
  />
);

type TechIcon = {
  id: string;
  label: string;
  icon: IconType;
  iconClass: string;
};

type ProjectLink = {
  label: string;
  href: string;
  isPrivate?: boolean;
};

type Project = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  techIcons: TechIcon[];
  links: ProjectLink[];
  uiImages: string[];
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
    links: [
      {
        label: "mobile app",
        href: "https://github.com/Depthabdre/a_plus_tutorial_app",
        isPrivate: true,
      },
    ],
    uiImages: [
      "/APlus/Screenshot_20260413-170535.jpg",
      "/APlus/Screenshot_20260413-170611.jpg",
      "/APlus/Screenshot_20260413-170625.jpg",
      "/APlus/Screenshot_20260413-170650.jpg",
      "/APlus/Screenshot_20260413-170657.jpg",
      "/APlus/Screenshot_20260413-170708.jpg",
      "/APlus/Screenshot_20260413-170718.jpg",
      "/APlus/Screenshot_20260413-170732.jpg",
      "/APlus/Screenshot_20260413-170744.jpg",
      "/APlus/Screenshot_20260413-170751.jpg",
    ],
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
        label: "gemini api",
        icon: SiGooglegemini,
        iconClass: "text-[#b9f0cf]",
      },
    ],
    links: [
      {
        label: "mobile app",
        href: "https://github.com/Depthabdre/real_english",
      },
      {
        label: "backend api",
        href: "https://github.com/Depthabdre/RealEnglish",
      },
    ],
    uiImages: [
      "/RealEnglish/Screenshot_20260416-165428_1.jpg",
      "/RealEnglish/Screenshot_20260416-165440_1.jpg",
      "/RealEnglish/Screenshot_20260416-165458_1.jpg",
      "/RealEnglish/Screenshot_20260416-165509_1.jpg",
      "/RealEnglish/photo_2026-01-01_10-25-52.jpg",
      "/RealEnglish/photo_2026-01-01_10-27-09.jpg",
      "/RealEnglish/photo_2026-01-01_10-27-15.jpg",
      "/RealEnglish/photo_2026-01-01_10-27-39.jpg",
      "/RealEnglish/Screenshot_20260412-171012.jpg",
      "/RealEnglish/Screenshot_20260412-171020.jpg",
      "/RealEnglish/Screenshot_20260412-171031.jpg",
    ],
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

function UiRail({ images, tone }: { images: string[]; tone: "cyan" | "lime" }) {
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
        {images.map((src, index) => {
          const toneClass = palette[index % palette.length];

          return (
            <div
              key={`screen-${index}`}
              className={`relative flex h-[220px] w-[132px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-b ${toneClass} shadow-[0_16px_35px_rgba(2,8,15,0.4)]`}
            >
              <Image 
                src={src}
                alt="Product Preview"
                fill
                className="object-cover object-top"
                sizes="132px"
              />
            </div>
          );
        })}
        {images.map((src, index) => {
          const toneClass = palette[index % palette.length];

          return (
            <div
              key={`screen-dup-${index}`}
              className={`relative flex h-[220px] w-[132px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-b ${toneClass} shadow-[0_16px_35px_rgba(2,8,15,0.4)]`}
            >
              <Image 
                src={src}
                alt="Product Preview"
                fill
                className="object-cover object-top"
                sizes="132px"
              />
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
  const [showPrivateModal, setShowPrivateModal] = useState(false);

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
          className="mt-5 flex flex-col justify-between gap-4 border-y border-white/10 py-4 md:flex-row md:items-center"
        >
          <div className="flex flex-wrap items-center gap-3">
            {project.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={!link.isPrivate ? "_blank" : undefined}
                rel={!link.isPrivate ? "noopener noreferrer" : undefined}
                onClick={
                  link.isPrivate
                    ? (e) => {
                        e.preventDefault();
                        setShowPrivateModal(true);
                      }
                    : undefined
                }
                className="group flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-[0.85rem] tracking-wide text-white/80 transition-all hover:border-white/25 hover:bg-white/10 hover:text-white"
              >
                <SiGithub className="h-4 w-4 opacity-80" />
                <span className="lowercase">{link.label}</span>
                {link.isPrivate && (
                  <MdLock className="ml-0.5 h-3.5 w-3.5 text-white/40 transition-colors group-hover:text-white/70" />
                )}
              </a>
            ))}
          </div>

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
          </div>
          <div className="flex-1">
            <UiRail images={project.uiImages} tone={project.railTone} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPrivateModal && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[1.75rem] bg-black/75 p-6 text-center sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.05 }}
              className="flex flex-col items-center"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-xl">
                <MdLock className="h-6 w-6 text-white/70" />
              </div>
              <h4 className="text-xl font-semibold tracking-[-0.01em] text-white">
                Proprietary Codebase
              </h4>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
                This repository is strictly private to protect client intellectual property and the application&apos;s subscription-based DRM architecture.
              </p>
              <button
                onClick={() => setShowPrivateModal(false)}
                className="mt-8 rounded-full bg-white px-7 py-2.5 text-sm font-medium tracking-wide text-black transition-transform hover:scale-105 active:scale-95"
              >
                Understood
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
    <section id="projects" className="relative overflow-hidden px-6 py-24 md:px-12 lg:px-20">
      <div className="relative mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 flex flex-col items-center justify-center space-y-3 text-center sm:mb-16"
          >
            <p className="text-[var(--hero-muted)] text-xs tracking-[0.26em] uppercase">
              featured projects
            </p>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.02em] text-[var(--hero-text)] sm:text-4xl lg:text-5xl">
              stuff i&apos;ve built
            </h2>
          </motion.div>

        <div
          ref={cardsRef}
          className="relative grid grid-cols-1 gap-6 lg:auto-rows-fr lg:grid-cols-2 lg:items-stretch"
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

