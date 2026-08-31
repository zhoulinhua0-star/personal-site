"use client";

import { useEffect, useRef } from "react";

/**
 * The futuristic command deck: an original, self-hosted SVG composition of
 * technical panels, readouts and rulers that sits *behind* the page and is
 * masked into the paper. It is decorative — never announced, never clickable.
 *
 * Two layers (structure + data) drift by different amounts with the pointer,
 * which is the only pointer listener on the site: passive, rAF-throttled,
 * fine-pointer only, and skipped entirely in Minimal mode or when the visitor
 * prefers reduced motion.
 */
export function CommandDeck({ variant = "hero" }: { variant?: "hero" | "contact" }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant !== "hero") return;

    const element = ref.current;
    if (!element) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduced.matches) return;

    let frame = 0;

    function onMove(event: PointerEvent) {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const host = ref.current;
        if (!host) return;
        if (document.documentElement.dataset.mode !== "creative") {
          host.style.removeProperty("--px");
          host.style.removeProperty("--py");
          return;
        }
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        host.style.setProperty("--px", x.toFixed(3));
        host.style.setProperty("--py", y.toFixed(3));
      });
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [variant]);

  return (
    <div ref={ref} className={`deck deck-mask deck-${variant}`} aria-hidden="true">
      <div className="deck-inner deck-drift">
        <div className="deck-art deck-structure deck-layer-far" />
        <div className="deck-art deck-data deck-layer-near" />
      </div>
    </div>
  );
}
