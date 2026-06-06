"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Custom premium SVG Icons for a self-contained, native look
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ProjectsIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2" />
      <path d="M12 12h.01" />
      <path d="M12 16h.01" />
      <path d="M12 8h.01" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  );
}

function ExperienceIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function AppsIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

export function NavBar() {
  const pathname = usePathname() || "/";
  const isHomePage = pathname === "/";
  
  const [activeSection, setActiveSection] = useState("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Derive the active section status during render to prevent state duplication/cascading renders [2]
  const currentActiveSection = isHomePage ? activeSection : "apps";

  // Scroll detection (Homepage-specific)
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const sections = ["hero", "work", "projects", "experience", "contact"];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      // Force high-lighting contact section when near the bottom of the page
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      if (isAtBottom) {
        setActiveSection("contact");
        return;
      }

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Desktop navigation items
  const navItems = [
    { name: "Hero", id: "hero", href: "/#hero" },
    { name: "About", id: "work", href: "/#work" },
    { name: "Projects", id: "projects", href: "/#projects" },
    { name: "Experience", id: "experience", href: "/#experience" },
    { name: "Apps", id: "apps", href: "/apps", isPage: true },
    { name: "Contact", id: "contact", href: "/#contact" },
  ];

  // Mobile Bottom Tab items
  const mobileNavItems = [
    { name: "Home", id: "hero", href: "/#hero", icon: HomeIcon },
    { name: "Projects", id: "projects", href: "/#projects", icon: ProjectsIcon },
    { name: "Experience", id: "experience", href: "/#experience", icon: ExperienceIcon },
    { name: "Apps", id: "apps", href: "/apps", isPage: true, icon: AppsIcon },
  ];

  // Helper for mobile tabs active check
  const isMobileItemActive = (itemId: string) => {
    if (itemId === "hero") {
      return currentActiveSection === "hero" || currentActiveSection === "work";
    }
    return currentActiveSection === itemId;
  };

  const isMoreActive = currentActiveSection === "contact" || isMenuOpen;

  return (
    <>
      {/* ----------------- 1. DESKTOP NAVIGATION ----------------- */}
      <nav className="hidden md:flex fixed pointer-events-none z-[100] left-0 right-0 top-4 sm:top-6 justify-center px-4">
        <motion.div 
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="pointer-events-auto flex items-center max-w-full overflow-x-auto gap-0.5 sm:gap-1 rounded-full border border-white/10 bg-[#070b12]/60 p-1 sm:p-1.5 backdrop-blur-xl shadow-lg shadow-black/40 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {navItems.map((item) => {
            const isActive = currentActiveSection === item.id;
            const href = item.isPage ? item.href : (isHomePage ? `#${item.id}` : item.href);

            return (
              <Link
                key={item.id}
                href={href}
                className="group relative shrink-0 px-2 min-[375px]:px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] min-[375px]:text-[11px] sm:text-sm font-medium whitespace-nowrap transition-all"
                onClick={(e) => {
                  if (item.isPage) return;
                  if (isHomePage) {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                    setActiveSection(item.id);
                  }
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-pill"
                    className="absolute inset-0 rounded-full bg-white/10 border border-white/5"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors duration-300 ${
                    isActive ? "text-white" : "text-white/60 group-hover:text-white/90"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </motion.div>
      </nav>

      {/* ----------------- 2. MOBILE FLOATING DOCK ----------------- */}
      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-[420px] pointer-events-auto">
        <motion.div 
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
          className="flex items-center justify-around rounded-3xl border border-white/10 bg-[#070b12]/75 px-3 py-2 backdrop-blur-xl shadow-2xl shadow-black/90"
        >
          {mobileNavItems.map((item) => {
            const active = isMobileItemActive(item.id);
            const href = item.isPage ? item.href : (isHomePage ? `#${item.id}` : item.href);

            return (
              <Link
                key={item.id}
                href={href}
                onClick={(e) => {
                  if (item.isPage) return;
                  if (isHomePage) {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                    setActiveSection(item.id);
                  }
                }}
                className="relative flex flex-col items-center justify-center p-2 rounded-2xl"
              >
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="relative p-1">
                    {active && (
                      <motion.div
                        layoutId="mobile-nav-pill"
                        className="absolute inset-0 rounded-xl bg-white/10 border border-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <item.icon className={`relative z-10 w-5 h-5 transition-colors duration-300 ${active ? "text-[var(--hero-accent)]" : "text-white/50"}`} />
                  </div>
                  <span className={`text-[10px] font-semibold tracking-wide transition-colors duration-300 ${active ? "text-white" : "text-white/40"}`}>
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}

          {/* Premium "More" Menu Trigger */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="relative flex flex-col items-center justify-center p-2 rounded-2xl"
          >
            <motion.div
              whileTap={{ scale: 0.92 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="relative p-1">
                {isMoreActive && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 rounded-xl bg-white/10 border border-white/5"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <MenuIcon className={`relative z-10 w-5 h-5 transition-colors duration-300 ${isMoreActive ? "text-[var(--hero-accent)]" : "text-white/50"}`} />
              </div>
              <span className={`text-[10px] font-semibold tracking-wide transition-colors duration-300 ${isMoreActive ? "text-white" : "text-white/40"}`}>
                More
              </span>
            </motion.div>
          </button>
        </motion.div>
      </div>

      {/* ----------------- 3. MOBILE SHEET (HAMBURGER RE-IMAGINED) ----------------- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Ambient Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-md md:hidden"
            />

            {/* Premium Native-Feeling Drawer Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed bottom-0 left-0 right-0 z-[120] rounded-t-[32px] border-t border-white/10 bg-[#070b12]/95 px-6 pt-5 pb-10 md:hidden shadow-2xl shadow-black"
            >
              {/* Native Drag Handle UI */}
              <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-white/20" />

              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                    Additional Sections
                  </h3>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-full border border-white/10 bg-white/5 p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Staggered Grid Layout for Extra Pages/Sections */}
                <div className="grid grid-cols-2 gap-3">
                  {/* About Link */}
                  <Link
                    href={isHomePage ? "#work" : "/#work"}
                    onClick={(e) => {
                      setIsMenuOpen(false);
                      if (isHomePage) {
                        e.preventDefault();
                        document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
                        setActiveSection("work");
                      }
                    }}
                    className="flex flex-col justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-all"
                  >
                    <span className="text-[10px] font-medium uppercase tracking-[0.05em] text-[#8be8f4]/80">Who I Am</span>
                    <span className="mt-1 text-base font-semibold text-white">About Me</span>
                  </Link>

                  {/* Contact Link */}
                  <Link
                    href={isHomePage ? "#contact" : "/#contact"}
                    onClick={(e) => {
                      setIsMenuOpen(false);
                      if (isHomePage) {
                        e.preventDefault();
                        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                        setActiveSection("contact");
                      }
                    }}
                    className="flex flex-col justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-all"
                  >
                    <span className="text-[10px] font-medium uppercase tracking-[0.05em] text-[var(--hero-contrast)]/80">Get In Touch</span>
                    <span className="mt-1 text-base font-semibold text-white">Contact</span>
                  </Link>
                </div>

                {/* Direct CTA Connections & Brand Color Accents */}
                <div className="mt-2 flex flex-col gap-3">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                    Quick Connect
                  </h3>
                  <div className="flex items-center gap-3">
                    <a
                      href="mailto:abdrehimmisbah@gmail.com"
                      className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[var(--hero-accent)] px-4 py-3.5 text-sm font-semibold text-[#070b12] hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-[var(--hero-accent)]/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email Me
                    </a>
                    <a
                      href="https://github.com/depthabdre"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3.5 text-white hover:bg-white/10 active:scale-[0.98] transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}