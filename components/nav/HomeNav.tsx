"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

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
        href={isHome ? "#main-content" : "#journal-content"}
        className="home-skip-link"
      >
        Skip to content
      </a>
      <div className="home-header-inner">
        <Link
          href="/"
          className="home-brand"
          aria-label="am. Abdrehim Misbah, home"
        >
          <span className="brand-symbol" aria-hidden="true">
            am<span>.</span>
          </span>
          <span>Abdrehim Misbah</span>
        </Link>
        <nav className="home-desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.label}
              href={hrefFor(link.href)}
              aria-current={
                link.href === "/journal" && pathname?.startsWith("/journal")
                  ? "page"
                  : undefined
              }
            >
              {link.label}
            </Link>
          ))}
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
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={hrefFor(link.href)}
                  aria-current={
                    link.href === "/journal" && pathname?.startsWith("/journal")
                      ? "page"
                      : undefined
                  }
                  onClick={() => {
                    if (menu.current) menu.current.open = false;
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
