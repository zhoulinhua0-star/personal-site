"use client";

import { useSyncExternalStore } from "react";

/**
 * Who gets a cat, and whether it is currently around.
 *
 * Two things need to agree on this: the cat itself, pinned over every page,
 * and the footer link that fetches it back after you have sent it away. They
 * are on opposite ends of the tree and neither owns the other, so the state
 * lives here instead — a pair of tiny stores read through useSyncExternalStore,
 * which is also what keeps the server render and the first client render from
 * disagreeing about a value only the browser can know.
 */

const DISMISS_KEY = "cat-dismissed";

/* ---------------------------------------------------------------------------
   Room for a cat. A mouse is the obvious case — hover and drag are what the
   companion is made of — but it is not the only one: a tap is a poke and a
   finger drags as well as a cursor, so on a touch screen the question is not
   the pointer but the screen. A tablet has a spare corner to park a cat in; a
   phone does not, and a phone turned sideways is still a phone, which is why
   the second clause asks for height as well as width rather than trusting a
   landscape width on its own.

   Written as a comma list rather than `or`, which is Media Queries 4 and would
   take the whole query down with it on a browser that cannot parse it. The
   width floor is shared with the `.cat` rule in globals.css — the two have to
   move together, or a screen between them mounts an invisible cat that is
   still there to be pressed.

   Subscribed rather than read once, so plugging in a mouse brings the cat and
   the footer link with it, and so does turning a small tablet on its side.
   --------------------------------------------------------------------------- */

const ROOM_QUERY =
  "(hover: hover) and (pointer: fine), (min-width: 740px) and (min-height: 600px)";

let roomQuery: MediaQueryList | null = null;
function catRoomQuery() {
  if (!roomQuery && typeof window !== "undefined") {
    roomQuery = window.matchMedia(ROOM_QUERY);
  }
  return roomQuery;
}

export function useCatRoom(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = catRoomQuery();
      mq?.addEventListener("change", onChange);
      return () => mq?.removeEventListener("change", onChange);
    },
    () => catRoomQuery()?.matches ?? false,
    () => false,
  );
}

/* ---------------------------------------------------------------------------
   Presence: dismissed or not. Stored under its own key rather than folded into
   the saved perch, so sending the cat away never costs you the spot you chose
   for it — bring it back and it returns exactly where you left it.
   --------------------------------------------------------------------------- */

const listeners = new Set<() => void>();
// undefined = not read yet. Cached because getSnapshot runs on every render and
// must be cheap, and because a value that changes identity per call would spin
// React in a loop.
let dismissed: boolean | undefined;

function readDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    // A blocked store just means the cat is here, which is the default anyway.
    return false;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function setCatVisible(next: boolean): void {
  if (dismissed === !next) return;
  dismissed = !next;
  try {
    if (dismissed) localStorage.setItem(DISMISS_KEY, "1");
    else localStorage.removeItem(DISMISS_KEY);
  } catch {
    // Not remembering the choice is not worth failing over; it still holds
    // for this page and every route change until the tab is closed.
  }
  emit();
}

export function useCatVisible(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      // A second tab is still the same person making the same choice, so let
      // the decision follow them across every tab of the site.
      const sync = (event: StorageEvent) => {
        if (event.key !== null && event.key !== DISMISS_KEY) return;
        dismissed = readDismissed();
        emit();
      };
      window.addEventListener("storage", sync);
      return () => {
        listeners.delete(onChange);
        window.removeEventListener("storage", sync);
      };
    },
    () => {
      if (dismissed === undefined) dismissed = readDismissed();
      return !dismissed;
    },
    () => true,
  );
}
