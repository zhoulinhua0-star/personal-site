"use client";

import { useEffect, useRef } from "react";

import { smoothDamp } from "@/lib/smooth-damp";

/**
 * The two artwork layers, each with its own smoothing. The gap between the
 * two times is what reads as depth — the near layer leads, the far layer
 * trails — and it is the same idea the 0.9s/0.7s CSS transitions carried
 * before, now expressed as mass rather than duration.
 */
const LAYERS = [
  { name: "far", smoothTime: 0.2 },
  { name: "near", smoothTime: 0.14 },
] as const;

/** Normalized units per second. The pointer spans 1.0, so a full-width sweep
 *  cannot be tracked faster than ~0.45s no matter how fast the mouse moves. */
const MAX_SPEED = 2.2;

/** Below this, both distance and velocity are invisible; stop the loop. */
const EPSILON = 0.0004;

/**
 * The futuristic command deck: an original, self-hosted SVG composition of
 * technical panels, readouts and rulers that sits *behind* the page and is
 * masked into the paper. It is decorative — never announced, never clickable.
 *
 * Two layers (structure + data) drift by different amounts with the pointer,
 * which is the only pointer listener on the site: passive, fine-pointer only,
 * and skipped entirely when the visitor prefers reduced motion. Pointer events
 * only move a target; the rendering happens in a rAF loop that shuts itself
 * off once the layers come to rest.
 */
export function CommandDeck() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduced.matches) return;

    let targetX = 0;
    let targetY = 0;
    let frame = 0;
    let lastTime = 0;

    const layers = LAYERS.map((layer) => ({ ...layer, x: 0, y: 0, vx: 0, vy: 0 }));

    function step(now: number) {
      frame = 0;
      const host = ref.current;
      if (!host) return;

      // Clamp the step: a backgrounded tab must not resume with one long jump.
      const deltaTime = lastTime ? Math.min((now - lastTime) / 1000, 1 / 30) : 1 / 60;
      lastTime = now;

      let settled = true;
      for (const layer of layers) {
        [layer.x, layer.vx] = smoothDamp(
          layer.x, targetX, layer.vx, layer.smoothTime, MAX_SPEED, deltaTime,
        );
        [layer.y, layer.vy] = smoothDamp(
          layer.y, targetY, layer.vy, layer.smoothTime, MAX_SPEED, deltaTime,
        );
        host.style.setProperty(`--px-${layer.name}`, layer.x.toFixed(4));
        host.style.setProperty(`--py-${layer.name}`, layer.y.toFixed(4));

        if (
          Math.abs(targetX - layer.x) > EPSILON ||
          Math.abs(targetY - layer.y) > EPSILON ||
          Math.abs(layer.vx) > EPSILON ||
          Math.abs(layer.vy) > EPSILON
        ) {
          settled = false;
        }
      }

      if (settled) {
        // Drop the clock too, or the next move's first frame would integrate
        // the whole idle gap.
        lastTime = 0;
        return;
      }
      frame = window.requestAnimationFrame(step);
    }

    function onMove(event: PointerEvent) {
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
      if (!frame) frame = window.requestAnimationFrame(step);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="deck deck-mask deck-hero" aria-hidden="true">
      <div className="deck-inner deck-drift">
        <div className="deck-art deck-structure deck-layer-far" />
        <div className="deck-art deck-data deck-layer-near" />
      </div>
    </div>
  );
}
