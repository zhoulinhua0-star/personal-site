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
      {/* Below 380px the corner cannot hold the city and the nav at once, so the
          city steps aside and the bare time keeps the corner meaningful. The
          wrapping Link's aria-label names the place at every width regardless,
          so nothing is lost to a screen reader. */}
      <span className="hidden text-ink-4 min-[380px]:inline" aria-hidden="true">
        ·
      </span>
      <span className="hidden text-ink-3 min-[380px]:inline">{place.label}</span>
      {offset ? (
        <>
          <span className="hidden text-ink-4 sm:inline" aria-hidden="true">
            ·
          </span>
          {/* Dropped on narrow screens, where the header has no room to spare. */}
          <span className="hidden text-ink-4 sm:inline">{offset}</span>
        </>
      ) : null}
    </span>
  );
}
