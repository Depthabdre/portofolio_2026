"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function NavBar() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "work", "projects", "experience", "contact"];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

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
  }, []);

  const navItems = [
    { name: "Hero", id: "hero" },
    { name: "About", id: "work" },
    { name: "Projects", id: "projects" },
    { name: "Experience", id: "experience" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <nav className="fixed pointer-events-none z-[100] left-0 right-0 top-4 sm:top-6 flex justify-center px-4">
      <motion.div 
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="pointer-events-auto flex items-center max-w-full overflow-x-auto gap-0.5 sm:gap-1 rounded-full border border-white/10 bg-[#070b12]/60 p-1 sm:p-1.5 backdrop-blur-xl shadow-lg shadow-black/40 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={`#${item.id}`}
            className="group relative shrink-0 px-2 min-[375px]:px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] min-[375px]:text-[11px] sm:text-sm font-medium whitespace-nowrap transition-all"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
              setActiveSection(item.id);
            }}
          >
            {activeSection === item.id && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 rounded-full bg-white/10 border border-white/5"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
            <span
              className={`relative z-10 transition-colors duration-300 ${
                activeSection === item.id ? "text-white" : "text-white/60 group-hover:text-white/90"
              }`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </motion.div>
    </nav>
  );
}
