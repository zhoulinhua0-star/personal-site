"use client";

import { useEffect, useSyncExternalStore } from "react";

export type Mode = "minimal" | "creative";

export const MODE_STORAGE_KEY = "lz-mode";

const MODE_EVENT = "lz-mode-change";

/** The <html data-mode> attribute is the single source of truth. */
function readMode(): Mode {
  return document.documentElement.dataset.mode === "creative" ? "creative" : "minimal";
}

function serverMode(): Mode {
  return "minimal";
}

function subscribe(onChange: () => void) {
  window.addEventListener(MODE_EVENT, onChange);
  return () => window.removeEventListener(MODE_EVENT, onChange);
}

function applyMode(next: Mode) {
  if (next === "creative") {
    document.documentElement.dataset.mode = "creative";
  } else {
    delete document.documentElement.dataset.mode;
  }
  try {
    window.localStorage.setItem(MODE_STORAGE_KEY, next);
  } catch {
    /* Private mode or blocked storage — the switch still works this session. */
  }
  window.dispatchEvent(new Event(MODE_EVENT));
}

/**
 * Presentation switch.
 *
 * The *visual* state comes from `data-mode` on <html>, which the inline script
 * in layout.tsx sets before first paint — so nothing flashes and nothing waits
 * for hydration. React only mirrors that attribute so `aria-pressed` stays
 * honest for assistive technology.
 */
export function ModeToggle() {
  const mode = useSyncExternalStore(subscribe, readMode, serverMode);

  // React strips attributes it did not itself render when it hydrates <html>,
  // which would undo the boot script. Re-apply the stored choice once, right
  // after hydration. First paint is already correct, so nothing flashes.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(MODE_STORAGE_KEY);
    } catch {
      /* Storage unavailable — Minimal stays selected. */
    }
    if (stored === "creative") applyMode("creative");
  }, []);

  return (
    <div
      className="mode-toggle"
      role="group"
      aria-label="Presentation mode"
      title="Switch between a quiet, scannable layout and a richer one"
    >
      {(["minimal", "creative"] as const).map((value) => (
        <button
          key={value}
          type="button"
          data-value={value}
          className="mode-option"
          aria-pressed={mode === value}
          onClick={() => applyMode(value)}
        >
          {value === "minimal" ? "Minimal" : "Creative"}
        </button>
      ))}
    </div>
  );
}
