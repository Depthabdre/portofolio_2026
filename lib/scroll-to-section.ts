let cancelScroll: (() => void) | undefined;

/** Animate deliberate section navigation without changing normal page scrolling. */
export function scrollToSection(target: HTMLElement) {
  cancelScroll?.();
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const start = window.scrollY;
  const end = Math.max(
    0,
    Math.min(
      start + target.getBoundingClientRect().top - margin,
      document.documentElement.scrollHeight - window.innerHeight,
    ),
  );

  target.tabIndex = -1;
  target.focus({ preventScroll: true });
  if (preference.matches || Math.abs(end - start) < 2) {
    window.scrollTo({ top: end, behavior: "instant" });
    return;
  }

  const duration = Math.min(
    1400,
    Math.max(650, Math.abs(end - start) * 0.18 + 400),
  );
  let started: number | undefined;
  let frame = 0;
  const stop = () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("pointerdown", stop);
    window.removeEventListener("popstate", stop);
    window.removeEventListener("pagehide", stop);
    window.removeEventListener("keydown", stopOnKey);
    preference.removeEventListener("change", onPreferenceChange);
    if (cancelScroll === stop) cancelScroll = undefined;
  };
  const stopOnKey = (event: KeyboardEvent) => {
    if (
      ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Escape", "Tab"].includes(event.key)
    ) stop();
  };
  const onPreferenceChange = () => {
    if (!preference.matches) return;
    stop();
    window.scrollTo({ top: end, behavior: "instant" });
  };
  const tick = (time: number) => {
    started ??= time;
    const progress = Math.min(1, (time - started) / duration);
    const eased = progress < 0.5
      ? 4 * progress ** 3
      : 1 - (-2 * progress + 2) ** 3 / 2;
    window.scrollTo({ top: start + (end - start) * eased, behavior: "instant" });
    if (progress < 1) frame = requestAnimationFrame(tick);
    else stop();
  };

  cancelScroll = stop;
  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("pointerdown", stop, { passive: true });
  window.addEventListener("popstate", stop);
  window.addEventListener("pagehide", stop);
  window.addEventListener("keydown", stopOnKey);
  preference.addEventListener("change", onPreferenceChange);
  frame = requestAnimationFrame(tick);
}
