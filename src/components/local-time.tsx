"use client";

import { useSyncExternalStore } from "react";
import { place } from "@/data/personal";

/** Same shape as a real reading, so the corner never reflows on hydration. */
const PLACEHOLDER = { time: "--:--", offset: "" } as const;

type Reading = { time: string; offset: string };

/**
 * Minutes that `zone` is ahead of UTC at this instant.
 *
 * Deliberately arithmetic rather than `timeZoneName: "longOffset"`: that option
 * is newer than the rest of what this file needs, and an Intl option a browser
 * does not recognise throws rather than degrading. Formatting the instant in the
 * target zone and re-reading those fields as if they were UTC works everywhere
 * Intl exists at all.
 */
function offsetMinutes(zone: string, at: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(at);

  const f = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const asUtc = Date.UTC(
    Number(f.year),
    Number(f.month) - 1,
    Number(f.day),
    // Some engines render midnight as "24" under hour12: false.
    Number(f.hour) % 24,
    Number(f.minute),
    Number(f.second),
  );
  return Math.round((asUtc - at.getTime()) / 60_000);
}

function offsetLabel(zone: string, at: Date) {
  const total = offsetMinutes(zone, at);
  if (total === 0) return "UTC";
  const hours = Math.floor(Math.abs(total) / 60);
  const minutes = Math.abs(total) % 60;
  // U+2212 minus, not a hyphen — it matches the figure width of the plus.
  const sign = total < 0 ? "−" : "+";
  return `UTC${sign}${hours}${minutes ? `:${String(minutes).padStart(2, "0")}` : ""}`;
}

function read(): Reading {
  const now = new Date();
  return {
    time: new Intl.DateTimeFormat("en-GB", {
      timeZone: place.zone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(now),
    offset: offsetLabel(place.zone, now),
  };
}

/**
 * The wall clock is an external, mutable source rather than React state, so it
 * is modelled as one: `snapshot` is replaced only by the tick, which keeps the
 * value getSnapshot returns referentially stable between minutes.
 */
let snapshot: Reading = PLACEHOLDER;

function subscribe(onStoreChange: () => void) {
  let timer: number;

  const tick = () => {
    snapshot = read();
    onStoreChange();
    // Align to the wall-clock minute rather than counting 60s from mount, so
    // the displayed minute is never up to 59 seconds behind.
    timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000));
  };

  tick();
  return () => window.clearTimeout(timer);
}

/**
 * Where I am and what time it is here.
 *
 * The site is a static export, so there is no server to ask — `place` in
 * src/data/personal.ts is the source of truth and the time is computed in the
 * visitor's browser from its zone. Everyone therefore sees MY time no matter
 * where they are reading from, and the UTC offset lets them work out the gap
 * without doing the zone arithmetic themselves.
 *
 * The prerendered HTML carries the placeholder, never a real time: baking the
 * build machine's clock into static output would ship a time wrong by however
 * long ago the site was deployed. (That machine is GitHub's CI runner, on UTC,
 * so it would be wrong about the zone as well.)
 */
export function LocalTime() {
  const { time, offset } = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => PLACEHOLDER,
  );

  return (
    <span className="mono-xs flex items-baseline gap-2 whitespace-nowrap text-ink-2">
      <span>{time}</span>
      {/* The corner and the nav share one row, and the nav's labels are words
          now ("Projects", "Experiments", "Approach"), not the three short ones
          this used to budget for. Measured at 13px: the nav is 224px below `sm`
          and 317px from `sm` up, the GitHub pill 90px, the two outer gaps 48px,
          and the city with its separator 129px. Against a usable width of
          `100vw - 2 × clamp(22px, 6vw, 72px)` the city does not fit until 768px
          — 628px of content against 676px — so it waits for `md`. Below that
          the bare time keeps the corner meaningful; the wrapping Link's
          aria-label names the place at every width, so a screen reader loses
          nothing. */}
      <span className="hidden text-ink-4 md:inline" aria-hidden="true">
        ·
      </span>
      <span className="hidden text-ink-3 md:inline">{place.label}</span>
      {offset ? (
        <>
          <span className="hidden text-ink-4 lg:inline" aria-hidden="true">
            ·
          </span>
          {/* The offset is the least load-bearing thing in the corner — the
              city says where, the clock says when, and this only saves the
              reader an arithmetic step — so it is the piece that yields when
              the row is tight. It now waits a breakpoint longer than the city:
              at `md` the two together come to 679px against 676px of usable
              width, which is over by three. `lg` clears it with room. */}
          <span className="hidden text-ink-4 lg:inline">{offset}</span>
        </>
      ) : null}
    </span>
  );
}
