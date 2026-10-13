# Logo

<img src="logo.svg" width="96" height="96" alt="Bedtime Calculator logo">

A crescent over three arcs: the sleep cycles the calculator counts, in the night and moonlight colors of the results panel.

| Part | Color |
|---|---|
| Tile | `#1A2142` (`--night-bg`) |
| Moon and arcs | `#F2D27F` (`--night-accent`) |

Token names refer to `src/styles/tokens.css`.

## Using it

- The tile keeps its colors on light and dark pages. On dark pages the site adds a 1px edge (`--line-strong`) so the tile does not blend into the background.
- It stays legible down to 16px, the favicon size.
- Next to the mark, the name is set in Public Sans: **Bedtime** in bold (700), then Calculator in regular (400) and the muted text color (`--muted`).
- The mark lives in four places that change together: `markSvg()` in `src/components/ui/icons.ts`, `public/favicon.svg`, `scripts/og/og.html` (the source of the share image and the touch icon) and `logo.svg` here.

## How it was chosen

Three concepts were drawn and tested as an app icon, at 32px and 16px, and in the header on light and dark pages. Concept A was chosen. Each one is also an SVG here: `concept-A.svg`, `concept-B.svg` and `concept-C.svg`.

![The three logo concepts for Bedtime Calculator](board.png)
