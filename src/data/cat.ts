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

/**
 * Every drawing on the sheet, in the order it appears there: three rows of
 * five, read left to right. The names are the sheet's own labels — the widget
 * prints the current one under the cat as `>_ look up`, so a name here is the
 * caption there, and the hyphens are only what a file name and an object key
 * can carry.
 */
export type CatPose =
  | "hello"
  | "chill"
  | "peek"
  | "curious"
  | "look-up"
  | "sleep"
  | "belly"
  | "look-back"
  | "hunt"
  | "play"
  | "in-box"
  | "happy"
  | "thinking"
  | "tired"
  | "coding";

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

/**
 * ----------------------------------------------------------------------------
 *  WHERE IT IS STANDING
 * ----------------------------------------------------------------------------
 *  The cat's pose is a readout of the ground under its paws. It is pinned to
 *  the window, so the ground changes two ways: you drag the cat somewhere, or
 *  you scroll the page underneath it. Both are the visitor's own doing — the
 *  cat never moves or changes on its own.
 */

/** Places rather than things: measured from the window's own edges, in px, and
 *  checked before anything the page has drawn there. */
export const catEdges = {
  /** Inside this of a corner, on both axes, it settles into its box. Wide
   *  enough that the spot the cat parks itself in before anyone has ever
   *  dragged it — the bottom-right, one box-width of empty margin in from the
   *  edges — is inside it, because a corner is where the whole cat is, not
   *  where the single point under its paws is. */
  corner: 150,
  /** This close to the bottom it peers over the edge of the window. */
  bottom: 52,
  /** This close to the top it is looking up at something above it. Deeper than
   *  the other two on purpose: the clamp that keeps room above the cat for its
   *  bubble means the paws can never get closer than about 170px to the top of
   *  the window, so a shallower band here would be a pose nobody could reach. */
  top: 210,
};

/**
 * Things: what the paws have landed on, first match wins — so put the specific
 * selectors above the general ones. Matching is by `closest()`, so a selector
 * covers everything inside it.
 *
 * This is a deliberate coupling to the markup's own class names. It is also
 * the whole mapping, in one table, instead of a `data-` attribute sprinkled
 * across six components — and a selector that stops matching costs a pose, not
 * a crash: anything unrecognised is just floor, and the cat lies down on it.
 */
export const catGround: { selector: string; pose: CatPose }[] = [
  // Prefix matches, not exact: the site is a static export, so its own links
  // carry a trailing slash — `/work/`, not `/work`.
  { selector: '.project, a[href^="/work"]', pose: "coding" },
  { selector: '.lab-row, a[href^="/lab"]', pose: "hunt" },
  { selector: ".display", pose: "hello" },
  { selector: "p, li, h1, h2, h3, h4, blockquote", pose: "thinking" },
  { selector: "a[href], button", pose: "curious" },
];

/**
 * How long a new patch of ground has to stay under the paws before the cat
 * reacts to it, in ms. Scrolling pulls the whole page under a pinned cat, and
 * without this the pose would flicker at every boundary it crosses; with it,
 * the cat answers when you stop, which is also when you are looking at it.
 */
export const catDwellMs = 260;

/** How long a line stays up before the bubble fades, in ms. */
export const catBubbleMs = 2800;

/**
 * The idle ladder: the one thing that changes without the visitor doing
 * anything, which is why it starts late and moves slowly. Each step is
 * measured from the last time anything happened — a touch, or a scroll — and
 * any of those rearms the whole thing from the top.
 *
 * It sits on top of the pose the ground would otherwise give, so `chill` is
 * deliberately not a step here: lying on the floor is what the floor already
 * means, and putting it in the ladder would erase the ground readout fourteen
 * seconds after every page load. These four steps are the cat's own state, not
 * the page's.
 *
 * Ordered, and the component walks it in order; keep it that way.
 */
export const catIdle: { after: number; pose: CatPose }[] = [
  { after: 40000, pose: "tired" },
  { after: 90000, pose: "sleep" },
  { after: 150000, pose: "belly" },
];
