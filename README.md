# Neobank · macro cloth impulse

Three.js study based on the supplied 2.68-second Sberbank reference. A single luminous wave deforms a woven surface, followed by a trough and a damped rebound. It is an approximation of the visual behavior, not a recovered Sberbank asset or a numerical cloth/fluid solver.

The app is a React + TypeScript + Vite client. React owns the overlay UI; the cloth impulse stays an imperative Three.js engine so the custom multi-pass pipeline (surface target, depth-of-field gather, then particles) is unchanged.

## Run

Node.js 22+:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. Vite serves the app on localhost. Production build: `npm run build` then `npm run preview`.

## Behavior

One impulse plays at startup and then settles. “Повторить импульс” restarts the event; the timeline lets you inspect an exact paused moment. Speed, intensity, focused ring width and defocus are adjustable. There is no automatic periodic loop.

Reduced-motion preferences select the 0.35-second static sample. Pressing replay explicitly starts motion. Hidden tabs suspend rendering without advancing the event. Rendering also stops once the impulse settles. CSS provides a fallback if WebGL2 is unavailable.

## Rendering

- A 300 × 300 segmented Three.js mesh is displaced in the vertex shader. Finite differences of the same height function produce surface normals. Yarn coordinates stay attached to the mesh.
- A circular wave packet originates outside the camera crop, `(0, -6.0)` in surface coordinates. The wave expands isotropically in world space; perspective makes its screen projection elliptical. A shallow crest, reduced trough and smaller rebound produce deformation and emission from the same field. Resting drape is static.
- Seeded particles have world-space anchors above the cloth. They follow the surface height, lift with the wave, move slightly along its radial slope with a short lag, and brighten along the same front. They do not independently drift or twinkle.
- A perspective camera looks across the cloth. Surface color and actual displaced mesh depth are rendered into a target. A 32-tap pass reconstructs world positions from displaced mesh depth and applies the same annular focus function as the cloth and particles; analytic filtering suppresses unresolved yarn frequencies.
- Particles receive their own depth-of-field radii and sample surface depth for occlusion. They are composited after surface blur to avoid blurring twice.
- DPR is capped at 1.5 and the render buffer at approximately 1.8 million pixels.

`src/lib/background.ts` contains scene/lifecycle/controller setup. `src/lib/wave-shaders.ts` contains the shared impulse and render shaders. `createBackground(canvas, onStatus, onTime)` returns setters for speed/intensity/focus/aperture, `toggle()`, `seek(seconds)`, `replay()`, and `dispose()` for unmount cleanup. React mounts that controller from `src/components/AmbientBackground.tsx`.

## Validation and limitations

JavaScript syntax and browser shader compilation checked. Inspected paused pulse states, settled state, timeline and replay. Checked the expanding ring at 0.8 and 1.6 seconds and compared narrow/default focus widths; browser logs contained no shader errors. Physical phone frame rate, thermal behavior, and cross-browser context restoration have not been measured. DOF and particle motion are artistic approximations, without full optical scattering or a physics solver. The original short reference cannot establish a full repeating cycle; this version deliberately uses a single event.

## Reference study — stages 1–4

Open http://127.0.0.1:5173/?study for a paused 0.35-second control frame. The “Контрольный кадр · 0,35 с” button returns to it from any point; replay still starts at zero. The selected visual target is frame 0.35 seconds of IMG_8672.MP4 (944 × 1890). Compare in a 472 × 945 viewport. Equal timestamps are a review convention here, not a claim that the full motion is matched.

Camera position is `(0, 1.45, 3.6)`, looking at the origin, with a 0.65-radian roll. The distant wave origin and initial radius of 6 units crop a single diagonal arc. A shallow 0.085-unit crest and reduced trough avoid the earlier thick tubular folds. Radius still advances at the existing speed; animation timing has not been fitted to the clip.

Focus follows the crest with a much narrower sharp band (default width control 32%) and smooth near/far blur. Surface texture filtering, post-processing and particle defocus share the same focus function. It is an art-directed curved focus surface, not a physical lens simulation.

Lighting combines the wave highlight with broad mint and green illumination and a cool blue/teal foreground. Broad lights are composed in screen space to retain their placement across viewport sizes. A 12-sample highlight halo complements the existing 32-sample depth blur. This is an artistic approximation of optical scattering.

The surface uses the preferred luminous dot pattern, with refined particle depth; matching the full animation remains a subsequent stage.

Validation: JavaScript syntax, browser shader compilation, portrait and wide rendering, replay and control-frame return checked. No browser warnings/errors observed during these checks. Physical phone performance and cross-browser behavior remain unmeasured. The Impeccable detector used its reduced regex fallback because parser dependencies were unavailable.

## Defocus refinement

The surface now retains its material variation until the optical pass; only subpixel yarn frequencies are filtered during shading. The aperture gather uses 64 samples and a mipmapped color target to soften unresolved detail between samples. Near and far regions use different blur growth. Seeded, material-bound variation prevents defocused regions becoming entirely uniform.

The existing dust now uses a soft-edged aperture disc when defocused and a compact core in focus. Anchors cover a 10 × 10 region to make the depth cues visible within the camera crop. This remains an artistic approximation, not a physical lens simulation. Browser shader compilation and the portrait control frame were checked; the increased GPU cost has not been benchmarked on a physical phone.


## Material and particles — stages 5–6

The luminous dot lattice is restored by user preference over the directional yarn study. Material-bound variation, pixel-footprint antialiasing and the optical defocus pass remain. Lighting and the refined particle layers are unchanged.

Seeded dust uses two elevation groups: 68% close to the surface (0.008–0.063 units), with the remainder suspended higher (0.10–0.58 units). Size, brightness and subtle warm/cool tint vary per particle. Compact in-focus sparks transition into the existing aperture discs with depth. The original wave-driven motion and lighting relationship remain; there is no independent twinkle clock.

Checked shader compilation, portrait/wide control frames, replay and return to the control frame. Browser logs contained no warnings or errors during these checks. Physical phone performance remains unmeasured.
