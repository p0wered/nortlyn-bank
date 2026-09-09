# Neobank · macro cloth impulse

Three.js study based on the supplied 2.68-second Sberbank reference. A single luminous wave deforms a woven surface, followed by a trough and a damped rebound. It is an approximation of the visual behavior, not a recovered Sberbank asset or a numerical cloth/fluid solver.

## Run

Node.js 22+:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. The local server serves installed Three.js modules; no CDN is used. It is a development server bound to localhost.

## Behavior

One impulse plays at startup and then settles. “Повторить импульс” restarts the event; the timeline lets you inspect an exact paused moment. Speed, intensity, focused ring width and defocus are adjustable. There is no automatic periodic loop.

Reduced-motion preferences select a static sample. Pressing replay explicitly starts motion. Hidden tabs suspend rendering without advancing the event. Rendering also stops once the impulse settles. CSS provides a fallback if WebGL2 is unavailable.

## Rendering

- A 300 × 300 segmented Three.js mesh is displaced in the vertex shader. Finite differences of the same height function produce surface normals. Yarn coordinates stay attached to the mesh.
- A circular wave packet originates at a visible point on the cloth, `(0, -0.45)` in surface coordinates. The wave expands isotropically in world space; perspective makes its screen projection elliptical. A localized crest, trough and smaller rebound produce deformation and emission from the same field. Resting drape is static.
- Seeded particles have world-space anchors above the cloth. They follow the surface height, lift with the wave, move slightly along its radial slope with a short lag, and brighten along the same front. They do not independently drift or twinkle.
- A perspective camera looks across the cloth. Surface color and actual displaced mesh depth are rendered into a target. A 32-tap pass reconstructs world positions from displaced mesh depth and applies the same annular focus function as the cloth and particles; analytic filtering suppresses unresolved yarn frequencies.
- Particles receive their own depth-of-field radii and sample surface depth for occlusion. They are composited after surface blur to avoid blurring twice.
- DPR is capped at 1.5 and the render buffer at approximately 1.8 million pixels.

`src/background.js` contains scene/lifecycle/controller setup. `src/wave-shaders.js` contains the shared impulse and render shaders. `createBackground(canvas, onStatus, onTime)` returns setters for speed/intensity/focus/aperture, `toggle()`, `seek(seconds)`, `replay()`, and `dispose()` for unmount cleanup.

## Validation and limitations

JavaScript syntax and browser shader compilation checked. Inspected paused pulse states, settled state, timeline and replay. Checked the expanding ring at 0.8 and 1.6 seconds and compared narrow/default focus widths; browser logs contained no shader errors. Physical phone frame rate, thermal behavior, and cross-browser context restoration have not been measured. DOF and particle motion are artistic approximations, without full optical scattering or a physics solver. The original short reference cannot establish a full repeating cycle; this version deliberately uses a single event.

## Following focus

Focus is a broad curved band centered on the instantaneous radius of the wave. The width slider expands this band on both sides of the crest. Inside and outside of the band, blur increases smoothly. Elevated particles retain defocus based on their height above the cloth. This is deliberately art-directed focus, not the focal plane of a conventional physical lens. World-position reconstruction uses the active camera matrices, including on resize, so surface shading, texture filtering, and post-processing agree on the moving focused ring.

## Low macro viewpoint

Camera position is `(0.35, 0.9, 2.65)`, looking at `(0, 0, -0.05)`: approximately 18 degrees above the cloth. A 0.28-radian camera roll gives the crop a diagonal orientation. The field of view is capped at 24 degrees and narrowed for wide windows so the far plane boundary stays outside the frame. This brings the foreground crest close while strongly foreshortening the distant arc. The circular wave and following focus are unchanged.
