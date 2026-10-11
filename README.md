# Nortlyn Bank

A portfolio concept of a Russian-language neobank website. Only the home-page Hero is filled;
the brand, products and terms are fictional.

## Run

Node.js 22+:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. Production build: `npm run build`, then `npm run preview`.

## Structure

- `src/pages/HomePage/HomePage.tsx` composes the home page: Hero and an empty content section.
- `src/components/HomePage/Hero.tsx` contains the Hero offer grid and the main-card asset.
- `src/components/Button/Button.tsx` is the shared button with `primary`, `secondary`
  and `text` variants.
- `src/components/AmbientBackground/AmbientBackground.tsx` exposes the background colors,
  intensity, focus, aperture, speed, autoplay and still-frame time as props.
- `src/lib/background.ts` owns the Three.js renderer lifecycle;
  `src/lib/wave-shaders.ts` holds its shaders.

## Styling

Each styled component/page and its CSS Module share a folder (for example,
`Button/Button.tsx` and `Button/Button.module.css`), imported as `styles` in TSX.
Local states, pseudo-elements and media queries stay in these files.
`src/assets/index.css` is reserved for the global reset, fonts, shared color tokens
and global rules. The project does not use Tailwind.

See `AGENTS.md` for code conventions and `PROJECT.md` for shared design decisions.

## Ambient background

React owns page composition; the background stays an imperative Three.js engine.
`createBackground(canvas, options)` returns only `dispose()` for unmount cleanup.

- A 300 × 300 segmented cloth mesh is displaced in the vertex shader by a circular wave impulse
  that plays once at startup; focus leaves the frame with its crest. Shallow, soft-focus idle
  swells then keep rolling out from the same origin; from `IDLE_START` the field repeats every
  `IDLE_PERIOD` seconds.
- 1,800 seeded dust particles are anchored above the cloth and follow the same wave.
- A post pass applies a 64-sample depth-of-field blur and a 12-sample highlight halo.
- DPR is capped at 1.5 and the render buffer at about 1.8 million pixels.
- Idle frames render at about 30 fps. Reduced-motion preferences show a static frame.
  Hidden tabs and an offscreen canvas suspend rendering.
  If WebGL is unavailable or the context is lost, a CSS gradient in the same colors remains.

Physical phone performance has not been measured.

## Design files

`design/` is untracked. It holds reference screenshots and source renders for the Hero assets.
The page uses only the optimized files in `src/assets/images`.
