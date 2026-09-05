"""
Draws the site's pointer artwork into public/: a white arrow with an ink
outline inside a warm halo, at 1x and 2x, in a normal and a "hot" (interactive)
variant. Pure stdlib, no image library.

    python3 scripts/make-cursor.py public

The hotspot is the arrow tip. It sits at (14, 10) in the 48px artwork, which is
the number globals.css passes after the url() — change the tip here and change
it there too, or the click point drifts away from the arrow.
"""

import zlib, struct, math

# Classic arrow pointer, tip at origin, in unit space (12.7 x 19.4).
ARROW = [(0,0),(0,17.2),(4.3,13.1),(6.9,19.4),(9.8,18.2),(7.2,12.0),(12.7,11.9)]

WHITE = (255,255,255)
INK   = (26,26,23)        # --color-ink
GLOW   = (255,122,69)     # warm coral-orange
ACCENT = (31, 87,214)     # --color-accent, the site's link/focus blue
MARKER = (255,214, 74)    # --color-marker

def inside(px, py, poly):
    c = False
    n = len(poly)
    for i in range(n):
        x1,y1 = poly[i]; x2,y2 = poly[(i+1)%n]
        if (y1 > py) != (y2 > py):
            xt = x1 + (py-y1)*(x2-x1)/(y2-y1)
            if px < xt: c = not c
    return c

def dist_edge(px, py, poly):
    best = 1e9
    n = len(poly)
    for i in range(n):
        x1,y1 = poly[i]; x2,y2 = poly[(i+1)%n]
        dx,dy = x2-x1, y2-y1
        L = dx*dx + dy*dy
        t = 0.0 if L == 0 else max(0.0, min(1.0, ((px-x1)*dx + (py-y1)*dy)/L))
        ex,ey = px-(x1+t*dx), py-(y1+t*dy)
        d = math.hypot(ex,ey)
        if d < best: best = d
    return best

def boxblur(a, N, r):
    """Separable box blur, 3 passes -> near-gaussian."""
    for _ in range(3):
        out = [0.0]*(N*N)
        for y in range(N):                       # horizontal
            row = y*N; acc = 0.0
            for x in range(-r, N+r):
                if x+r < N: acc += a[row+x+r]
                if x-r-1 >= 0: acc -= a[row+x-r-1]
                if 0 <= x < N: out[row+x] = acc/(2*r+1)
        a = out
        out = [0.0]*(N*N)
        for x in range(N):                       # vertical
            acc = 0.0
            for y in range(-r, N+r):
                if y+r < N: acc += a[(y+r)*N+x]
                if y-r-1 >= 0: acc -= a[(y-r-1)*N+x]
                if 0 <= y < N: out[y*N+x] = acc/(2*r+1)
        a = out
    return a

def render(N, tip, height, stroke, glow_r, glow_peak, ss=3, glow_rgb=None, ring_r=0):
    k = height / 19.4
    poly = [(tip[0]+x*k, tip[1]+y*k) for x,y in ARROW]
    W = N*ss
    fill = [0.0]*(N*N); strk = [0.0]*(N*N)
    half = stroke/2.0
    for sy in range(W):
        py = (sy+0.5)/ss
        for sx in range(W):
            px = (sx+0.5)/ss
            d = dist_edge(px, py, poly)
            if d <= half:
                strk[(sy//ss)*N + (sx//ss)] += 1.0
            elif inside(px, py, poly):
                fill[(sy//ss)*N + (sx//ss)] += 1.0
    inv = 1.0/(ss*ss)
    fill = [v*inv for v in fill]
    strk = [v*inv for v in strk]

    shape = [min(1.0, f+s) for f,s in zip(fill,strk)]
    glow  = boxblur(shape[:], N, int(round(glow_r)))
    if ring_r:
        # Difference of two blurs: the near field cancels out and what is left
        # is an aura that peaks a little way off the silhouette, tracing the
        # arrow instead of pooling behind it.
        inner = boxblur(shape[:], N, int(round(ring_r)))
        glow = [max(0.0, a-b) for a, b in zip(glow, inner)]
    mx = max(glow) or 1.0
    glow = [min(1.0, (v/mx)*glow_peak) for v in glow]

    px_out = bytearray()
    for i in range(N*N):
        r=g=b=0.0; a=0.0
        for (cr,cg,cb), ca in (((glow_rgb or GLOW),glow[i]), (WHITE,fill[i]), (INK,strk[i])):
            if ca <= 0: continue
            na = ca + a*(1-ca)
            if na > 0:
                r = (cr*ca + r*a*(1-ca))/na
                g = (cg*ca + g*a*(1-ca))/na
                b = (cb*ca + b*a*(1-ca))/na
            a = na
        px_out += bytes((int(r+0.5), int(g+0.5), int(b+0.5), int(a*255+0.5)))
    return px_out

def write_png(path, N, px):
    raw = b"".join(b"\x00" + bytes(px[y*N*4:(y+1)*N*4]) for y in range(N))
    def chunk(tag, data):
        return (struct.pack(">I", len(data)) + tag + data
                + struct.pack(">I", zlib.crc32(tag+data) & 0xffffffff))
    png = (b"\x89PNG\r\n\x1a\n"
           + chunk(b"IHDR", struct.pack(">IIBBBBB", N, N, 8, 6, 0, 0, 0))
           + chunk(b"IDAT", zlib.compress(raw, 9))
           + chunk(b"IEND", b""))
    open(path, "wb").write(png)

def downsample(px, N):
    """N -> N/2, box average, premultiplied so edges stay clean."""
    M = N//2
    out = bytearray()
    for y in range(M):
        for x in range(M):
            ar=ag=ab=aa=0.0
            for dy in (0,1):
                for dx in (0,1):
                    i = ((y*2+dy)*N + (x*2+dx))*4
                    a = px[i+3]/255.0
                    ar += px[i]*a; ag += px[i+1]*a; ab += px[i+2]*a; aa += a
            if aa > 0:
                out += bytes((int(ar/aa+0.5), int(ag/aa+0.5), int(ab/aa+0.5), int(aa/4*255+0.5)))
            else:
                out += b"\x00\x00\x00\x00"
    return out

# The arrow sits just under the system pointer's size and the halo is wide and
# faint rather than a tight ring — warmth around the cursor, not a glow on it.
# `canvas` must leave room for the full blur, or the halo clips to a square.
# Roughly half the system pointer, with the outline and halo scaled down to
# match. The halo is a soft blue cloud in the site's own accent rather than a
# separate hue, and is deliberately withdrawn — felt more than looked at.
#
# `canvas` is not free space: boxblur() runs three passes, so a halo of radius
# r actually reaches about 2.6*r. If the canvas does not leave that much room on
# every side of the arrow the halo clips to a square, which at low opacity is
# easy to miss until you see it on a plain background. check_margins() below
# fails the build rather than letting that ship.
VARIANTS = {
    # name:      (canvas, tip,      arrow_h, stroke, glow_r, glow_peak, glow_rgb)
    "cursor":     (32, (11, 11), 10.0, 0.66, 4.0, 0.18, ACCENT),
    "cursor-hot": (32, (11, 11), 10.0, 0.66, 4.0, 0.30, ACCENT),
}

BLUR_REACH = 2.6   # multiples of glow_r that the 3-pass box blur actually covers


def check_margins(name, spec):
    canvas, tip, h, _stroke, gr, _peak, _rgb = spec
    need = BLUR_REACH * gr
    w = h * 12.7 / 19.4
    have = {
        "left":   tip[0],
        "top":    tip[1],
        "right":  canvas - (tip[0] + w),
        "bottom": canvas - (tip[1] + h),
    }
    tight = {k: round(v, 1) for k, v in have.items() if v < need}
    if tight:
        raise SystemExit(
            f"{name}: halo of radius {gr} reaches ~{need:.1f}px but the canvas "
            f"leaves less than that on {tight} — the glow would clip to a "
            f"square. Grow `canvas`, move `tip`, or shrink `glow_r`."
        )


def build(out_dir, name, spec, px_scale=2):
    canvas, tip, h, stroke, gr, peak, gcol = spec
    N = canvas * px_scale
    hi = render(N, (tip[0]*px_scale, tip[1]*px_scale), h*px_scale,
                stroke*px_scale, gr*px_scale, peak, glow_rgb=gcol)
    write_png(f"{out_dir}/{name}@2x.png", N, hi)
    write_png(f"{out_dir}/{name}.png", N//2, downsample(hi, N))
    return canvas, tip


if __name__ == "__main__":
    import sys
    out = sys.argv[1] if len(sys.argv) > 1 else "public"
    for name, spec in VARIANTS.items():
        check_margins(name, spec)
        canvas, tip = build(out, name, spec)
        print(f"wrote {name}  canvas={canvas}px  hotspot={tip[0]} {tip[1]}")
