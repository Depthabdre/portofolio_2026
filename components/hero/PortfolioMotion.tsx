"use client";

import { useEffect } from "react";

/** Progressive enhancement: content is visible even before JavaScript runs. */
export function PortfolioMotion() {
  useEffect(() => {
    const root = document.getElementById("main-content");
    if (!root || !("IntersectionObserver" in window)) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const played = new WeakSet<Element>();
    const running = new Set<Animation>();
    let observer: IntersectionObserver | undefined;

    const stop = () => {
      observer?.disconnect();
      running.forEach((animation) => animation.cancel());
      running.clear();
    };

    const syncPreference = () => {
      stop();
      if (preference.matches) return;

      observer = new IntersectionObserver(
        (entries) => {
          let experienceIndex = 0;
          entries.forEach(({ target, isIntersecting }) => {
            if (!isIntersecting || played.has(target)) return;
            played.add(target);
            observer?.unobserve(target);
            const isExperience =
              target.getAttribute("data-portfolio-reveal") === "experience";
            const animation = target.animate(
              [
                {
                  transform: `translateY(${isExperience ? 24 : 18}px)`,
                  opacity: isExperience ? 0 : 0.88,
                },
                { transform: "translateY(0)", opacity: 1 },
              ],
              {
                duration: isExperience ? 700 : 620,
                delay: isExperience ? experienceIndex++ * 110 : 0,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "backwards",
              },
            );
            running.add(animation);
            animation.onfinish = () => running.delete(animation);
          });
        },
        { threshold: 0.12 },
      );

      root.querySelectorAll("[data-portfolio-reveal]").forEach((element) => {
        // Preserve restored scroll positions and direct anchor landings.
        if (element.getBoundingClientRect().top < window.innerHeight) {
          played.add(element);
        } else if (!played.has(element)) {
          observer?.observe(element);
        }
      });
    };

    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => {
      stop();
      preference.removeEventListener("change", syncPreference);
    };
  }, []);

  return null;
}
