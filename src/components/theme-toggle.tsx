"use client";

import { useRef, useSyncExternalStore, type MouseEvent } from "react";
import { flushSync } from "react-dom";

const themeEvent = "site-theme-change";

function subscribe(listener: () => void) {
  window.addEventListener(themeEvent, listener);
  return () => window.removeEventListener(themeEvent, listener);
}

function isDark() {
  return document.documentElement.dataset.theme === "dark";
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  const transitioning = useRef(false);

  async function toggle(event: MouseEvent<HTMLButtonElement>) {
    if (transitioning.current) return;
    const root = document.documentElement;
    const theme = isDark() ? "light" : "dark";
    let applied = false;
    function applyTheme() {
      if (applied) return;
      applied = true;
      root.dataset.theme = theme;
      try {
        localStorage.setItem("site-theme", theme);
      } catch {
        // The switch still works when browser storage is unavailable.
      }
      window.dispatchEvent(new Event(themeEvent));
    }

    if (!document.startViewTransition ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !CSS.supports("mask-image", "radial-gradient(black, transparent)")) {
      applyTheme();
      return;
    }

    // A feathered reveal grows from the button, including keyboard activation.
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.style.setProperty("--theme-origin-x", `${x}px`);
    root.style.setProperty("--theme-origin-y", `${y}px`);
    root.style.setProperty("--theme-reveal-size", `${radius * 5}px`);
    root.dataset.themeTransition = "true";
    transitioning.current = true;
    try {
      const transition = document.startViewTransition(() => flushSync(applyTheme));
      await transition.finished;
    } catch {
      // A skipped snapshot must never prevent the requested theme change.
      applyTheme();
    } finally {
      delete root.dataset.themeTransition;
      root.style.removeProperty("--theme-origin-x");
      root.style.removeProperty("--theme-origin-y");
      root.style.removeProperty("--theme-reveal-size");
      transitioning.current = false;
    }
  }

  return (
    <button type="button" onClick={toggle} className="theme-toggle" aria-label="Dark mode" aria-pressed={dark} title={dark ? "Switch to light mode" : "Switch to dark mode"}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {dark ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></> : <path d="M20.9 13.2A9 9 0 0 1 10.8 3.1 9 9 0 1 0 20.9 13.2Z" />}
      </svg>
    </button>
  );
}
