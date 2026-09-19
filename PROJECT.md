# Nortlyn Bank — shared project context

Updated: 2026-09-18. This file is the shared context requested by the user. Keep confirmed decisions separate from proposals; update it as discussions continue.

## Confirmed decisions

- Brand name: **Nortlyn Bank**. “Nortyn” in the initial brief was a typo.
- A conceptual neobank with standard banking products. Product terms may be invented together for the concept; they are not real banking offers.
- Website language: Russian. Product currency: Russian rubles.
- Visual direction: minimalism with a restrained amount of futurism.
- Desired feeling and tone: calm, with little text and no overload of graphics or decorative detail (confirmed by the user after the initial proposals).
- Accent color should be deeper and more saturated blue than the initial pale proposal. Current implementation uses `#356AE6`; final visual approval is pending.
- Onest is now self-hosted in `public/fonts/onest-variable.ttf`, with its OFL license alongside it. It replaces the system-font placeholder.
- Hero cards act as a curated showcase of offers and news, with visual assets to be added later.
- User references: [Alfa Bank](https://alfabank.ru/), [Sber](https://www.sberbank.ru/), [VTB](https://www.vtb.ru/), [Monobank](https://monobank.ua/en/). These are references for banking content and asset direction, not templates to copy.
- Implementation scope: fill the **Hero cards only**, with updated typography and a deeper blue accent. The user explicitly clarified that other sections must remain empty. Do not add product sections, app marketing, FAQ, footer, or navigation as part of this task.
- Do not generate assets yet. Preserve space for future assets without adding substitute illustrations.
- Hero card blocks are slightly larger at the user's request, with text and typography unchanged.
- Styling architecture: CSS Modules instead of Tailwind, explicitly approved by the user. Each styled component/page and its `.module.css` share a folder, following the user's organization; `src/assets/index.css` holds only global reset, fonts, shared tokens, and global rules. Tailwind dependencies and the Vite plugin have been removed.
- Hero card surfaces are solid white. The `backdrop-filter: blur(64px)` glass treatment was
  removed at the user's request. Measured before removal: over the smooth gradient background
  the blur changed the rendered card pixels by at most 13/255, so it cost GPU work without a
  visible result.
- Buttons use a reusable `Button` component with `primary`, `secondary`, and `text` variants. Primary uses the brand accent; secondary uses a pale blue surface with accent text and a pill shape inspired by the supplied VTB button screenshot; text uses accent-colored text with a line revealing from left to right on hover or keyboard focus.

## Current implementation — evidence, not approval

- React + TypeScript + Vite SPA, CSS Modules, Three.js ambient background.
- `src/components/HomePage/Hero.tsx` places the card grid over an animated blue/periwinkle background. The grid markup is directly inside Hero, with all local styles in `Hero.module.css`; the separate BentoGrid component has been removed by user request.
- Hero contains five populated solid white cards: everyday card, cashback, savings, shared expenses, and phone-number transfers. Desktop arrangement: one large left card, two right cards, and two short cards below the large card; narrow layouts reflow vertically.
- The grid currently uses a fixed aspect ratio and proportional rows. At the maximum grid width, the bottom cards are approximately 100 px tall. They cannot comfortably carry a normal headline, description, CTA, and large asset together.
- `src/assets/index.css` uses Onest and a deeper blue accent. Hero background colors are `#224F91`, `#456BC5`, and `#7C9BDF`.
- The lower home-page section is empty. Navigation, product catalog, and information architecture are not established yet.
- Hero action labels are present, but buttons are disabled pending actual product destinations/flows. Cards use plain `div` containers rather than `article`; they are offer tiles within a shared section. Do not link them to nonexistent sections.

## Research notes

- Monobank was inspected in the browser: the Hero uses a large phone/app render on a blue-purple background, a short headline, and a prominent CTA. Subsequent sections use oversized phone crops and light rounded product surfaces. Relevant takeaway: a recognizable product object, restrained copy, and generous separation between text and image.
- Live Alfa, Sber, and VTB homepages could not be opened because of fetch/certificate errors. The user subsequently supplied full-page screenshots, which were inspected: `src/refs/alfa.png`, `src/refs/sber.png`, `src/refs/vtb.png`. The observations below describe these supplied screenshots, not a separately verified live state.
- Alfa screenshot: five-card Hero with a large primary offer, two right cards, and two short lower cards, closely matching the existing Nortlyn grid. Assets mix cards, coins, arrows, gifts, glass-like and metallic surfaces, vivid colors, and photography. The short lower cards show that a short title plus a compact 3D object can work without a description and separate prominent CTA. Product tiles use dense, glossy object groups.
- Sber screenshot: spacious pale green Hero and page sections; rounded 3D forms, financial symbols, metallic accents, cards, and small object groups. The restrained page spacing is a useful reference, while the busier individual object groups should be simplified for Nortlyn.
- VTB screenshot: photographic campaign Hero, with smaller, relatively simple 3D product illustrations below: cards, coin/container, banknote bundle, house. These compact product illustrations are the strongest of the three references for Nortlyn's proposed asset complexity. The screenshot also includes photographic offer tiles; photography is not selected for Nortlyn.
- Revised interpretation: use compact, stylized 3D product illustrations as the main proposed asset language. The initial phone-heavy interpretation based on Monobank is too narrow. A phone can remain an option for app-specific content, but it need not appear throughout the Hero.
- [Onest](https://onest.md/en) supports Latin and Cyrillic and is available under SIL OFL. [Google Fonts metadata](https://github.com/google/fonts/blob/main/ofl/onest/METADATA.pb) lists a variable weight axis from 100 to 900.
- [Golos Text](https://github.com/googlefonts/golos-text/blob/main/README.md) is an alternative designed for screen reading, available under SIL OFL.

## Proposals for discussion — not selected

### Brand

- Recommended territory: calm control of everyday finances, with precision and a subtle sense of technological progress.
- Use northern light / horizon / direction as visual associations inspired by the name. This is a creative interpretation, not a claim about the name's origin.
- Explore a simple wordmark and a custom N built from continuous strokes or a directional cut. Avoid making a generic compass the identity's only distinguishing feature.
- Voice proposal: clear, concise, respectful Russian using “вы”; practical benefits and understandable conditions rather than futuristic slogans.
- Products under consideration: debit card, cashback, savings account, deposits, transfers, installment payments / credit. Final lineup and terms remain open.

### Typography and color

- Leading font candidate: Onest for headings and interface/body copy, with weight and size creating hierarchy. Golos Text is the alternative for a more sober tone.
- Suggested starting weights: 400 body, 500 labels/actions, 600 headings. Validate Cyrillic, numerals, currency signs, and actual Hero copy before committing.
- The initial pale accent `#86AEF5` was rejected as insufficiently saturated. Current accent: `#356AE6`; hover tone: `#2855C2`. Pale blue, off-white, and deep ink remain supporting colors.
- Soft blue can carry imagery and surfaces; text and primary actions need sufficient contrast. Transparent Hero surfaces must be checked over multiple background animation states.

### Hero content mapped to the existing five cards

| Card | Draft copy | Draft action | Asset direction |
| --- | --- | --- | --- |
| Large left | «Карта на каждый день» / «Покупки, переводы и кешбэк — в одном приложении.» | «Оформить карту» | Branded debit card render; reserve a clear text area. |
| Upper right | «Кешбэк на ваши планы» / «Выбирайте категории каждый месяц.» | «Выбрать категории» | Compact return-arrow / coin illustration, rather than a collection of shopping categories. |
| Lower right | «Копите на своё» / «Накопительный счёт для больших и маленьких целей.» | «Открыть счёт» | Simple savings container with one or two coins. |
| Short lower left | «Новое в приложении» / «Делите расходы с друзьями» | Arrow / details | Small 3D illustration or icon, paired with very short copy; no large scene. |
| Short lower middle | «Переводы по номеру телефона» | Arrow / details | Compact directional illustration; a small 3D object is viable. |

- All copy above is proposed concept content, not approved product functionality or terms.
- An alternative large-card approach is a bank/app introduction: «Повседневные финансы. Под вашим контролем.» with a phone render. Choose the main acquisition action before selecting between card-led and app-led messaging.
- Recommended hierarchy: one main acquisition offer, two supporting product/benefit cards, one news item, one compact useful entry point. Do not make all five cards compete with equally prominent buttons.
- If every card requires a substantial 3D asset and supporting copy, revisit the grid proportions rather than shrinking the type to fit.
- Based on Alfa's short Hero cards, the lower Nortlyn cards can retain compact 3D assets if the copy is reduced to a title and the card itself provides the action. Large scenes with description and separate buttons still require more height.

### Asset system

- Recommended primary language after reviewing the supplied screenshots: stylized 3D product illustrations with recognizable silhouettes, simplified geometry, slight perspective, and restrained object counts. This refinement is a proposal, not yet a user-approved asset specification.
- Recognizable product objects: branded bank card, savings container, coin, return/transfer arrow. Use a phone specifically when the message is about the app.
- Shared lighting, camera treatment, material palette, and shadow softness across assets.
- Revised material recommendation: satin blue/white solids as the base, small silver metallic accents, and selective blue-tinted translucent details. Mild gloss is useful for readable volume; avoid mirror chrome, rainbow/iridescent finishes, and decorative sparkles as defaults.
- Use one main object, optionally with one or two supporting details, rather than Alfa-like dense groups. Preserve clear negative space for text. Small cards can use one compact 3D illustration.
- Do not add a separate colorful square backing plate to every asset: Nortlyn's existing cards already supply the framing, and the animated background supplies atmosphere.
- For calmness, rely on consistent light and a limited palette rather than making all objects flat or indistinct. Keep enough tonal separation for the blue asset silhouettes to read over the blue background.
- No additional looping asset animations are proposed. The existing ambient motion already provides the restrained futuristic element.
- Future generation must use original Nortlyn branding and avoid copied competitor marks, invented payment partnerships, or unsupported bank claims.

## Open decisions

- Primary audience and the specific value proposition that makes Nortlyn memorable.
- Brand territory, wordmark / symbol, and whether a permanent tagline is useful.
- Final visual approval of Onest and the typography scale; Onest is the implemented choice.
- Hover treatment for the now-opaque Hero cards, and whether they gain a border or a shadow.
- Main Hero action: debit-card application versus starting with the banking app.
- Final Hero content, product lineup, fictional terms, and asset subjects.
- Whether to preserve current grid proportions or enlarge the short cards.

## Buttons and animation

- Cards no longer change color on hover. The old hover raised the white alpha from 0.85 to
  0.95, which has no meaning on a solid white surface. The hover media query now only keeps
  `cursor: pointer`. A replacement hover treatment is an open decision.
- Interface icons use `lucide-react`, selected to complement Onest and the restrained visual style. Hero imports `ArrowRight` directly; the custom `ArrowIcon` wrapper has been removed. Current action icons use 20px size, Lucide's default 2-unit stroke, and `currentColor`. Import only individual icons; decorative icons remain `aria-hidden`. [Lucide React documentation](https://lucide.dev/guide/react).
- `src/components/Button/Button.tsx` accepts native button props (including refs, handlers, disabled state, and type), a typed `variant`, and an optional decorative `icon`. Default variant: `primary`; default type: `button`.
- Hero, card, responsive layout, Button, ambient background, phone frame, and both pages use local CSS Modules. `src/assets/index.css` contains a small global reset replacing Tailwind Preflight, font loading, shared color tokens, and global rules. No Tailwind utilities or dependencies remain.
- Button variants, states, and the text underline pseudo-element are defined in `src/components/Button/Button.module.css`. `Button.tsx` selects a local class by its typed variant. Color tokens remain in `src/assets/index.css`: `--accent`, `--accent-hover`, `--accent-soft`, and `--accent-soft-hover`.
- Hero demonstrates primary for the card offer, text for cashback, and secondary for savings. Actions remain disabled until destinations/flows exist; disabled buttons do not animate on hover.
- Text underline and color hovers use CSS transitions (200 ms, ease-out), with keyboard focus support and `prefers-reduced-motion` handling. Hover effects respect the browser's hover capability and disabled state.
- Keep the existing Three.js background animation in its current engine.

## Working agreement

- Keep source lines at or below 100 characters, use short readable class composition, and render element text on its own line between opening and closing JSX tags.
- The user approved the readability refactor. These conventions are also recorded in root `AGENTS.md` for future tasks.
- Keep each component/page and its CSS Module together in a folder, matching the current user-organized structure. Keep the offer grid inside Hero rather than a separate BentoGrid component. Keep component styling in CSS Modules, using clear local class names and direct `styles.name` references in JSX. Reuse CSS classes within the module and extract reusable components when repeated structure or behavior warrants them. Avoid opaque TSX style-string constants and do not reintroduce Tailwind without agreement.
- Use a consistent typography, spacing, and radius scale rather than unnecessary `clamp()` typography. Preserve the existing responsive breakpoints (40rem, 48rem, 64rem) and meaningful layout constraints such as the grid proportions and viewport-based section height.
- Let headings wrap naturally through available width instead of inserting presentational `br` tags. `br` is valid HTML for intentional line breaks, but is unnecessary in these Hero headings.
- Prefer plain `div` containers for offer tiles. Use `article` only for content intended to stand independently; do not choose semantic elements for visual styling.
- Discuss before changing unresolved branding or UI choices.
- Record important decisions here as they become agreed; never silently promote a proposal to a confirmed decision.
- Keep evidence and uncertainty explicit. Do not fabricate tariffs, licensing, customer counts, testimonials, or competitor observations.

## CSS Modules migration validation

- TypeScript and production build pass after Tailwind removal.
- Compared component DOM bounds and computed layout/typography before and after migration at
  390, 768, and 1280 px; bounds and typography match. The existing `/app` phone frame also
  retains its dimensions. Border color serialization and equivalent grid/radius notation differ.
- No Hero content, product destinations, or assets were added during this migration.
