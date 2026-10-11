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
- Nortlyn does not yet have an approved logo or symbol. Current assets must not bake in a
  temporary mark, payment-network logo, cardholder data, or other readable product text.

### Visual direction

- Minimalism with a restrained amount of futurism.
- Desired feeling and tone: calm, with little text and no overload of graphics or decorative
  detail.
- Accent `#356AE6`, deeper and more saturated than the initial pale proposal; final visual
  approval is pending. Hover tone `#417CFF`, lighter than the accent: the user confirmed the
  implemented value over the earlier documented `#2855C2`.
- Onest is self-hosted in `public/fonts/onest-variable.ttf`, with its OFL license alongside it.
- Hero card surfaces are solid white. The `backdrop-filter: blur(64px)` glass treatment was
  removed at the user's request: over the smooth gradient background it changed rendered card
  pixels by at most 13/255, so it cost GPU work without a visible result.
- Keep the existing Three.js background animation in its current engine.

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
- The compound utility slide stays compound on mobile: one white surface with the shared 1.5rem
  padding and two equal rows separated by a hairline `--accent-soft` divider. Nested pale-blue
  boxes inside a white wrapper were rejected as reading like a different component.
- The offer rail gets no pagination dots and no edge fade. The slide bleeding past the screen
  edge is the scroll affordance. The fade was removed after the user found its appearance and
  scrolling behavior unreliable.
- Cards are plain `div` offer tiles within a shared section. Do not link them to nonexistent
  sections.

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
- Hero contains five solid white cards: everyday card, cashback, savings, shared expenses, and
  phone-number transfers. Desktop: one large left card, two right cards, and two short cards
  below the large card.
- The desktop grid height follows its width, not its content: fixed rows of 226/106/106 px from
  48rem, then `aspect-ratio: 828 / 400` with 192fr/90fr/82fr rows from 64rem. At 1680 px the
  short cards are about 110 px tall and the right cards are 258 and 249 px. These proportions
  cannot comfortably carry a headline, description, CTA, and large asset together.
- The main card displays `hero-debit-card-scene-v4-metal-ribbon.webp`, decorative with empty
  alt text. From 48rem upward the image box extends past the card's right and lower edges and is
  clipped; at 1280 px only the ribbon tip reaches the right edge, and the clipped lower part is
  transparent margin. Below 48rem the asset sits in normal flow between the copy and the CTA.
- Below 48rem the main offer stays on a white card, and the supporting offers form a horizontal
  scroll-snap rail of three equal slides: cashback, savings, and the compound utility slide.
  The rail bleeds past both page gutters; `Hero.module.css` explains the padding and
  scroll-padding pairing. Slide width is `calc(100% - 3.5rem)`, leaving about 62 px of the next
  slide visible. The rail has `tabindex="0"` so keyboard users can scroll it.
- The main CTA «Оформить карту» is enabled and has no destination.
- Cards set `cursor: pointer` on hover although they are not interactive; the card hover
  treatment is an open decision.
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
- Explore a simple wordmark and a custom N built from continuous strokes or a directional cut.
  Avoid making a generic compass the identity's only distinguishing feature.
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
- Brand territory, wordmark / symbol, and whether a permanent tagline is useful.
- Final visual approval of Onest and the typography scale.
- Hover treatment for the opaque Hero cards: whether they gain a border or a shadow, and whether
  the non-functional `cursor: pointer` stays.
- Final Hero content, product lineup, fictional terms, and asset subjects.
- Whether the mobile hybrid should remain, or whether a later asset-complete version should
  remove the main white card and use a fully frameless campaign slider.
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
