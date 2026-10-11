# Nortlyn Bank — shared project context

Updated: 2026-10-11. This file holds the shared design context requested by the user. Keep
confirmed decisions separate from proposals and update it as discussions continue.
Code conventions live in `AGENTS.md`; implementation history lives in git.

## Confirmed decisions

### Project and scope

- Purpose: a **portfolio project**. Nortlyn is a conceptual neobank, not a real product.
- Brand name: **Nortlyn Bank**. “Nortyn” in the initial brief was a typo.
- Standard banking products. Product terms may be invented together for the concept; they are
  not real banking offers.
- Website language: Russian. Product currency: Russian rubles.
- Implementation scope: fill the **Hero cards only**. The user explicitly clarified that other
  sections must remain empty. Do not add product sections, app marketing, FAQ, footer, or
  navigation as part of this task.
- The `/app` route and the `PhoneFrame` component were removed. The app mockup is designed in
  Figma, not in this codebase.
- Approved logo (2026-10-11): **Contour**, selected by the user from round 2. The symbol is
  two offset open semicircular bands; use the custom lowercase `nortlyn` wordmark shown
  with it. Final files and usage guidance live in `design/logo/contour-final/`. The primary
  version is monochrome; blue exports use the existing project accent. Color exports do not
  constitute a separate new approval of the overall palette. On the website the logo is used
  only as the favicon so far: the blue small-size symbol (`public/favicon.svg`, `favicon.ico`)
  and the 180 px app icon as `apple-touch-icon.png`.
  Product assets may use this approved identity when requested; do not add temporary marks,
  payment-network logos, invented cardholder data, or other unapproved readable product text.
- Logo exploration, round 1 feedback (2026-10-11): **Contour** is the user's favorite;
  **Cut** also continues, but its geometry feels uneven. **Ribbon** was rejected as too
  simple and the weakest option. Round 2 retains Contour and Cut and adds a new direction.
  Contour was subsequently selected after round 2. Explorations remain in `design/logo/`.

### Visual direction

- Minimalism with a restrained amount of futurism.
- Desired feeling and tone: calm, with little text and no overload of graphics or decorative
  detail.
- Accent `#356AE6`, deeper and more saturated than the initial pale proposal; final visual
  approval is pending. Hover tone `#417CFF`, lighter than the accent: the user confirmed the
  implemented value over the earlier documented `#2855C2`.
- Onest is self-hosted as `public/fonts/onest-variable.woff2` (variable weight, converted from
  the TTF without subsetting), with its OFL license alongside it.
- Hero card surfaces are frosted: 72% white with `backdrop-filter: blur(24px)`, so the ambient
  background shows through. This reverses the earlier solid-white decision at the user's request
  (2026-10-11). An earlier opaque-white-over-blur version was dropped because the blur was
  invisible behind an opaque surface.
- Keep the existing Three.js background animation in its current engine.
- The background has an idle state (2026-10-11). The startup impulse plays as before and focus
  leaves the frame with its crest; shallow, soft-focus swells then keep rolling out from the
  impulse origin as a slow breathing motion. A focus rack that brought a sharp crest band back
  into frame was tried and rejected by the user. Idle renders at about 30 fps and stops while the Hero is offscreen or
  the tab is hidden. Reduced motion still shows one static frame.
- The bento grid stays. A frameless main offer on the background (direction “B”) was tried on
  2026-10-11 and rejected by the user after seeing it.

### Hero content and layout

- Hero cards act as a curated showcase of offers and news.
- The main Hero acquisition offer is a debit card, not an app-first message.
- Hero card blocks are slightly larger at the user's request, with text and typography unchanged.
- Preserve the compact proportions of the two short Hero cards. Their assets must be composed
  specifically for very small display sizes rather than scaled down from larger scenes.
- The cashback and savings slides carry a short description **below 48rem only**, so the mobile
  slides are not mostly empty white space. The desktop cards stay heading-only; the descriptions
  stay in the markup and are hidden with `display: none` from 48rem upward.
- Mobile slides have equal heights and no fixed height. From about 430 px the cashback slide has
  24 px of slack because its description fits one line; the user chose to keep it rather than
  shorten the copy. Do not reintroduce per-slide heights.
- The supporting slides get no action buttons, and the two compact actions get no arrow icon.
  The user explicitly rejected both after seeing them; do not reintroduce them without a request.
  The only action in Hero is the main CTA, using the `primary` Button variant.
- The compound utility slide stays compound on mobile: one frosted surface with the shared 1.5rem
  padding and two equal rows separated by a hairline `--accent-soft` divider. Nested pale-blue
  boxes inside a white wrapper were rejected as reading like a different component.
- The offer rail gets no pagination dots and no edge fade. The slide bleeding past the screen
  edge is the scroll affordance. The fade was removed after the user found its appearance and
  scrolling behavior unreliable.
- Cards are plain `div` offer tiles within a shared section. Do not link them to nonexistent
  sections.
- Cards will become clickable later, so they keep `cursor: pointer` on hover now.
- The desktop grid has four equal rows: the main card spans rows 1–3, the short cards sit in
  row 4, and each right card spans two rows, so the right cards are always equal in height.

### Assets

- Asset language: recognizable, product-led 3D objects with simplified believable geometry.
  Abstract forms may appear only as restrained supporting decoration.
- The selected main-Hero direction is the Orbit scene with a matte graphite-black debit card,
  a thin asymmetric frosted-glass plate, and a flat satin-aluminum ribbon. The current render is
  a working visual test, not a final approved asset.
- The black card is a conscious choice. Its association with T-Bank Black was raised and
  accepted by the user.
- Rejected: the thick, glossy C-shaped glass arc (dated, reminiscent of Windows Aero, with
  inconsistent perspective) and the tubular metal orbit (a complete ring felt generic and
  retrofuturistic). Glass stays matte, low-contrast, and geometrically aligned with the card;
  metal uses restrained flattened profiles. The Portal and Balance renders remain exploratory.
- Reference screenshots and source renders live in the untracked `design/` folder
  (`design/refs/`, `design/hero-card/`). `src/assets/images` holds only optimized files the page
  uses.

### Components and styling

- Styling architecture: CSS Modules, explicitly approved by the user. Tailwind has been removed.
- `Button` has `primary`, `secondary`, and `text` variants. Primary uses the brand accent;
  secondary uses a pale blue surface with accent text and a pill shape inspired by the supplied
  VTB button screenshot; text uses accent-colored text with a line revealing from left to right
  on hover or keyboard focus. Transitions are 200 ms ease-out, respect hover capability, the
  disabled state, and `prefers-reduced-motion`.
- Interface icons use `lucide-react`. Hero currently imports no icons.

## Current implementation — evidence, not approval

- React + TypeScript + Vite single-page app with one page, CSS Modules, and a Three.js ambient
  background. Hero background colors: shadow `#5288D3`, lift `#C1B7E4`, glow `#5D71D1`; the
  same values are the defaults in `src/lib/types.ts`.
- Hero contains five frosted cards: everyday card, cashback, savings, shared expenses, and
  phone-number transfers. Desktop: one large left card, two right cards, and two short cards
  below the large card.
- The desktop grid height follows its width, not its content: four 106 px rows from 48rem,
  then `aspect-ratio: 828 / 400` with four equal `1fr` rows from 64rem. At 1680 px the main
  card is 390 px tall, the right cards 254 px each, and the short cards 118 px. These
  proportions cannot comfortably carry a headline, description, CTA, and large asset together.
- The main card displays `hero-debit-card-scene-v4-metal-ribbon.webp`, decorative with empty
  alt text. From 48rem upward the image box extends past the card's right and lower edges and is
  clipped; at 1280 px only the ribbon tip reaches the right edge, and the clipped lower part is
  transparent margin. Below 48rem the asset sits in normal flow between the copy and the CTA.
- Below 48rem the main offer stays on a frosted card, and the supporting offers form a horizontal
  scroll-snap rail of three equal slides: cashback, savings, and the compound utility slide.
  The rail bleeds past both page gutters; `Hero.module.css` explains the padding and
  scroll-padding pairing. Slide width is `calc(100% - 3.5rem)`, leaving about 62 px of the next
  slide visible. The rail has `tabindex="0"` so keyboard users can scroll it.
- The main CTA «Оформить карту» is enabled and has no destination.
- The lower home-page section is empty. Navigation, product catalog, and information
  architecture are not established.

## Research notes

- Monobank was inspected in the browser: the Hero uses a large phone/app render on a blue-purple
  background, a short headline, and a prominent CTA. Subsequent sections use oversized phone
  crops and light rounded product surfaces. Relevant takeaway: a recognizable product object,
  restrained copy, and generous separation between text and image.
- Live Alfa, Sber, and VTB homepages could not be opened because of fetch/certificate errors.
  The user supplied full-page screenshots, now in `design/refs/` (`alfa.png`, `sber.png`,
  `vtb.png`). The observations below describe these screenshots, not a separately verified live
  state.
- Alfa screenshot: five-card Hero with a large primary offer, two right cards, and two short
  lower cards, closely matching the existing Nortlyn grid. Assets mix cards, coins, arrows,
  gifts, glass-like and metallic surfaces, vivid colors, and photography. The short lower cards
  show that a short title plus a compact 3D object can work without a description and separate
  prominent CTA. Product tiles use dense, glossy object groups.
- Sber screenshot: spacious pale green Hero and page sections; rounded 3D forms, financial
  symbols, metallic accents, cards, and small object groups. The restrained page spacing is a
  useful reference, while the busier individual object groups should be simplified for Nortlyn.
- VTB screenshot: photographic campaign Hero, with smaller, relatively simple 3D product
  illustrations below: cards, coin/container, banknote bundle, house. These compact product
  illustrations are the strongest of the three references for Nortlyn's proposed asset
  complexity. The screenshot also includes photographic offer tiles; photography is not
  selected for Nortlyn.
- Revised interpretation: use compact, stylized 3D product illustrations as the main asset
  language. The initial phone-heavy interpretation based on Monobank is too narrow. A phone can
  remain an option for app-specific content, but it need not appear throughout the Hero.
- [Onest](https://onest.md/en) supports Latin and Cyrillic and is available under SIL OFL.
  [Google Fonts metadata](https://github.com/google/fonts/blob/main/ofl/onest/METADATA.pb) lists
  a variable weight axis from 100 to 900.
- [Golos Text](https://github.com/googlefonts/golos-text/blob/main/README.md) is an alternative
  designed for screen reading, available under SIL OFL.

## Proposals for discussion — not selected

### Brand

- Recommended territory: calm control of everyday finances, with precision and a subtle sense
  of technological progress.
- Use northern light / horizon / direction as visual associations inspired by the name. This is
  a creative interpretation, not a claim about the name's origin.
- The earlier wordmark/custom-N exploration concluded with selection of Contour. Do not
  reopen the rejected Ribbon direction without a request.
- Voice proposal: clear, concise, respectful Russian using “вы”; practical benefits and
  understandable conditions rather than futuristic slogans.
- Products under consideration: debit card, cashback, savings account, deposits, transfers,
  installment payments / credit. Final lineup and terms remain open.

### Typography and color

- Onest for headings and interface/body copy, with weight and size creating hierarchy. Golos
  Text is the alternative for a more sober tone.
- Suggested starting weights: 400 body, 500 labels/actions, 600 headings. Validate Cyrillic,
  numerals, currency signs, and actual Hero copy before committing.
- The initial pale accent `#86AEF5` was rejected as insufficiently saturated. Pale blue,
  off-white, and deep ink remain supporting colors.
- Soft blue can carry imagery and surfaces; text and primary actions need sufficient contrast.

### Hero content mapped to the existing five cards

| Card | Draft copy | Draft action | Asset direction |
| --- | --- | --- | --- |
| Large left | «Карта на каждый день» / «Покупки, переводы и кешбэк — в одном приложении.» | «Оформить карту» | Branded debit card render; reserve a clear text area. |
| Upper right | «Кешбэк на ваши планы» / «Выбирайте категории каждый месяц.» | «Выбрать категории» | Compact return-arrow / coin illustration, rather than a collection of shopping categories. |
| Lower right | «Копите на своё» / «Накопительный счёт для больших и маленьких целей.» | «Открыть счёт» | Simple savings container with one or two coins. |
| Short lower left | «Новое в приложении» / «Делите расходы с друзьями» | Arrow / details | Small 3D illustration or icon, paired with very short copy; no large scene. |
| Short lower middle | «Переводы по номеру телефона» | Arrow / details | Compact directional illustration; a small 3D object is viable. |

- All copy above is proposed concept content, not approved product functionality or terms.
  The implemented copy differs in places (for example «Много кешбэка»), and the actions on the
  supporting cards were rejected (see confirmed decisions).
- Recommended hierarchy: one main acquisition offer, two supporting product/benefit cards, one
  news item, one compact useful entry point. Do not make all five cards compete with equally
  prominent buttons.
- If every card requires a substantial 3D asset and supporting copy, revisit the grid
  proportions rather than shrinking the type to fit.
- Based on Alfa's short Hero cards, the lower Nortlyn cards can retain compact 3D assets if the
  copy is reduced to a title and the card itself provides the action. Large scenes with
  description and separate buttons still require more height.

### Asset system — direction confirmed, exact execution still being refined

- Stylized 3D product illustrations with recognizable silhouettes, simplified geometry, slight
  perspective, and restrained object counts.
- Recognizable product objects: branded bank card, savings container, coin, return/transfer
  arrow. Use a phone specifically when the message is about the app.
- Shared lighting, camera treatment, material palette, and shadow softness across assets.
- Revised material recommendation: satin blue/white solids as the base, small silver metallic
  accents, and selective blue-tinted translucent details. Mild gloss is useful for readable
  volume; avoid mirror chrome, rainbow/iridescent finishes, and decorative sparkles as defaults.
- One main object, optionally with one or two supporting details, rather than Alfa-like dense
  groups. Preserve clear negative space for text. Small cards can use one compact 3D
  illustration.
- Treat desktop and mobile as related compositions, not identical crops. The cashback and
  savings assets need standard mobile-slide compositions; the two compact action assets stay
  small and share the compound utility slide on mobile.
- Do not add a separate colorful square backing plate to every asset: the cards already supply
  the framing, and the animated background supplies atmosphere.
- For calmness, rely on consistent light and a limited palette rather than making all objects
  flat or indistinct. Keep enough tonal separation for the blue asset silhouettes to read over
  the blue background.
- No additional looping asset animations are proposed. The ambient background already provides
  the restrained futuristic element.
- Future generation must use original Nortlyn branding and avoid copied competitor marks,
  invented payment partnerships, or unsupported bank claims.

## Open decisions

- Primary audience and the specific value proposition that makes Nortlyn memorable.
- Brand territory and whether a permanent tagline is useful. The Contour logo is selected.
- Final visual approval of Onest and the typography scale.
- Hover treatment for the opaque Hero cards: whether they gain a border or a shadow.
- Final Hero content, product lineup, fictional terms, and asset subjects.
- Whether the main CTA should stay enabled without a destination, and whether the supporting
  slides should gain actions once real destinations exist.

## Working agreement

- Code conventions live in `AGENTS.md`; do not duplicate them here.
- Preserve meaningful layout constraints such as the grid proportions and viewport-based section
  height.
- Discuss before changing unresolved branding or UI choices.
- Record important decisions here as they become agreed; never silently promote a proposal to a
  confirmed decision.
- Keep evidence and uncertainty explicit. Do not fabricate tariffs, licensing, customer counts,
  testimonials, or competitor observations.
