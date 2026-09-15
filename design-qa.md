# Design QA

- Source visual truth: `/Users/eva-02/Downloads/Desktop.png`
- Implementation capture: Codex in-app Browser, local prototype tab `Nortlyn Bank`, captured during this task
- Desktop viewport: 1470 × 1819 CSS px at device pixel ratio 1
- Source pixels: 1470 × 1819
- Implementation CSS viewport: 1470 × 1819; document content width 1455 px after the native 15 px scrollbar
- Mobile verification viewport: 390 × 844 CSS px at device pixel ratio 1
- State: settled ambient animation, initial scroll position

## Direction

Architectural scaffold for a banking React SPA. The selected reference defines the macro composition only: an image-led Hero followed by a blank white section with rounded upper corners. Native CSS is used because no product design system is present. Design dials: variance 3, motion 5, density 1.

## Full-view comparison evidence

The source begins its white section at approximately y=890. The implementation begins it at y=891.69, preserving the approximately 49% upper visual region and the same full-width rounded transition. The Three.js scene fills the Hero without cropping gaps. The source's blue-to-lilac atmosphere is represented through the background component's blue, cobalt and lilac props while retaining the project's existing cloth shader.

Desktop geometry:

- Hero: 1455 × 927.69 px
- Content section: y=891.69, overlap=36 px, top radius=36 px
- Horizontal overflow: none (`scrollWidth=1455`)
- Console warnings and errors: none

Mobile geometry:

- Hero: 375 × 405.12 px
- Content section: y=381.12, overlap=24 px, top radius=24 px
- Horizontal overflow: none (`scrollWidth=375`)

## Focused region comparison

A separate crop was not needed because the target contains no typography, controls, icons or detailed content. The only fidelity-critical region is the Hero/content boundary, and it remains clearly readable in the full-view captures at both tested viewports.

## Required fidelity surfaces

- Fonts and typography: not applicable; both source and scaffold intentionally contain no visible copy.
- Spacing and layout rhythm: passed; transition position differs by about 2 px from the source and the radius/overlap proportions match.
- Colors and visual tokens: passed for direction; exact pixels intentionally differ because the supplied Three.js shader remains the Hero asset rather than replacing it with the raster reference.
- Image quality and asset fidelity: passed; the existing live WebGL asset is retained at native viewport resolution with a color-aware CSS fallback.
- Copy and content: passed; no invented product copy was added.
- Responsive behavior: passed at 1470 × 1819 and 390 × 844; the mobile renderer was verified after reload.
- Accessibility: decorative canvas is hidden from assistive technology; both structural sections have Russian accessible labels; reduced-motion behavior is retained.

## Findings

No actionable P0, P1 or P2 findings remain. The native vertical scrollbar is expected because this is now a scrollable website rather than a fixed graphics demo.

## Comparison history

- Initial desktop pass: macro boundary aligned with the reference and required no correction.
- Initial mobile resize briefly captured the WebGL buffer before resize completion; a clean reload confirmed the full-width canvas and correct responsive layout. This was a capture timing issue, not a product defect.

## Implementation checklist

- [x] Three.js canvas scoped to Hero
- [x] Controls removed
- [x] Visual settings exposed as typed props
- [x] Home page and section component structure introduced
- [x] Reference transition reproduced responsively
- [x] Production build passed
- [x] Browser console checked

final result: passed
