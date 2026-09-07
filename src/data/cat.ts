/**
 * ============================================================================
 *  CAT — the desk companion in the corner of the site.
 * ============================================================================
 *
 *  The artwork is cut from assets/cat-source.jpg by scripts/make-cat-sprites.py.
 *  This file is the only thing you edit to change how it behaves or what it
 *  says; the component reads everything from here.
 * ----------------------------------------------------------------------------
 */

export type CatPose = "hello" | "chill" | "curious" | "sleep" | "meow" | "thinking";

/**
 * What it says when you poke it. Picked at random, never twice in a row.
 * Keep them short — the bubble is small and sits against the page, and the
 * whole point is that it stays a footnote rather than becoming a mascot with
 * opinions. Lowercase suits the terminal labels the artwork already uses.
 */
export const catLines: string[] = [
  "meow.",
  "*stretches*",
  "still here.",
  "*blinks*",
  "purr.",
  "carry on.",
];

/** How long a line stays up before the bubble fades, in ms. */
export const catBubbleMs = 2800;

/**
 * Idle timers, in ms. Leave it alone long enough and it settles, then sleeps —
 * the two poses the sheet already draws for exactly this.
 */
export const catIdle = {
  settle: 14000,
  sleep: 34000,
};
