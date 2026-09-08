"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { catBubbleMs, catDwellMs, catIdle, catLines, type CatPose } from "@/data/cat";
import sprites from "@/data/cat-sprites.json";
import { setCatVisible, useCatVisible, useFinePointer } from "@/lib/cat-presence";
import { groundPose } from "@/lib/cat-ground";

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
  const finePointer = useFinePointer();
  const visible = useCatVisible();
  // Nothing at all without a mouse: a companion you cannot hover or drag is
  // just a picture in the way, and a way to summon one is worse.
  if (!finePointer) return null;
  // Split in three on purpose: the widget only ever mounts on the client and
  // only when it is wanted, which is what lets it read localStorage in a lazy
  // initialiser instead of in an effect — no cascading render, and no
  // hydration mismatch from a perch the server could not know about.
  return visible ? <CatWidget /> : <CatStub />;
}

/**
 * What is left when you send the cat away: one faint line of type in the
 * corner the cat parks itself in before it has ever been dragged.
 *
 * It exists because dismissing something with no visible way back is a trap.
 * It is pinned to the viewport rather than dropped at the end of the document
 * for the same reason the cat is — a way back that scrolls off the screen is
 * the problem, not the fix. Clicking it returns the cat to the spot you last
 * chose for it, which the perch has been holding the whole time.
 *
 * Out of the tab order and out of the accessibility tree, like the cat's own
 * dismiss button: the thing it summons is decoration that never mounts without
 * a mouse in the first place.
 */
function CatStub() {
  return (
    <button
      type="button"
      className="cat-stub"
      aria-hidden="true"
      tabIndex={-1}
      title="Bring the cat back"
      onClick={() => setCatVisible(true)}
    >
      {">_ cat"}
    </button>
  );
}

function CatWidget() {
  const ref = useRef<HTMLDivElement>(null);
  // Nothing sets the pose. Four independent facts are tracked instead and the
  // drawing is derived from them, so there is exactly one place that decides
  // what the cat looks like and no pair of events can race to set it.
  const [ground, setGround] = useState<CatPose>("chill");
  const [idle, setIdle] = useState<CatPose | null>(null);
  const [line, setLine] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  // null means "wherever CSS parks it" — the default corner. Only a drag
  // promotes the cat to coordinates of its own.
  const [perch, setPerch] = useState<Perch | null>(readPerch);

  const idleTimers = useRef<number[]>([]);
  const dwellTimer = useRef(0);
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

  /** Wake it and arm the whole idle ladder from now. Every step is its own
   *  timer measured from this moment, so the list stays declarative — no chain
   *  of timeouts each arming the next, which would drift and be far harder to
   *  cancel. Scrolling counts as attention as much as touching it does: the
   *  ladder means "nothing is happening here", and someone reading the page is
   *  something happening. It only gets to sleep once you have actually left. */
  const armIdle = useCallback(() => {
    idleTimers.current.forEach(window.clearTimeout);
    idleTimers.current = catIdle.map(({ after, pose: next }) =>
      window.setTimeout(() => setIdle(next), after),
    );
  }, []);

  /** The same, for anything that also has to interrupt a nap in progress. */
  const rouse = useCallback(() => {
    setIdle(null);
    armIdle();
  }, [armIdle]);

  /** Re-read the ground. Immediately after a deliberate act — the drop, the
   *  first paint — and on a dwell after a scroll, which is the hysteresis that
   *  keeps a page sliding underneath from strobing the poses. */
  const readGround = useCallback((immediate: boolean) => {
    const host = ref.current;
    if (!host) return;
    window.clearTimeout(dwellTimer.current);
    if (immediate) {
      setGround(groundPose(host.getBoundingClientRect()));
      return;
    }
    dwellTimer.current = window.setTimeout(() => {
      setGround(groundPose(host.getBoundingClientRect()));
    }, catDwellMs);
  }, []);

  // A saved spot, and every later resize, is re-clamped against the cat's real
  // measured box — which only exists once it is on screen.
  useEffect(() => {
    const fit = () => {
      const host = ref.current;
      if (!host) return;
      const box = host.getBoundingClientRect();
      setPerch((current) => (current ? clampPerch(current, box) : current));
      readGround(true);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [readGround]);

  // Before the first paint, not after: `ground` starts at a placeholder, and
  // reading it in a passive effect would show that placeholder for a frame.
  // Re-runs whenever the cat lands somewhere new — but not mid-drag, where the
  // pose is the carried one anyway and a hit test per pointer move is waste.
  useLayoutEffect(() => {
    if (dragging) return;
    readGround(true);
  }, [perch, dragging, readGround]);

  // The other way the ground changes: the page slides under a pinned cat.
  useEffect(() => {
    let woke = 0;
    const onScroll = () => {
      // Someone reading the page is attention, so this keeps the cat awake —
      // throttled, because a scroll fires dozens of events a second and each
      // rouse rebuilds the whole ladder.
      const now = Date.now();
      if (now - woke > 1000) {
        woke = now;
        rouse();
      }
      readGround(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [readGround, rouse]);

  // Arms the countdown; it starts awake, so nothing is set here synchronously.
  useEffect(() => {
    armIdle();
    const timers = idleTimers;
    const dwell = dwellTimer;
    const bubble = bubbleTimer;
    return () => {
      timers.current.forEach(window.clearTimeout);
      window.clearTimeout(dwell.current);
      window.clearTimeout(bubble.current);
    };
  }, [armIdle]);

  const speak = useCallback(() => {
    let index = Math.floor(Math.random() * catLines.length);
    if (catLines.length > 1 && index === lastLine.current) {
      index = (index + 1) % catLines.length;
    }
    lastLine.current = index;
    setLine(catLines[index]);
    window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setLine(null), catBubbleMs);
    rouse();
  }, [rouse]);

  /**
   * The one place the drawing is decided. Read top to bottom it is the whole
   * behaviour of the cat: what your hand is doing to it, then how long it has
   * been left alone, then — the resting state, and the only one most visitors
   * ever see change — what it is standing on.
   *
   * Merely pointing at the cat is deliberately not on this list. It used to
   * be, and it cost the drop its whole point: with the pointer still on the
   * cat where the drag left it, a hover pose outranked the ground, so the
   * answer to "what did I just put it on" only appeared later, when the
   * pointer wandered off. Two poses change now, both of them things you did on
   * purpose — picking it up, and putting it down.
   */
  const pose: CatPose = dragging ? "look-back" : line ? "play" : (idle ?? ground);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const host = ref.current;
    if (!host) return;
    // The cat itself is unselectable, but once the pointer leaves it mid-press
    // the browser starts sweeping a text selection across whatever it passes
    // over — and now that dragging is how the poses are found, it passes over
    // a lot. Nothing here needs the default: it is not focusable and carries
    // no text of its own.
    event.preventDefault();
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
      rouse();
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
    // The ground under the new spot is read by the layout effect that watches
    // `dragging`, so the landing and the pose it lands in paint together.
    rouse();
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
      data-pose={pose}
      data-perched={perch ? true : undefined}
      data-asleep={pose === "sleep" || pose === "belly"}
      style={{
        "--cat-aspect": WIDEST / TALLEST,
        // Poses are bottom-aligned and differ in height, so the top of the box
        // is not the top of the cat. The bubble hangs off this instead.
        "--pose-gap": `${(1 - sprites[pose].height / TALLEST) * 100}%`,
        // The same problem sideways. The box is as wide as the widest drawing,
        // and the poses are centred in it, so on a narrow pose the corners of
        // the box are empty paper — anything pinned there floats off on its
        // own. Each pose renders at `sprites[pose].width / WIDEST` of the box
        // width, which makes this the gap down either side.
        "--pose-inset": `${((1 - sprites[pose].width / WIDEST) / 2) * 100}%`,
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

      {/* The sheet captions every drawing this way, so the widget does too.
          The hyphen is only there because a pose name is also a file name. */}
      <span className="cat-tag">{`>_ ${pose.replace("-", " ")}`}</span>

      {/* The way out. A pinned widget that cannot be got rid of is the one
          thing a companion must never be — drag only ever moves the problem
          to another corner. Kept out of the tab order because its container is
          aria-hidden, and a focusable control inside hidden content is a trap:
          the footer link is the route for anyone not using a mouse, and it is
          also where this sends you to undo it. stopPropagation because the
          press would otherwise be read as the start of a drag. */}
      <button
        type="button"
        className="cat-dismiss"
        aria-hidden="true"
        tabIndex={-1}
        title="Send the cat away — bring it back from the footer"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => setCatVisible(false)}
      >
        ×
      </button>
    </div>
  );
}
