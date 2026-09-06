"use client";

import { useEffect } from "react";

/**
 * A blue ring that expands from every mouse click and fades out.
 *
 * The site's cursor is a real CSS cursor and therefore cannot animate, so this
 * is the one piece of pointer feedback that has to be an element. It is kept
 * honest about that: a single fixed-position layer appended to <body>, marked
 * `aria-hidden` and `pointer-events: none`, so it never intercepts a click,
 * never enters the accessibility tree, and never shifts layout.
 *
 * Each ring removes itself on `animationend`. That listener is `once`, so a
 * click storm leaves no accumulating nodes — and the layer is torn down whole
 * on unmount, which also disposes any ring still in flight.
 *
 * Skipped entirely for coarse pointers (a ripple under a fingertip is hidden by
 * the finger) and for visitors who prefer reduced motion. Only the primary
 * button ripples: a right-click opens a menu, and decorating that is noise.
 */
export function ClickRipple() {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduced.matches) return;

    const layer = document.createElement("div");
    layer.className = "ripple-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    function onDown(event: PointerEvent) {
      if (event.pointerType !== "mouse" || event.button !== 0) return;

      const ring = document.createElement("span");
      ring.className = "ripple";
      // Viewport coordinates, to match the layer's own fixed positioning.
      ring.style.left = `${event.clientX}px`;
      ring.style.top = `${event.clientY}px`;
      ring.addEventListener("animationend", () => ring.remove(), { once: true });
      layer.appendChild(ring);
    }

    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onDown);
      layer.remove();
    };
  }, []);

  return null;
}
