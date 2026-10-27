# Design Audit Report — chintan992.dev

**Date:** Oct 27, 2026
**Scope:** Full de-slop review (anti-ui-slop audit playbook) of all components, styling, and data.
**Verdict:** The bones are good — real photography/footage, live GitHub data, sensible three-mode IA, solid font stack (Bricolage Grotesque + Instrument Serif + DM Sans). The problem is a thick layer of generic "AI-generated portfolio" chrome drowning out the actual product.

---

## Finding 1 (High impact): Template furniture is the first thing anyone sees

Every recognizable AI-portfolio trope is present:

| Evidence | Location |
| --- | --- |
| Particle-field-with-connecting-lines canvas — the most-copied generated-hero effect | `src/components/CursorCanvas.tsx` |
| Fake CLI terminal (traffic-light dots, fake box banner, `$ cr profile --summary` teaser) | `src/components/Terminal.tsx`, bento Card 5 in `ExecutiveBento.tsx`, nav CLI launcher |
| Unverifiable LLM-marketing metrics ("User Engagement Surge +28%", "Pilot Performance Lift 15%") | Metric ribbon, `ExecutiveBento.tsx` |
| Micro-chrome monotony: `text-xs font-mono uppercase tracking-wider` kickers, "ENGINEERING TELEMETRY", "v3.0.0", "PWA Platform", "Live" pills, pulsing emerald "Available" dots, `Sparkles` as the nav icon | `NavigationHeader.tsx`, `App.tsx`, all section headers |

**Smallest concrete correction:** delete `CursorCanvas` and the Terminal entirely; replace the metrics ribbon with 2–3 plain, true, specific facts. Most supporting glass chrome collapses once these are gone.

## Finding 2 (Medium impact): One repeated "section header recipe" flattens the page

Six+ sections use the identical formula: mono kicker + Lucide icon → `font-extrabold` heading → `serif-italic-accent` phrase ("Trajectory & *Engineering Impact*", "Systems Architecture & *Open Source*", "Notes from *out there*", ...). Identical `border-t border-white/[0.08]` card footers, identical pill badges, identical 3-col glass services grid.

Real duplication: `GitHubGrid`, `CareerTimeline`, and the devServices cards each render twice (hub + developer mode).

**Smallest concrete correction:** vary composition per section — editorial treatment for photography sections, plain list/table register for engineering sections. Kill the italic-serif crutch (keep it for at most one moment on the page); de-duplicate the twice-rendered sections.

## Finding 3 (Medium impact): The genuinely distinctive asset — the photography — is buried and encrusted

- Hero is text + metric tiles instead of imagery; real frames (CHR*.jpg, DJI/train/tower clips) live in `/content` but don't lead the page.
- Gallery media wrapped in borders, gradients, `max-h-56` video boxes with "4K 24fps · Cinematic Grade" badges.
- Fallback caption is literally a placeholder: `frame.caption || 'A moment, kept.'` (`MasonryGallery.tsx`).

**Smallest concrete correction:** full-bleed editorial hero built from real frames; gallery imagery rendered undecorated (no borders/cards/scale-on-hover), captions in the Lightbox only; rewrite placeholder captions with real ones.

---

## Smaller fixes spotted

1. **Dead code:** `src/components/SocialDock.tsx`, `src/components/PortalCards.tsx`, `src/components/ThemeSwitcher.tsx` are never imported — delete.
2. **Contrast:** `text-slate-500` at ~10px mono (card micro-labels) is ~3.5:1 on `#08090a` — below the 4.5:1 floor for small text. Use `slate-400` minimum, `slate-300` preferred at those sizes.
3. **Accent sprawl:** emerald + amber + sky + white glows coexist on one page; pick one accent per mode (photography = warm neutral, engineering = near-monochrome).
4. **Weight monotony:** `font-extrabold`/`font-black` on nearly every heading — Bricolage reads better at 500–600 with one bold moment.

---

## Implementation plan (agreed scope: full de-slop pass)

### Phase 1 — Remove template furniture
- Delete `CursorCanvas.tsx`, `Terminal.tsx`, `SocialDock.tsx`, `PortalCards.tsx`, `ThemeSwitcher.tsx`.
- `App.tsx`: remove `showTerminal` state, terminal drawer in `AnimatePresence`, related imports/props.
- `NavigationHeader.tsx`: drop CLI button and `Sparkles` icon; keep nav to real content (All / Code / Film, CV, socials, Contact).
- `ExecutiveBento.tsx`: delete CLI Console card + glow blob; replace metric ribbon with true facts (only if verifiable, e.g. "Led 7-person cross-functional team"). If the bento reduces to 2 real elements, it stops being a bento.
- Purge `terminalCommands` and related data from `portfolio-data.ts`.

### Phase 2 — Calm the surface language
- Retire `titanium-card` glass tiles as the default container; separate sections with whitespace + occasional hairline rules.
- Heading weight discipline: Bricolage at 500–600 mostly, one bold moment; no `font-black`/`extrabold` everywhere.
- Kill the accent salad and pulsing dots; one accent max, mode-dependent.
- Contrast fix per Finding 3.

### Phase 3 — Let the content set the layouts
- **Hub hero:** full-bleed editorial hero from real frames (CHR*.jpg stills, optionally one autoplaying film) + name + one-line dual identity + true facts line. No metric tiles, no pills.
- **Photography sections:** borderless full-bleed masonry; no scale-on-hover chrome; captions in Lightbox only; real captions replacing 'A moment, kept.'
- **Engineering sections:** `GitHubGrid` and `CareerTimeline` live once (developer mode); hub links to them. Services as a plain, dense list (existing details copy is already good) instead of icon tiles.
- **Headers:** distinct compositions per section, left-aligned; serif italic reserved for one moment.

### Phase 4 — Verification
- `npm run lint` + build; scroll pass at 375/768/1440; keyboard/focus check on nav and gallery; `prefers-reduced-motion` honored (audit video autoplay usage); no clipped or inert interactions.

**Expected result:** the site keeps its three-mode IA and real data integrations, but reads as *Chintan's* portfolio — photography-first, engineering-restrained — instead of a generated dashboard sandbox.

---

# Re-audit (Round 2, Oct 27 2026) — post-implementation

**Verified:** `npm run lint` clean, `npm run build` clean (tsc + worker typecheck + vite, 2366 modules).

## What landed correctly (verified in code)

- `CursorCanvas.tsx`, `Terminal.tsx`, `SocialDock.tsx`, `PortalCards.tsx`, `ThemeSwitcher.tsx` deleted; no dangling references.
- Fake metric ribbon replaced with grounded facts (role, team size, stack, location) in `ExecutiveBento.tsx`.
- CLI launcher gone from `NavigationHeader.tsx`; nav icon `Sparkles` → `Layers`.
- Glass tiles swapped for flat `bg-white/[0.02]` + hairline surfaces across all sections; hub services now a plain divided list (`App.tsx`).
- Heading weights calmed to `font-medium`; `serif-italic-accent` reduced to exactly one use (hero line).
- Accent salad reduced: amber/sky gone; remaining emerald limited to 2 status dots + wizard success — consistent.
- Gallery imagery undecorated: no borders/gradient overlays/scale-on-hover, real alt fallback text, `focus-visible` ring added (`MasonryGallery.tsx`).
- Duplication removed: `GitHubGrid` and `CareerTimeline` render only in developer mode.
- Contrast: `slate-500` now only on decorative separators/icons, not body-adjacent text.

## Remaining findings (ordered by impact)

### R1 (High): `InquiryWizard.tsx` is the last big slop pocket

The component was visually de-glassed but the voice and micro-decor are untouched:

- **LLM-consultant vocabulary:** "Transmit Inquiry" / "Inquiry Transmitted", "Select Engagement Domain", "Engagement Domain", "Estimated Investment Scale" (= budget), "Delivery Window" (= timeline). Replace with plain words: "Send message", "What do you need?", "Budget", "Timeline".
- **Copy bug:** label reads "**Brief Brief** or Project Overview" — duplicated word (line ~353).
- **Canonical generated placeholder:** name field placeholder "Alex Vance" / "alex@studio.com" — the single most-used AI placeholder name.
- **Mixed iconography:** emoji chips (💻 ⚡ 🎬 📷 ✨) in service options alongside lucide icons; stray `Sparkles` icon in the summary strip.
- **A11y (minor):** service/budget/timeline option groups behave as radios but have no `role="radiogroup"`/`aria-checked`; step navigation is click-guarded but state isn't announced.

### R2 (High): Six videos autoplay at once in the gallery

`MasonryGallery.tsx` renders each of the 6 `VIDEO` frames with `autoPlay loop muted` — six heavyweight clips streaming and decoding simultaneously on `/visual` and in the hub, ignoring `prefers-reduced-motion`. Fix: play on hover or when in viewport (`IntersectionObserver`), poster + "PLAY" badge otherwise; honor reduced-motion by defaulting to paused.

### R3 (Medium): The glow-shadow tell survives on ~12 active/primary buttons

`shadow-[0_0_15/20/25px_rgba(255,255,255,0.2–0.3)]` still fires on the nav active pill, filter tags, wizard step dots, and every CTA. This soft outer white glow is the strongest visual residue of the old system. Plain `bg-white` vs `border-white/[0.08]` contrast already exists — just drop the glows.

### R4 (Low): Dead CSS + stray refs

- `.titanium-card` and `.titanium-gradient-text` in `index.css` are now unused — remove.
- `mainContentRef` in `App.tsx` is attached but never read; remove.
- "SYSTEM DOSSIER" label in the developer hero is leftover role-play flavor; something plain ("Profile", "Stack") fits better.

## Verdict

Phases 1–3 of the plan landed well: the template furniture is gone, surfaces are calm, content-specific layouts exist. What remains is concentrated: the wizard's voice, simultaneous video autoplay, and leftover glow shadows. R1–R3 are approximately a half-day of work.

---

# Re-audit (Round 3, Oct 27 2026) — post Phase 3 hero work

**Verified:** `lint` and `build` clean (464 KB JS gzip 142 KB). Hero image `/media/photos/CHR07389.jpg` confirmed live (`image/jpeg` from `media.chintan992.dev`).

## What landed since Round 2

- **`EditorialHero.tsx` replaces the deleted `ExecutiveBento`** — implements the "full-bleed editorial hero" recommendation: a real photograph (CHR07389.jpg) as the hub lead, text overlaid with dual legibility gradients, and a quiet grounded-facts line under a hairline rule. No metric tiles, no pills, no CLI. This is the strongest single change in the whole de-slop effort.
- **`vite.config.ts`:** dev proxy for `/media` → `media.chintan992.dev`, matching the production worker route. Good infra parity.
- Frame container is `max-w-6xl` framed (not edge-to-edge) — an acceptable, more considered variant of "full-bleed"; noted, not a defect.

## Still open (carried from Round 2, unchanged)

### R1 (High): `InquiryWizard.tsx` untouched
"Transmit Inquiry" / "Inquiry Transmitted", "Select Engagement Domain", "Estimated Investment Scale", "Delivery Window", the "**Brief Brief** or Project Overview" typo, "Alex Vance" / "alex@studio.com" placeholders, emoji chips (💻⚡🎬📷✨) mixed with lucide icons, `Sparkles` in the summary strip, and missing radiogroup/aria-checked semantics.

### R2 (High): All 6 gallery videos still `autoPlay loop muted` simultaneously in `MasonryGallery.tsx`
No viewport gating, no `prefers-reduced-motion` fallback. On `/visual` this streams six heavyweight clips at once.

### R3 (Medium): 13 glow shadows remain
`shadow-[0_0_10–25px_rgba(255,255,255,…)]` on nav CTA, filter tags, timeline nodes, VisualServices tabs, and 9 occurrences in the wizard (including a white glow on the step progress line and an emerald glow on the success icon).

### R4 (Low): Dead code survives
- `.titanium-card` and `.titanium-gradient-text` still defined in `index.css`, unused by any component.
- `mainContentRef` in `App.tsx` attached but never read.
- "SYSTEM DOSSIER" label (developer hero) and "View full technical dossier" (hub services link) — leftover dossier-speak; the phrase appears twice.

## New minor notes

- Hero `<img>` is the LCP: has `loading="eager"` but no `fetchpriority="high"`, no `srcset`/responsive sizes, no `sizes` — smallest improvement: add `fetchpriority="high"` and a 1280px-ish variant.
- Dev-mode note: all `/media` traffic proxies through the pinned origin, so first-run dev can feel slow if remote files are cold.

## Verdict

The content-led hero completes the planned Phase 3 work for the hub. The remaining scope is unchanged from Round 2 and still concentrated: R1 (wizard voice/a11y), R2 (video playback policy), R3 (glow shadows), R4 (dead code). Nothing new broke; build and lint stay clean.

---

# Re-audit (Round 4, Oct 27 2026) — Final Resolution

**Status:** All findings resolved. Build (855ms) and lint (oxlint) 100% clean.

## Changes Landed in Round 4

1. **R1 Resolved (`InquiryWizard.tsx` grounded voice & a11y):**
   - Jargon replaced: "Send message", "Message sent", "What do you need?", "Estimated Budget", "Target Timeline".
   - Duplicated typo fixed: "Project Brief or Message".
   - Placeholder names naturalized: "Your name" and "you@example.com".
   - Emojis (💻⚡🎬📷✨) replaced with Lucide icons (`Code2`, `Cpu`, `Film`, `Camera`, `Layers`). Stray `Sparkles` icon removed.
   - A11y implemented: `role="radiogroup"`, `role="radio"`, `aria-checked`, and step labels for screen readers.
2. **R2 Resolved (Gallery video policy in `MasonryGallery.tsx`):**
   - Replaced simultaneous 6-video autoplay with `IntersectionObserver` in dedicated `GalleryVideo` component.
   - Videos only stream and play when intersecting >= 25% of viewport; pause automatically when offscreen.
   - `prefers-reduced-motion` honored: autoplay disabled when requested, showing poster image.
   - Initial preload set to `"none"`.
3. **R3 Resolved (Glow shadows eliminated):**
   - All 13 outer white/emerald glow halos (`shadow-[0_0_...`) purged from navigation active pill, CTA buttons, filter tags, timeline nodes, VisualServices tabs, and the wizard.
4. **R4 Resolved (Dead code, dossier-speak & LCP):**
   - Removed unused `.titanium-card` and `.titanium-gradient-text` from `index.css`.
   - Removed unused `mainContentRef` and `useRef` import from `App.tsx`.
   - Replaced dossier-speak with "TECHNICAL PROFILE" and "View all engineering work".
   - Added `fetchPriority="high"` to `EditorialHero.tsx` lead `<img>`.

