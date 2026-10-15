"""Builds transparent logo variants, favicons and the social share image
from assets/img/logo/logo-original.jpg (a raster logo on a cream background).

Run from the project root:  python tools/make-logo-assets.py
Requires: pip install pillow numpy
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets/img/logo/logo-original.jpg"
OUT = ROOT / "assets/img/logo"

CREAM = np.array([253, 251, 247], dtype=float)   # site background  #FDFBF7
ESPRESSO = (28, 22, 19)                          # #1C1613

src = np.asarray(Image.open(SRC).convert("RGB"), dtype=float)
bg = np.median(src[:40, :40].reshape(-1, 3), axis=0)  # paper colour of the supplied logo

# Ink colours measured from the logo: dark brown (wordmark, circle, bean) and orange (flame)
lum = src.mean(axis=2)
r_b = src[..., 0] - src[..., 2]
brown_px = src[(lum < 90)]
orange_px = src[(r_b > 140) & (lum > 90) & (lum < 190)]
BROWN = np.median(brown_px, axis=0)
ORANGE = np.median(orange_px, axis=0)
print("bg", bg, "brown", BROWN, "orange", ORANGE)


def coverage(ink):
    """How much of `ink` is present in each pixel (0..1), assuming ink over bg."""
    d = ink - bg
    t = ((src - bg) @ d) / (d @ d)
    return np.clip(t, 0, 1)


cov_brown = coverage(BROWN)
cov_orange = coverage(ORANGE)

# Which ink does each pixel belong to? Orange has a strong red-over-blue component.
is_orange = (r_b > 60) & (cov_orange > cov_brown * 0.8)
alpha = np.where(is_orange, cov_orange, cov_brown)
alpha = np.clip(alpha * 1.04, 0, 1)  # tiny boost so thin strokes keep their weight


def build(brown_replacement):
    rgb = np.empty_like(src)
    rgb[...] = np.where(is_orange[..., None], ORANGE, brown_replacement)
    out = np.dstack([rgb, alpha * 255]).astype("uint8")
    return Image.fromarray(out, "RGBA")


dark_ink = build(BROWN)        # for light backgrounds
light_ink = build(CREAM)       # for dark backgrounds


def crop_to_content(img, box=None, pad=16):
    a = np.asarray(img)[..., 3]
    if box:
        mask = np.zeros_like(a)
        x0, y0, x1, y1 = box
        mask[y0:y1, x0:x1] = a[y0:y1, x0:x1]
        a = mask
    ys, xs = np.where(a > 20)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    return img.crop((max(x0 - pad, 0), max(y0 - pad, 0), min(x1 + pad, img.width), min(y1 + pad, img.height)))


# rows 0..510 hold the emblem (circle, flame, bean); the wordmark sits below
EMBLEM_BOX = (400, 0, 1000, 515)
FULL_BOX = (300, 0, 1100, 700)

variants = {
    "logo-full-dark.png": crop_to_content(dark_ink, FULL_BOX),
    "logo-full-light.png": crop_to_content(light_ink, FULL_BOX),
    "emblem-dark.png": crop_to_content(dark_ink, EMBLEM_BOX),
    "emblem-light.png": crop_to_content(light_ink, EMBLEM_BOX),
}
for name, img in variants.items():
    img.thumbnail((900, 900), Image.LANCZOS)
    img.save(OUT / name, optimize=True)
    print(name, img.size)

# ---- favicons: emblem on a rounded cream tile ----
def tile(size):
    t = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(t).rounded_rectangle((0, 0, size - 1, size - 1), radius=size // 5, fill=tuple(int(c) for c in CREAM) + (255,))
    e = variants["emblem-dark.png"].copy()
    inner = int(size * 0.8)
    e.thumbnail((inner, inner), Image.LANCZOS)
    t.alpha_composite(e, ((size - e.width) // 2, (size - e.height) // 2))
    return t

tile(512).save(OUT / "favicon-512.png", optimize=True)
tile(192).save(OUT / "favicon-192.png", optimize=True)
tile(180).save(OUT / "apple-touch-icon.png", optimize=True)
tile(32).save(OUT / "favicon-32.png", optimize=True)
tile(64).save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

# ---- social share image 1200x630: roastery photo, dark overlay, light logo ----
photo = Image.open(ROOT / "assets/img/photos/hero-roastery.jpg").convert("RGB")
scale = max(1200 / photo.width, 630 / photo.height)
photo = photo.resize((int(photo.width * scale) + 1, int(photo.height * scale) + 1), Image.LANCZOS)
left = (photo.width - 1200) // 2
photo = photo.crop((left, 0, left + 1200, 630)).filter(ImageFilter.GaussianBlur(2))
overlay = Image.new("RGBA", (1200, 630), ESPRESSO + (205,))
card = photo.convert("RGBA")
card.alpha_composite(overlay)
logo = variants["logo-full-light.png"].copy()
logo.thumbnail((560, 440), Image.LANCZOS)
card.alpha_composite(logo, ((1200 - logo.width) // 2, (630 - logo.height) // 2))
card.convert("RGB").save(ROOT / "assets/img/og-image.jpg", quality=88, optimize=True)
print("og-image.jpg written")
