# SEO Audit — chintan992.dev

**Audit date:** October 27, 2026
**Site type:** Personal dual-discipline portfolio (software engineering + photography/film), React 19 SPA served as static assets from a Cloudflare Worker. Single real URL (`/`); the three "views" (`#hub`, `#dev`, `#visual`) are hash fragments, which Google treats as one page.

**Overall health: 🟠 Needs work — foundations are clean (HTTPS, security headers, alt text, sitemap-worthy content), but the site is nearly invisible to search engines: no served content, no sitemap/robots.txt, soft 404s everywhere, no structured data or canonical.**

---

## Executive Summary — Top Issues

| # | Issue | Impact |
|---|-------|--------|
| 1 | All page content renders client-side only — served HTML has an empty `#root` | **High** |
| 2 | `robots.txt` and `sitemap.xml` don't exist; both serve the SPA's HTML (`text/html`, 200) | **High** |
| 3 | Every URL returns HTTP 200 with identical homepage content (soft 404s) | **High** |
| 4 | No canonical tag, no OG image, no Twitter cards, no structured data (JSON-LD) | **High** |
| 5 | "Preview" links point to dead project subdomains (6 hosts, none respond) | **Medium** |
| 6 | ~736 MB of MP4s + unoptimized up-to-1.7 MB JPEGs, no `width`/`height` on gallery images | **Medium** |

Quick wins: `robots.txt` + `sitemap.xml` + `<link rel="canonical">` + a Person/ProfilePage JSON-LD can all be shipped in under an hour and don't change the UI.

---

## Technical SEO Findings

### 1. Client-side-only rendering (Critical)
- **Issue:** `index.html` contains only an empty `<div id="root"></div>`. Every project, service, timeline entry, and all 20 gallery frames (with their alt text) exist only in JS bundles. Google's JS rendering is not guaranteed to be complete or fast — first-pass crawling sees an empty page.
- **Impact:** High — relevance signals, internal link graph, and content discovery all depend on a second rendering wave.
- **Evidence:** Live fetch of `https://chintan992.dev/` returned `<div id="root"></div>` with no noscript fallback; `src/main.tsx` does classic `createRoot` hydration.
- **Fix:** Prerender meaningful HTML into `index.html` at build time. Simplest given the fixed content: ship the hub view's real markup inside `#root` in the build (e.g., a small prerender script using `react-dom/server` with the `hub` mode as initial state, or a Vite prerender plugin). The `/api/github` data should have a static fallback from `src/data/portfolio-data.ts` in the prerendered HTML.
- **Priority:** 1

### 2. Missing robots.txt and sitemap.xml (Critical)
- **Issue:** `public/` contains no `robots.txt`. Because `not_found_handling: "single-page-application"` in `wrangler.jsonc:9`, requests for `/robots.txt` and `/sitemap.xml` return HTTP 200 with `Content-Type: text/html` (verified live).
- **Impact:** High — crawlers can't read rules or find the sitemap; Search Console can't process a sitemap; crawl errors accumulate.
- **Evidence:** `curl` → `robots.txt: 200 type=text/html`, `sitemap.xml: 200 type=text/html`.
- **Fix:** Add `public/robots.txt` (reference the sitemap, disallow `/api/`) and `public/sitemap.xml` (list the homepage; add project subdomains only once they're real pages). Vite copies `public/` into `dist/` at build.
- **Priority:** 2

### 3. Soft 404s on every path (Critical)
- **Issue:** Any unknown URL → HTTP 200 with the full homepage HTML. Verified: `https://chintan992.dev/this-page-does-not-exist-test` returned `200` and identical head/title.
- **Impact:** High — Google indexes duplicate homepage variants, wastes crawl budget, and soft-404s are a known quality-degradation signal at scale.
- **Fix:** In `src/worker.ts:407-457`, before `env.ASSETS.fetch(request)`, return a real 404 (with a small 404 HTML page) for any path that isn't `/` or a static asset. Since the SPA has no real routes, this is a single `if (new URL(request.url).pathname !== '/')` check.
- **Priority:** 3

### 4. www host is dead (Medium, latent duplicate-content risk)
- **Issue:** `https://www.chintan992.dev/` fails to respond entirely (connection error, HTTP 000). The README intends wildcard + apex DNS; `www` isn't working.
- **Impact:** Medium — broken UX for users typing `www`; if it's ever enabled, two hosts serving identical HTML with no canonical creates a duplicate-content problem.
- **Fix:** Either add the `www` DNS record and 301-redirect `www → apex` in the worker, or remove the `www` host check (`src/worker.ts:430-435`) and let it 404 until a redirect exists.
- **Priority:** 4

### 5. Dead project subdomains (Medium)
- **Issue:** The site links "Preview" to `https://{host}.chintan992.dev` (`GitHubGrid.tsx:202`). All tested subdomains (`letstream`, `cinecull`, `letsstream-flutter`) fail to connect (`000`). Additionally, `cinecull` and `letsstream-flutter` are in `portfolio-data.ts` but not in the worker's `projects` registry (`worker.ts:26-52`), so even with DNS they'd 404 — the README explicitly warns unknown slugs return 404.
- **Impact:** Medium — broken outbound links on the primary page; lost flow for recruiters clicking through; broken-destination signals if hosts ever resolve.
- **Fix:** Short term, link projects to their GitHub repos (already available in the same data). Long term, register the hosts in DNS + the worker registry before advertising them.
- **Priority:** 5

### 6. Placeholder pages lack SEO affordances (Low — currently unreachable)
- **Issue:** When the DNS is fixed, `projectPlaceholder()` pages (`worker.ts:105-146`) will be indexable "coming soon" pages with no canonical, no meta description, and no OG tags — thin/incomplete pages under your brand.
- **Fix:** Add `<meta name="robots" content="noindex">` to the placeholder template now, and swap it out when a real page replaces the placeholder.
- **Priority:** 6

---

## On-Page SEO Findings

### 7. Value: present and reasonable ✅
- Title (43 chars), meta description (~150 chars, branded + location + profession), `og:type/title/description`, `lang="en"`, viewport, favicon — all present in `index.html`. Good baseline.

### 8. Title could match user intent better (Low)
- **Issue:** "Chintan Rathod — Software & Visual Stories" is brand-first but vague for intent matching ("software engineer Calgary", "photographer Calgary").
- **Fix option:** `Chintan Rathod — Software Engineer & Photographer, Calgary` (~58 chars, no truncation).
- **Priority:** 7

### 9. Missing canonical, og:image, Twitter cards, and JSON-LD (High)
- **Issue:** No `rel="canonical"` anywhere (grep confirmed). No `og:image`, no `twitter:*`. No JSON-LD (Person/ProfilePage) — structured data absent from source.
- **Impact:** High — social shares render with no preview image; no personal-entity signals for brand queries; canonical needed against soft-404 variants and any future `www` host.
- **Fix (`index.html` `<head>`):**
  - `<link rel="canonical" href="https://chintan992.dev/">`
  - 1200×630 `og:image` (a strong gallery frame) + `twitter:card summary_large_image`
  - JSON-LD `@type: ["Person","ProfilePage"]` with `name`, `jobTitle`, `homeLocation: Calgary`, `sameAs` → GitHub / LinkedIn / both Instagram profiles, `knowsAbout` (TypeScript, Kotlin, Flutter, cinematography), plus `mainEntity` links.
- **Priority:** 8

### 10. Heading structure ✅ (with one watch item)
- One H1 per view (`ExecutiveBento.tsx:53`, `App.tsx:244`, `App.tsx:393`); logical H1→H2→H3 hierarchy. Watch: when prerendering, the three views' H1s would collide in static HTML — prerender only the hub view with one H1.

### 11. Image optimization (Medium)
- **Issue:** Gallery `<img>` tags have no `width`/`height` (`MasonryGallery.tsx:85-90`) → CLS risk; no `srcset`; source JPEGs reach 1.7 MB for masonry thumbnails.
- **Fix:** Add explicit dimensions (aspect-ratio known per frame), and serve smaller derivatives — either pre-generated variants or Cloudflare Image Resizing on `/media/photos/*`; the worker already proxies `/media/*` (`worker.ts:418-420`).
- **Priority:** 9

### 12. Video weight (Medium)
- **Issue:** 27 videos totaling ~736 MB shipped in `public/media/videos/`; `street1.mp4` is 7 MB. The hero autoplay (`model-car.mp4`, 1.5 MB) is acceptable; gallery videos autoplay with `preload="metadata"`.
- **Fix:** Recompress gallery clips to ≤ 2 MB (the existing `scripts/convert-videos.ps1` pipeline covers this), and exclude huge videos from the static asset bundle (they're duplicated in B2 and served via `/media/*` proxy with 1-year immutable caching anyway). Videos are muted, so pure-decoration calls are fine.
- **Priority:** 10

### 13. Analytics beacon is likely blocked by CSP (Low, measurement)
- **Issue:** The worker CSP is `script-src 'self'; connect-src 'self'` (`worker.ts:64`), while Cloudflare injects its Web Analytics beacon from `static.cloudflareinsights.com` into live pages. Per CSP rules the beacon script and its `connect-src` calls would be blocked.
- **Impact:** Indirect — you lose traffic measurement, making SEO decisions blind.
- **Fix:** Add `https://static.cloudflareinsights.com` to `script-src` and `connect-src` in the CSP, or verify the beacon is delivering in the Cloudflare dashboard.
- **Priority:** 11

---

## Content Findings

**Strengths:** Genuinely good content for a personal site — outcomes with numbers ("15% academic performance improvement", "28% higher engagement"), specific stack detail, geo signals (Calgary), varied media with descriptive captions/alt text, and a clean narrative across both disciplines. `chintan-rathod.pdf` is a well-named resume file.

**Gaps:**

### 14. Single-URL architecture limits new ranking surfaces (Strategic)
- **Issue:** `#dev` and `#visual` modes can never rank as "Calgary software engineer" or "Calgary photographer/videographer" pages — they're one URL to Google.
- **Long-term fix:** If organic discovery matters, split into real routes (`/engineering`, `/photography`) with prerendered, distinct titles/descriptions/JSON-LD per page. The current worker + static-asset setup already supports path-based logic (`src/worker.ts` would need a modest extension + ASSETS binding per path).
- **Priority:** 12 (long-term)

### 15. E-E-A-T reinforcement (Quick win)
- Link the same profiles in JSON-LD `sameAs`, keep the visible `socials` block — trust signals via LinkedIn/GitHub are adequate for a personal brand.

### 16. Not-checkable items (need Search Console access)
- **Search Console:** currently unverifiable from the audit. Given robots/sitemap gaps and the soft-404 pattern, presence may be minimal. Submit the new sitemap there once items #2–#3 ship.
- **Core Web Vitals field data:** no CWV access in the audit; lab-side, the biggest flags are CLS (no image dimensions) and page weight (videos/photos above).

---

## Prioritized Action Plan

### Critical (this week)
1. Add `public/robots.txt` + `public/sitemap.xml` (issue #2)
2. Return real 404s for unknown paths in `src/worker.ts` (issue #3)
3. Add canonical URL, `og:image`, `twitter:card`, Person/ProfilePage JSON-LD to `index.html` (issue #9)

### High-impact (this month)
4. Prerender the hub view content into static HTML (issue #1 — biggest single ranking unlock)
5. Fix or remove dead project subdomain links; register hosts in worker + DNS before advertising (issues #5–#6)
6. Add `noindex` to project placeholder pages (issue #6)

### Quick wins
7. Refine title toward intent keywords (issue #8)
8. Add `width`/`height` to gallery images; compress videos (issues #11–#12)
9. Fix CSP to allow the Cloudflare analytics beacon, or verify it's running (issue #13)

### Long-term
10. Split hash views into real, prerenderable routes for distinct ranking targets (issue #14)
11. Set up Search Console, submit sitemap, watch for soft-404 and coverage reports
