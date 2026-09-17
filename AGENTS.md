# Project guidance

Read `PROJECT.md` before changing project content, branding, or UI conventions.
Keep important agreed decisions there for future tasks.

## Code readability

- Keep source lines at or below 100 characters.
- Use readable class names and keep JSX class composition short.
- Put JSX text on its own line between opening and closing tags.
- Put each component/page and its CSS Module in a shared folder.
  Follow the existing layout, such as `Button/Button.tsx` and `Button/Button.module.css`.
  Keep `src/assets/index.css` limited to reset, font loading, shared tokens, and global rules.
- Keep the Hero offer grid directly inside `components/HomePage/Hero.tsx`;
  its styles belong in `Hero.module.css`. Do not extract a separate BentoGrid component.
- Use a consistent typography and spacing scale; avoid unnecessary `clamp()` expressions.
  Preserve the existing 40rem, 48rem, and 64rem responsive breakpoints where applicable.
- Let headings wrap naturally. Use `br` only when the content requires an intentional line break.
- Choose HTML elements for their meaning. Offer tiles can use `div`; use `article`
  for independently meaningful content.
- Keep local styling in its component's CSS Module. Reuse clear CSS classes within that module;
  do not create opaque style-string constants in TSX solely to remove modest duplication.
  Extract reusable components when repeated structure or behavior warrants them.
- CSS Modules are the agreed styling architecture. Tailwind has been removed;
  do not reintroduce utility frameworks or global component selectors without agreement.
- Keep component states, pseudo-elements, and responsive rules in the same local module.
  Preserve keyboard focus, disabled states, hover capability checks, and reduced-motion support.
- Use named imports from `lucide-react` for standard interface icons, directly in JSX.
  Current action icons use 20px size, the default 2-unit stroke, and inherited text color.
  Keep decorative icons hidden from assistive technologies; label icon-only actions themselves.

## Scope and communication

- Current content work is limited to Hero. Do not fill other sections without a request.
- Do not generate assets until requested.
- Be direct and honest about tradeoffs. Challenge flawed assumptions with reasons and alternatives.
- Distinguish confirmed decisions from proposals, and ask about consequential missing information.
