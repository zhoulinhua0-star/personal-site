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
   Pointer: a companion you cannot hover or drag is just a picture in the way,
   so on touch and coarse pointers there is no cat and no footer link either.
   Subscribed rather than read once, so plugging in a mouse brings both with it.
   --------------------------------------------------------------------------- */

let pointerQuery: MediaQueryList | null = null;
function finePointerQuery() {
  if (!pointerQuery && typeof window !== "undefined") {
    pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  }
  return pointerQuery;
}

export function useFinePointer(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = finePointerQuery();
      mq?.addEventListener("change", onChange);
      return () => mq?.removeEventListener("change", onChange);
    },
    () => finePointerQuery()?.matches ?? false,
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
