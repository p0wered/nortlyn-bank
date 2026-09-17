# Design QA

- Source visual truth: `/Users/eva-02/Projects/nortlyn-bank/src/refs/iphone-17-mock.png`
- Implementation: `http://127.0.0.1:5173/app`
- Implementation capture: Codex in-app Browser inline capture, 662 × 869 px
- Source pixels: 1350 × 2760 RGBA
- Implementation CSS viewport: 662 × 869; device frame rendered at approximately 374 × 774 CSS px
- Density normalization: proportional full-frame comparison; both artifacts use the same 1350:2760 frame aspect ratio
- State: blank white app viewport, initial scroll position

## Full-view comparison evidence

The source PNG and the browser render were reviewed together. The complete device is visible, centered, and scaled without cropping. The supplied transparent screen opening reveals the live white viewport while the original metal body, side controls, rounded corners, Dynamic Island, and camera remain above it at native proportions.

## Focused region comparison evidence

The top region and all four screen edges were checked at the rendered size. There are no visible gaps between the live viewport and the raster frame, and the viewport does not cover the Dynamic Island. A separate detail crop was unnecessary because the screen is intentionally blank and contains no typography or controls.

## Required fidelity surfaces

- Fonts and typography: not applicable; no visible copy was introduced.
- Spacing and layout rhythm: passed; the phone is centered with equal stage padding and preserves the asset aspect ratio.
- Colors and visual tokens: passed; the frame is unmodified and the neutral stage cleanly separates it from the white viewport.
- Image quality and asset fidelity: passed; the original 1350 × 2760 PNG is used directly with no stretching or recreated device chrome.
- Copy and content: passed; the viewport intentionally remains blank for the future mock-app interface.
- Responsiveness: passed at the available 662 × 869 browser viewport; the frame scales to fit both available width and height without page-level overflow.
- Accessibility: the editable screen is labeled `Мобильный viewport`; the decorative frame image is hidden from assistive technology.

## Findings

No actionable P0, P1, or P2 findings remain.

## Comparison history

- Initial pass: confirmed that the PNG's screen opening is transparent, so the app viewport can stay live rather than being rasterized.
- Final pass: added stable phone-frame and phone-screen hooks, rebuilt, reloaded `/app`, and confirmed unchanged geometry with no visible seams.

## Implementation checklist

- [x] Separate `/app` route
- [x] Reusable `PhoneFrame` component
- [x] Live, internally scrollable viewport
- [x] Original iPhone raster layered above app content
- [x] Responsive width/height fitting
- [x] Production build passed
- [x] Browser render verified

final result: passed
