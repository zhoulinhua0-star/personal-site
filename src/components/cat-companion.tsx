"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { catBubbleMs, catIdle, catLines, type CatPose } from "@/data/cat";
import sprites from "@/data/cat-sprites.json";

/**
 * A desk companion, in the spirit of the pet that floats over Codex: a small
 * pinned widget you can drag anywhere, poke for a line, and otherwise ignore
 * while it dozes off.
 *
 * Two things this deliberately does NOT do, both learned the hard way:
 *
 *  - It never changes pose from pointer movement. The six drawings are separate
 *    illustrations, not frames of one action — normalised to a common scale
 *    they differ by up to 25% in height and 71% in width — so any swap driven
 *    by something as continuous as a mouse position reads as flicker. Every
 *    swap here is the result of a deliberate act: a hover, a press, or a timer
 *    measured in tens of seconds.
 *  - It never cross-fades two poses. One layer is visible at a time, hard cut,
 *    because a cross-fade puts both at partial alpha and the paper shows
 *    through the pair — which is itself a kind of flash.
 *
 * All six poses stay mounted for the life of the page and only their `opacity`
 * changes, so no <img> is ever remounted, reloaded or re-decoded mid-swap.
 */

const POSES = Object.keys(sprites) as CatPose[];
const TALLEST = Math.max(...Object.values(sprites).map((s) => s.height));
const WIDEST = Math.max(...Object.values(sprites).map((s) => s.width));

const STORAGE_KEY = "cat-perch";
/** Movement past this many pixels turns a press into a drag rather than a poke. */
const DRAG_SLOP = 4;

type Perch = { fx: number; fy: number };

/** Space to keep clear above the cat for the speech bubble, which is drawn
 *  outside its box and would otherwise be clipped at the top of the window. */
const BUBBLE_ROOM = 46;
const EDGE = 8;

/** Keep the whole cat — and room for its bubble — inside the viewport. Clamping
 *  in bare viewport fractions is not enough: the cat is a fixed number of
 *  pixels tall, so the same fraction means something different on every screen
 *  and on a short window it puts the head off the top. */
function clampPerch(perch: Perch, box?: { width: number; height: number }): Perch {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const halfW = (box?.width ?? 0) / 2;
  const halfH = (box?.height ?? 0) / 2;
  const minX = (halfW + EDGE) / w;
  const minY = (halfH + BUBBLE_ROOM) / h;
  const maxY = 1 - (halfH + EDGE) / h;
  return {
    fx: Math.min(1 - minX, Math.max(minX, perch.fx)),
    fy: Math.min(Math.max(maxY, minY), Math.max(minY, perch.fy)),
  };
}

/** A companion you cannot hover or drag is just a picture in the way, so on
 *  touch and coarse pointers it never mounts at all. Subscribed rather than
 *  read once, so plugging in a mouse brings the cat with it. */
let query: MediaQueryList | null = null;
const desktop = () => {
  if (!query && typeof window !== "undefined") {
    query = window.matchMedia("(hover: hover) and (pointer: fine)");
  }
  return query;
};

function readPerch(): Perch | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const value = JSON.parse(saved) as Perch;
    if (typeof value?.fx !== "number" || typeof value?.fy !== "number") return null;
    // Re-clamped on mount against its own size, so a spot saved on a big
    // monitor cannot put the cat off a laptop screen.
    return value;
  } catch {
    // A blocked or corrupt store just means it starts in its corner.
    return null;
  }
}

export function CatCompanion() {
  const enabled = useSyncExternalStore(
    (onChange) => {
      const mq = desktop();
      mq?.addEventListener("change", onChange);
      return () => mq?.removeEventListener("change", onChange);
    },
    () => desktop()?.matches ?? false,
    () => false,
  );
  // Split in two on purpose: the inner widget only ever mounts on the client
  // and only when it is wanted, which is what lets it read localStorage in a
  // lazy initialiser instead of in an effect — no cascading render, and no
  // hydration mismatch from a perch the server could not know about.
  return enabled ? <CatWidget /> : null;
}

function CatWidget() {
  const ref = useRef<HTMLDivElement>(null);
  const [pose, setPose] = useState<CatPose>("hello");
  const [line, setLine] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  // null means "wherever CSS parks it" — the default corner. Only a drag
  // promotes the cat to coordinates of its own.
  const [perch, setPerch] = useState<Perch | null>(readPerch);

  const idleTimers = useRef<number[]>([]);
  const bubbleTimer = useRef(0);
  const lastLine = useRef(-1);
  const drag = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    fromX: number;
    fromY: number;
    moved: boolean;
  } | null>(null);

  /** Restart the settle/sleep countdown. Any interaction counts as attention. */
  const rouse = useCallback((next: CatPose) => {
    idleTimers.current.forEach(window.clearTimeout);
    setPose(next);
    idleTimers.current = [
      window.setTimeout(() => setPose("chill"), catIdle.settle),
      window.setTimeout(() => setPose("sleep"), catIdle.sleep),
    ];
  }, []);

  // A saved spot, and every later resize, is re-clamped against the cat's real
  // measured box — which only exists once it is on screen.
  useEffect(() => {
    const fit = () => {
      const host = ref.current;
      if (!host) return;
      const box = host.getBoundingClientRect();
      setPerch((current) => (current ? clampPerch(current, box) : current));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // `pose` already starts at "hello"; this only arms the countdown, so nothing
  // is set synchronously during the effect.
  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPose("chill"), catIdle.settle),
      window.setTimeout(() => setPose("sleep"), catIdle.sleep),
    ];
    idleTimers.current = timers;
    const bubble = bubbleTimer;
    return () => {
      timers.forEach(window.clearTimeout);
      idleTimers.current.forEach(window.clearTimeout);
      window.clearTimeout(bubble.current);
    };
  }, []);

  const speak = useCallback(() => {
    let index = Math.floor(Math.random() * catLines.length);
    if (catLines.length > 1 && index === lastLine.current) {
      index = (index + 1) % catLines.length;
    }
    lastLine.current = index;
    setLine(catLines[index]);
    window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setLine(null), catBubbleMs);
    rouse("meow");
  }, [rouse]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const host = ref.current;
    if (!host) return;
    const box = host.getBoundingClientRect();
    // Record the gesture BEFORE trying to capture. Capture only keeps move
    // events coming once the pointer leaves the cat — useful, but optional —
    // and it throws for any pointer id the browser does not consider active.
    // Ordering it first meant one throw swallowed the whole press, so clicks
    // never reached speak().
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      // Measured, not read from state: before the first drag the cat is still
      // parked by CSS and has no coordinates of its own.
      fromX: (box.left + box.width / 2) / window.innerWidth,
      fromY: (box.top + box.height / 2) / window.innerHeight,
      moved: false,
    };
    try {
      host.setPointerCapture(event.pointerId);
    } catch {
      // Without capture a drag simply ends when the pointer outruns the cat.
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;
    if (!state.moved) {
      if (Math.hypot(dx, dy) < DRAG_SLOP) return;
      state.moved = true;
      setDragging(true);
      rouse("hello");
    }
    setPerch(clampPerch(
      {
        fx: state.fromX + dx / window.innerWidth,
        fy: state.fromY + dy / window.innerHeight,
      },
      event.currentTarget.getBoundingClientRect(),
    ));
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    drag.current = null;
    try {
      ref.current?.releasePointerCapture(event.pointerId);
    } catch {
      // Nothing to release if capture never took.
    }

    if (!state.moved) {
      speak();
      return;
    }
    setDragging(false);
    setPerch((current) => {
      if (current) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
        } catch {
          // Not remembering the spot is not worth failing over.
        }
      }
      return current;
    });
    rouse("chill");
  };

  return (
    <div
      ref={ref}
      className="cat"
      // Decorative: nothing is lost by never finding it, and neither a drag nor
      // a poke leads anywhere, so it stays out of the accessibility tree and
      // the tab order rather than announcing itself as a control.
      aria-hidden="true"
      data-dragging={dragging}
      data-perched={perch ? true : undefined}
      data-asleep={pose === "sleep"}
      style={{
        "--cat-aspect": WIDEST / TALLEST,
        // Poses are bottom-aligned and differ in height, so the top of the box
        // is not the top of the cat. The bubble hangs off this instead.
        "--pose-gap": `${(1 - sprites[pose].height / TALLEST) * 100}%`,
        ...(perch
          ? {
              left: `${perch.fx * 100}%`,
              top: `${perch.fy * 100}%`,
              right: "auto",
              bottom: "auto",
            }
          : null),
      } as React.CSSProperties}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerEnter={() => {
        if (!drag.current) rouse("meow");
      }}
      onPointerLeave={() => {
        if (!drag.current) rouse("curious");
      }}
    >
      {line ? <span className="cat-bubble">{line}</span> : null}

      {/* The poses live in their own box: the breathing animation owns its
          transform, while the drag owns the outer element's position. Sharing
          one element between them would mean one clobbering the other. */}
      <span className="cat-stack">
        {POSES.map((name) => {
          const sprite = sprites[name];
          return (
            <Image
              key={name}
              src={sprite.src}
              width={sprite.width}
              height={sprite.height}
              alt=""
              draggable={false}
              priority={name === "hello"}
              data-active={name === pose}
              className="cat-pose"
              style={{ height: `${(sprite.height / TALLEST) * 100}%` }}
            />
          );
        })}
      </span>

      <span className="cat-tag">{`>_ ${pose}`}</span>
    </div>
  );
}
