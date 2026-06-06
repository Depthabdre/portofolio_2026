"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { track } from "@vercel/analytics";

// ==========================================
// 1. EXTENSIBLE INTERFACES & PLATFORMS
// ==========================================

export type PlatformKey = "android" | "macos" | "web" | "mobile";

export interface PlatformConfig {
  label: string;
  icon: (props: { className?: string }) => React.ReactNode;
  badgeStyles: string;
}

export interface AppModel {
  id: string;
  name: string;
  platformKey: PlatformKey;
  description: string;
  ctaText: string;
  ctaUrl?: string;
  status: "active" | "coming_soon";
  stats?: string;
  localIconUrl?: string;
}

// Minimalist, high-performance SVG icon builders
function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function MonitorIcon({ className }: { className?: string }) {
  return (
    <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function SmartphoneIcon({ className }: { className?: string }) {
  return (
    <svg className={`${className} shrink-0`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="3" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
  );
}

// Closed for modification: Platform styles, tokens, and icons are mapped dynamically here
const platformRegistry: Record<PlatformKey, PlatformConfig> = {
  android: {
    label: "Android",
    icon: PhoneIcon,
    badgeStyles: "bg-[#8cf0ff]/5 text-[#8cf0ff] border-[#8cf0ff]/20",
  },
  macos: {
    label: "macOS",
    icon: MonitorIcon,
    badgeStyles: "bg-white/5 text-white/80 border-white/10",
  },
  web: {
    label: "Web App",
    icon: GlobeIcon,
    badgeStyles: "bg-[#d9ff70]/5 text-[#d9ff70] border-[#d9ff70]/20",
  },
  mobile: {
    label: "iOS / Android",
    icon: SmartphoneIcon,
    badgeStyles: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  },
};

// ==========================================
// 2. EXTENSIBLE APP LIST (Add new apps here)
// ==========================================

const appsList: AppModel[] = [
  {
    id: "aplus",
    name: "A+ Tutorial Class",
    platformKey: "android",
    description: "Subscription-based e-learning platform serving 2,000+ active university students with offline DRM, screenshot prevention, and single-device access control.",
    ctaText: "Download on Play Store",
    ctaUrl: "/apps/aplus.apk",
    status: "active",
    stats: "2,000+ active students",
    localIconUrl: "/icons/aplus.png",
  },
  {
    id: "focus-mac",
    name: "Focus Session for Mac",
    platformKey: "macos",
    description: "Native macOS focus timer built with Flutter. Lightweight and system-integrated with native notifications and custom audio alerts.",
    ctaText: "Download DMG",
    ctaUrl: "/apps/focus-mac.dmg",
    status: "active",
    localIconUrl: "/icons/focus-mac.png",
  },
  {
    id: "student-focus",
    name: "Student Focus App",
    platformKey: "web",
    description: "Full-stack productivity web app with multiple focus modes, calendar progress tracking, and daily streaks.",
    ctaText: "Open Web App",
    ctaUrl: "https://focus-mode-xi.vercel.app/login",
    status: "active",
    localIconUrl: "/icons/student-focus.png",
  },
  {
    id: "pushups-counter",
    name: "PushUps",
    platformKey: "android",
    description: "Hardware-accurate push-up counter using your device proximity sensor. Features custom debouncing logic, clean cyan glassmorphic UI, real-time audio coaching, and persistent high score tracking.",
    ctaText: "Download APK",
    ctaUrl: "/apps/pushups.apk",
    status: "active",
    localIconUrl: "/icons/pushups.png",
  },
  {
    id: "tapreply",
    name: "TapReply",
    platformKey: "android",
    description: "Android overlay app that reads on-screen chat context using Accessibility Service and generates AI-powered reply options instantly across WhatsApp, Telegram, and LinkedIn.",
    ctaText: "Download APK",
    ctaUrl: "/apps/tapreply.apk",
    status: "active",
    localIconUrl: "/icons/tapreply.png",
  },
];

// ==========================================
// 3. CORE ANIMATION SCHEMAS
// ==========================================

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

// ==========================================
// 4. MAIN RENDERING RUNTIME (Closed to changes)
// ==========================================

export default function AppsPage() {
  const handleDownloadClick = (app: AppModel) => {
    try {
      track("App Download", { appName: app.name, platform: app.platformKey });
    } catch (e) {
      console.warn("Analytics tracking failed:", e);
    }
  };

  return (
    <main className="page-shell min-h-screen relative flex flex-col pt-32 pb-24 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="relative mx-auto w-full max-w-5xl">
        
        {/* Top Navigation Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[var(--hero-muted)] hover:text-[var(--hero-text)] transition-colors group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:-translate-x-1 transition-transform">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Home
          </Link>
        </motion.div>

        {/* Minimalist Human Header */}
        <div className="max-w-2xl mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-[13px] font-semibold tracking-[0.15em] uppercase text-[var(--hero-accent)] mb-3"
          >
            HANDCRAFTED PROJECTS
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--hero-text)] mb-5"
          >
            Apps & Tools
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-[16px] md:text-lg text-[var(--hero-muted)] leading-relaxed font-normal"
          >
            A collection of Android, macOS, and web applications I built. Some are client projects like A+ Tutorial Class, while others are personal hobby tools built to solve real-world problems I faced, now used by active users.
          </motion.p>
        </div>

        {/* Grid Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {appsList.map((app) => {
            const isComingSoon = app.status === "coming_soon";
            
            // Extract Platform configuration dynamically according to the registry map
            const platform = platformRegistry[app.platformKey] || platformRegistry.web;
            const PlatformIcon = platform.icon;

            return (
              <motion.div
                key={app.id}
                variants={itemVariants}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border ${
                  isComingSoon 
                    ? "border-white/5 bg-white/[0.01] opacity-70" 
                    : "border-white/10 bg-[#0d1424]/20 hover:border-white/20 hover:bg-white/[0.03] shadow-lg shadow-black/10"
                } p-6 sm:p-8 min-h-[320px] transition-all duration-300`}
              >
                {/* Visual glassmorphic overlay background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                <div className="absolute -inset-px bg-gradient-to-t from-transparent via-white/5 to-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Card Content Area */}
                <div>
                  <div className="flex items-start justify-between gap-4 mb-6">
                    {/* Rounded Graphic Icon or fallback */}
                    {app.localIconUrl ? (
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/15 bg-white/5 shadow-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:border-white/30">
                        {/* subtle glass overlay inside icon */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/25 to-transparent pointer-events-none z-10" />
                        <Image
                          src={app.localIconUrl}
                          alt={`${app.name} Icon`}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative w-14 h-14 rounded-2xl border border-white/12 bg-white/5 shadow-md flex-shrink-0 flex items-center justify-center text-white/70 transition-transform duration-300 group-hover:scale-105">
                        <PlatformIcon className="w-6 h-6" />
                      </div>
                    )}

                    {/* Badge and Stats Column */}
                    <div className="flex flex-col items-end gap-2 text-right">
                      {/* Platform Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${platform.badgeStyles}`}>
                        <PlatformIcon className="w-3.5 h-3.5" />
                        {platform.label}
                      </span>

                      {/* App Stats Status */}
                      {app.stats && (
                        <span className="text-[10px] font-semibold tracking-wider text-white/50 bg-white/5 border border-white/[0.05] px-2.5 py-0.5 rounded-md">
                          {app.stats}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* App Name */}
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2.5 group-hover:text-[var(--hero-accent)] transition-colors duration-300">
                    {app.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-[15px] leading-relaxed text-[var(--hero-muted)] font-normal mb-8">
                    {app.description}
                  </p>
                </div>

                {/* Action CTA Trigger Area */}
                <div className="relative z-10 mt-auto">
                  {isComingSoon ? (
                    <div className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-bold tracking-wide uppercase rounded-xl border border-white/5 bg-white/[0.02] text-white/30 cursor-not-allowed w-full sm:w-auto">
                      <svg className="w-4 h-4 shrink-0 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {app.ctaText}
                    </div>
                  ) : (
                    <motion.a
                      href={app.ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleDownloadClick(app)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-bold tracking-wide uppercase rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white hover:border-white/25 transition-colors group w-full sm:w-auto shadow-sm"
                    >
                      {app.ctaText}
                      <ArrowUpRight />
                    </motion.a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </main>
  );
}