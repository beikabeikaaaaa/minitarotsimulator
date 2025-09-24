# Tarot • 3-Card Draw (Dark Edition)

A GitHub Pages–ready site. Shuffle and draw three cards with upright/reversed meanings. Dark/mystic theme, deal-in animation, refined buttons with ripple, responsive layout.

## Run locally
Open `index.html` in your browser.

## Deploy on GitHub Pages
1. Create a new repo and upload everything in this folder.
2. In the repo, go to **Settings → Pages** → Source: `Deploy from a branch`, Branch: `main` (root).
3. Your site will be available at `https://<your-username>.github.io/<repo>/`

## Replace artwork
- All 22 Major Arcana images live in `assets/cards/` as SVG placeholders.
- Replace any file with your own JPG/PNG/SVG and keep the same filename, or update the `image` path inside `cards.json`.

## Data format
Each card in `cards.json`:
```json
{
  "id": "major_00_the_fool",
  "name": "The Fool",
  "image": "assets/cards/major_00_the_fool.svg",
  "arcana": "Major",
  "suit": null,
  "number": 0,
  "upright": "…",
  "reversed": "…"
}
```

Enjoy!
