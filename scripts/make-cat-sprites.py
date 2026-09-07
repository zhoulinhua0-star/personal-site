"""
Cuts the six cat poses out of assets/cat-source.jpg into transparent sprites.

    python3 scripts/make-cat-sprites.py

The source is one flat sheet on a cream background with a faint grid. Keying it
is done by flood-filling the background inward from the sheet's edges rather
than by matching colour everywhere: the cats' own highlights come very close to
the background cream, and only a fill that has to *reach* a pixel from outside
can tell "cream behind the cat" from "cream on the cat". The dark outline every
pose is drawn with is what stops the fill, so the edges come out clean.

The drop shadows disappear on their own — they sit inside the keying tolerance,
so the fill eats them. That is what we want: a shadow baked at one angle would
fight the page's own light.

Each pose is then reduced to its single largest connected component before it
is cropped, which drops the loose decorations (the heart, the speech bubble,
the little motion ticks) that share a bounding box with a cat but not a body.

Nothing here needs an API or a network. Pillow only.
"""

import json
import os
from collections import deque

from PIL import Image

SRC = "assets/cat-source.jpg"

# Background cream, sampled from the sheet's corners, and how far a pixel may
# stray from it and still count as background. 14 is wide enough to swallow the
# grid lines and the JPEG noise around them, tight enough to keep the palest
# fur — which lands around 232 — on the cat.
BG = (250, 247, 238)
TOL = 14

# Bounding boxes of the six poses on the sheet, in source pixels. Generous on
# purpose: the exact crop comes from the connected component inside each one.
POSES = {
    "hello":    (127, 153, 397, 460),
    "chill":    (519, 232, 1005, 470),
    "curious":  (1130, 148, 1392, 465),
    "sleep":    (86, 626, 514, 828),
    "meow":     (635, 558, 879, 839),
    "thinking": (1115, 558, 1376, 846),
}

QUALITY = 88


def background_mask(im):
    """True where the pixel is background reachable from outside the sheet."""
    w, h = im.size
    px = im.load()

    def is_bg(x, y):
        r, g, b = px[x, y]
        return (abs(r - BG[0]) <= TOL and abs(g - BG[1]) <= TOL
                and abs(b - BG[2]) <= TOL)

    bg = bytearray(w * h)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if is_bg(x, y) and not bg[y*w + x]:
                bg[y*w + x] = 1
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if is_bg(x, y) and not bg[y*w + x]:
                bg[y*w + x] = 1
                q.append((x, y))
    while q:
        x, y = q.popleft()
        for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
            if (0 <= nx < w and 0 <= ny < h
                    and not bg[ny*w + nx] and is_bg(nx, ny)):
                bg[ny*w + nx] = 1
                q.append((nx, ny))
    return bg


def largest_body(bg, w, box):
    """Pixels of the biggest connected foreground blob inside `box`.

    A pose's bounding box also catches whatever decoration floats beside it.
    The cat is always the largest blob by a wide margin, so taking only that
    one drops the rest without hand-listing every sticker on the sheet.
    """
    x0, y0, x1, y1 = box
    seen = set()
    best = set()
    for sy in range(y0, y1):
        for sx in range(x0, x1):
            if bg[sy*w + sx] or (sx, sy) in seen:
                continue
            stack, cells = [(sx, sy)], []
            seen.add((sx, sy))
            while stack:
                x, y = stack.pop()
                cells.append((x, y))
                for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
                    if (x0 <= nx < x1 and y0 <= ny < y1
                            and not bg[ny*w + nx] and (nx, ny) not in seen):
                        seen.add((nx, ny))
                        stack.append((nx, ny))
            if len(cells) > len(best):
                best = set(cells)
    return best


def build(out_dir="public/cat", data_dir="src/data"):
    if not os.path.exists(SRC):
        raise SystemExit(f"missing {SRC} — the sheet is the build input")
    im = Image.open(SRC).convert("RGB")
    w, h = im.size
    px = im.load()
    bg = background_mask(im)
    os.makedirs(out_dir, exist_ok=True)

    manifest = {}
    total = 0
    for name, box in POSES.items():
        body = largest_body(bg, w, box)
        if not body:
            raise SystemExit(f"{name}: no foreground found in {box}")
        xs = [p[0] for p in body]
        ys = [p[1] for p in body]
        cx0, cx1 = min(xs), max(xs) + 1
        cy0, cy1 = min(ys), max(ys) + 1

        sprite = Image.new("RGBA", (cx1 - cx0, cy1 - cy0), (0, 0, 0, 0))
        sp = sprite.load()
        for x, y in body:
            sp[x - cx0, y - cy0] = px[x, y] + (255,)

        path = f"{out_dir}/{name}.webp"
        sprite.save(path, "WEBP", quality=QUALITY, method=6)
        size = os.path.getsize(path)
        total += size
        manifest[name] = {
            "src": f"/cat/{name}.webp",
            "width": sprite.width,
            "height": sprite.height,
        }
        print(f"  {name:9} {sprite.width:4}x{sprite.height:<4} {size/1024:6.1f} KB")

    with open(f"{data_dir}/cat-sprites.json", "w") as fh:
        json.dump(manifest, fh, indent=2, sort_keys=True)
        fh.write("\n")
    print(f"\n{len(manifest)} sprites, {total/1024:.1f} KB total")


if __name__ == "__main__":
    build()
