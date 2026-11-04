"use client";

import { useSyncExternalStore } from "react";
import {
  PORTFOLIO_THEME_EVENT,
  PORTFOLIO_THEME_KEY,
} from "@/lib/portfolio-theme";

function subscribe(callback: () => void) {
  window.addEventListener(PORTFOLIO_THEME_EVENT, callback);
  return () => window.removeEventListener(PORTFOLIO_THEME_EVENT, callback);
}

function getDarkMode() {
  return document.documentElement.dataset.portfolioTheme === "dark";
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getDarkMode, () => false);

  function toggleTheme() {
    const next = getDarkMode() ? "light" : "dark";
    document.documentElement.dataset.portfolioTheme = next;
    try {
      localStorage.setItem(PORTFOLIO_THEME_KEY, next);
    } catch {
      // The switch still works when browser storage is unavailable.
    }
    window.dispatchEvent(new Event(PORTFOLIO_THEME_EVENT));
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Dark mode"
      aria-pressed={dark}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
    >
      <svg
        className="theme-icon-moon"
        aria-hidden="true"
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.8 13.1A9 9 0 0 1 10.9 3.2a9 9 0 1 0 9.9 9.9Z" />
      </svg>
      <svg
        className="theme-icon-sun"
        aria-hidden="true"
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" />
      </svg>
    </button>
  );
}
