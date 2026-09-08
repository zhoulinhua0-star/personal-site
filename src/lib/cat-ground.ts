import { catEdges, catGround, type CatPose } from "@/data/cat";

/**
 * What the cat is standing on, resolved to the pose that answers it.
 *
 * The point tested is the bottom centre of the widget's box — every drawing on
 * the sheet is bottom-aligned and centred in it, so that point is literally
 * where the cat's feet are. Not its centre, which for a lying-down pose is
 * somewhere over its shoulder.
 */
export function groundPose(box: DOMRect): CatPose {
  const x = box.left + box.width / 2;
  // A hair inside the box: exactly on the edge the hit test can land on
  // whatever is behind the cat instead of under it.
  const y = box.bottom - 2;
  const w = window.innerWidth;
  const h = window.innerHeight;

  // Places beat things. A cat in the corner is in its box whatever the page
  // happens to have drawn there.
  const nearSide = x <= catEdges.corner || x >= w - catEdges.corner;
  const nearEnd = y <= catEdges.corner || y >= h - catEdges.corner;
  if (nearSide && nearEnd) return "in-box";
  if (y >= h - catEdges.bottom) return "peek";
  if (y <= catEdges.top) return "look-up";

  // The cat is over the point it is being tested at, so the first hit is
  // always itself — including its own bubble and dismiss button.
  const under = document.elementsFromPoint(x, y).find((node) => !node.closest(".cat"));
  if (!under) return "chill";

  for (const { selector, pose } of catGround) {
    if (under.closest(selector)) return pose;
  }
  // Unrecognised ground is just floor.
  return "chill";
}
