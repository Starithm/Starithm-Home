# Share card sources

The 1200x630 images in `public/og/` are rendered from the HTML next to this file, so a
card can be re-edited later instead of being an opaque PNG nobody can change.

Rendered at 2x and downscaled, which is what gives the type its edges:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=1200,630 --virtual-time-budget=5000 \
  --screenshot=ears-card@2x.png tools/og-cards/ears-card.html
sips -z 630 1200 ears-card@2x.png --out public/og/ears-share.png
```

1200x630 is exactly the 1.91:1 that LinkedIn and X want, so nothing is cropped.
Fonts load from Google Fonts at render time, so run this online.

| source | output | used by |
|---|---|---|
| `ears-card.html` | `public/og/ears-share.png` | `/ears-to-the-universe/*` via `api/melody-page.ts` |

`public/og/starithm-share.png` (site-wide) predates this directory and has no source here.
