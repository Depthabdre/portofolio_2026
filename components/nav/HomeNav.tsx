"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  getQueuedHomeAnchor,
  finishHomeAnchor,
} from "@/lib/home-anchor-navigation";
import { HomeSectionLink } from "./HomeSectionLink";
import { scrollToSection } from "@/lib/scroll-to-section";

const links = [
  { label: "Work", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
  { label: "Apps", href: "/apps" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "#contact" },
];

export function HomeNav() {
  const menu = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const hrefFor = (href: string) =>
    href.startsWith("#") && !isHome ? `/${href}` : href;

  useEffect(() => {
    if (!isHome) return;
    const requestedAnchor = getQueuedHomeAnchor();
    if (!requestedAnchor) return;

    // Cross-page section links defer scrolling until the homepage is mounted.
    // Same-page hash links keep native anchor behavior and browser history.
    const scrollToDestination = () => {
      let id: string;
      try {
        id = decodeURIComponent(requestedAnchor);
      } catch {
        finishHomeAnchor(requestedAnchor);
        return true;
      }
      const target = document.getElementById(id);
      if (!target) return false;
      finishHomeAnchor(requestedAnchor);
      window.history.replaceState(null, "", `/#${requestedAnchor}`);
      scrollToSection(target);
      return true;
    };

    if (scrollToDestination()) return;
    const observer = new MutationObserver(() => {
      if (scrollToDestination()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        menu.current?.open &&
        !menu.current.contains(event.target)
      )
        menu.current.open = false;
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.current?.open) {
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, []);
  return (
    <header className="home-header">
      <a
        href={pathname?.startsWith("/journal") ? "#journal-content" : "#main-content"}
        className="home-skip-link"
      >
        Skip to content
      </a>
      <div className="home-header-inner">
        <Link
          href="/"
          className="home-brand"
          aria-label="Abdrehim Misbah, home"
        >
          <span>Abdrehim Misbah</span>
        </Link>
        <nav className="home-desktop-nav" aria-label="Main navigation">
          {links.map((link) => {
            const NavLink = link.href.startsWith("#") ? HomeSectionLink : Link;
            return (
              <NavLink
                key={link.label}
                href={hrefFor(link.href)}
                aria-current={
                  (link.href === "/journal" && pathname?.startsWith("/journal")) ||
                  (link.href === "/apps" && pathname?.startsWith("/apps"))
                    ? "page"
                    : undefined
                }
              >
                {link.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="home-header-controls">
          <ThemeToggle />
          <details className="home-mobile-menu" ref={menu}>
            <summary aria-label="Menu">
              <span className="mobile-menu-label">Menu</span>{" "}
              <span className="menu-symbol" aria-hidden="true">
                +
              </span>
            </summary>
            <nav aria-label="Mobile navigation">
              {links.map((link) => {
                const NavLink = link.href.startsWith("#") ? HomeSectionLink : Link;
                return (
                  <NavLink
                    key={link.label}
                    href={hrefFor(link.href)}
                    aria-current={
                      (link.href === "/journal" && pathname?.startsWith("/journal")) ||
                      (link.href === "/apps" && pathname?.startsWith("/apps"))
                        ? "page"
                        : undefined
                    }
                    onClick={() => {
                      if (menu.current) menu.current.open = false;
                    }}
                  >
                    {link.label}
                  </NavLink>
                );
              })}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
