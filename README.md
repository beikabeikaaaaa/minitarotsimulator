# Mini Tarot — 3‑Card Draw (Majors Only)

This is a ready‑to‑upload scaffold for GitHub Pages. It uses **your 22 Major Arcana images**. If an image isn’t found, it will fall back to `assets/placeholder.jpg` so the page never breaks.

## How to Use
1. **Copy your 22 images** into `assets/major/`.
2. Make sure the **filenames exactly match** one of these (recommended), including lowercase and dashes:

```
00-the-fool.jpg
01-the-magician.jpg
02-the-high-priestess.jpg
03-the-empress.jpg
04-the-emperor.jpg
05-the-hierophant.jpg
06-the-lovers.jpg
07-the-chariot.jpg
08-strength.jpg
09-the-hermit.jpg
10-wheel-of-fortune.jpg
11-justice.jpg
12-the-hanged-man.jpg
13-death.jpg
14-temperance.jpg
15-the-devil.jpg
16-the-tower.jpg
17-the-star.jpg
18-the-moon.jpg
19-the-sun.jpg
20-judgement.jpg
21-the-world.jpg
```

> If your repo already has different names (e.g. `TheMagician.JPG`), **no problem** — the code tries multiple fallbacks: `slug`, `index-slug`, `TitleNoSpaces`, with `.jpg/.JPG/.png/.PNG/.webp`. If none matches, it shows `assets/placeholder.jpg`.

3. (Optional) Replace the background image at `assets/bg.jpg`. The CSS sets it to ~**35% opacity** via an overlay.
4. Open `index.html` locally to test (or upload to GitHub Pages).

## Features
- Draw 3 unique Major Arcana cards
- Each has a **50% chance** to be **Reversed** (image auto-rotates 180°)
- Click/tap a card to toggle the **meaning** (upright vs. reversed)
- Fully responsive, centered layout
- Dataset lives in `data/cards.json`

## Common Fixes
- **Images not showing** → check exact **case‑sensitive** filenames and folder path `assets/major/`.
- **Still not showing?** Try one of the supported naming patterns (see above) or rename your files to the recommended list.
- **Background too strong/weak?** Tweak `.bg { opacity: 0.35; }` in `style.css`.

Happy uploading 🚀
