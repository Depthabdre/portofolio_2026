# Journal and navigation refinement plan

Prepared 4 November 2026. Status: implemented locally and validated. The original plan below is retained as rationale; the implementation record describes the delivered changes.

## Intent

Make the Journal feel like a considered part of Abdrehim’s portfolio: easy to browse, comfortable to read, and consistent with the homepage. Retain the original Journal structure and familiar wording. Improve proportion, alignment, content states, and interactions before adding visual effects.

Audience: hiring managers, engineering teams, and ordinary visitors interested in Abdrehim’s work and learning. Developer positioning: full-stack and mobile development, including React, Next.js, Flutter, and Node.js with Express. Historical job titles remain accurate.

## Evidence reviewed

- Reviewed the current committed source and the saved `journal-restored-light.png` screenshot from the previous browser review. That screenshot showed zero published articles and challenges; the current database has not been rechecked for this plan.
- The header container is 1160 px wide while public Journal content is 1120 px wide. The resulting 20 px difference on each side weakens alignment at desktop widths.
- The restored Journal heading grows to 82 px with tight tracking. Together with the header spacing and large empty panel, it gives introductory copy more emphasis than browsing.
- `journal.css` contains initial rules, later refinements, and a final high-specificity restoration block. Container width, title size, card treatment, and spacing have multiple definitions.
- The public header uses Arial while Journal content uses IBM Plex Sans. This is a small but visible inconsistency.
- Native smooth scrolling already exists on `html:has(.portfolio-home)` for visitors without reduced-motion preferences. It is not consistently configured across public routes. The exact reported jump needs browser reproduction before selecting a fix.
- HomeNav uses Next.js Link for hash destinations; hero links use native anchors; LegacyNavBar uses imperative smooth scrolling. These three paths need testing together.
- Journal section links already use `scroll={false}`. Preserve their stable position when switching Articles and Challenges.

## Visual direction

Use the existing portfolio palette and bundled IBM Plex Sans. Personality should come from Abdrehim’s writing, real project details, and clear hierarchy. Keep familiar Journal tabs, article cards, challenge views, and headline wording. No new font, visual framework, or animation package is needed.

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | `#fcfcfd` | `#13191f` |
| Primary text | `#171e25` | `#f0f4f7` |
| Secondary text | `#4b5966` | `#b8c5d0` |
| Interactive accent | `#14547c` | `#b4d8f0` |
| Surface | `#edf2f5` | `#202c36` |
| Divider | `#d4dee5` | `#374653` |

Reuse these semantic tokens; validate actual contrast pairs in both themes. Keep text left aligned. Use the same maximum content width and responsive gutters as the public header, while retaining a narrower article reading column.

Proposed composition:

```text
Shared portfolio navigation

The journal
Ideas into practice.
One entry at a time.
Short introduction

Articles   Challenges                      Search, when useful
Topic filters, when content exists

Article cards / challenges / concise empty state
Current focus, when present

Footer aligned with the content
```

## Implementation sequence

### 1. Normalize the CSS before visual tuning

Consolidate duplicate public Journal rules into one base section with explicit responsive adjustments. Keep admin-specific presentation in `studio.css`; preserve the shared token aliases and Markdown styles used by editor previews. Remove the restoration override block only after moving its required behavior into the base rules. Avoid increasing specificity to fix conflicts.

Files: `app/journal/journal.css`, with regression review of `app/admin/studio.css` and the admin preview.

### 2. Repair hierarchy and alignment

- Match the Journal’s outer alignment to the public header: 1160 px maximum width and the same responsive gutters.
- Retain the current two-line headline wording. Start with 56 px desktop, 44 px tablet, and 34–38 px mobile; tune against actual wrapping at 320 px.
- Ease the current negative letter spacing. Keep the title prominent without overpowering the article area.
- Use approximately 48 px top spacing on desktop and 32 px on mobile, then a deliberate 32–40 px separation before the toolbar.
- Keep body copy at 16–17 px with a comfortable line height. Use the same font family in the header and Journal.
- Make “Learning in public” secondary; remove its decorative arrow if it has no destination. Keep the recognizable Journal label without extra ornament.

Files: `app/journal/page.tsx`, `app/journal/journal.css`, shared header typography in `app/home.css`.

### 3. Design for actual content states

- Empty Journal: replace the oversized dashed panel with a compact, clearly bounded message: “No articles published yet.” Follow with a short explanation. Keep Articles and Challenges available; zero counts can be omitted to reduce noise.
- Empty search: show “No matching articles” with a clear way to reset search and topic filters.
- Published articles: preserve the existing card structure, establish a consistent image ratio when a cover exists, and make cards without images feel deliberate. Avoid placeholder imagery or invented content.
- Keep article title, excerpt, publication date, reading time, and topics in a clear hierarchy. Retain genuine dates in the Journal; the earlier request to remove employment dates does not require hiding publication dates.
- Challenges: keep their distinct purpose, readable progress, and current status. Avoid styling every item as another interchangeable dashboard tile.
- Review Current focus placement so it supports the browsing area instead of competing with it.

Files: `JournalTabsView.tsx`, `JournalChrome.tsx`, `BlogCard.tsx`, `ChallengeTimeline.tsx`, `NowStatusCard.tsx`, and scoped Journal CSS.

### 4. Make navigation scrolling predictable

Reproduce each path first: homepage Work/Experience/About/Contact links, hero CTA, Journal-to-home section links, Apps-to-home links, repeated clicks, browser Back/Forward, and direct hash loads.

Use native scrolling where it provides the intended behavior. Configure viewport smooth scrolling consistently for public pages when motion is permitted. Keep reduced-motion scrolling immediate, including the legacy imperative handler. Preserve real URLs and browser history; do not replace navigation with an animation-only handler.

For same-page hash links, prefer native anchors if Next.js routing produces unnecessary navigation or a jump. For cross-route links, keep route navigation and confirm the target exists before any additional scrolling. Add a small route-aware enhancement only if testing demonstrates it is necessary. Do not add timers to mask rendering timing.

Use target spacing appropriate to the actual header positioning; the current header is in normal flow, so do not reserve a sticky-header-sized gap. If the header positioning changes later, update the offset with it.

Preserve `scroll={false}` for Journal view switches. Keep article navigation and Back/Forward restoration predictable. Avoid forced page-wide scrolling on route transitions.

The installed Next.js 16.2.1 upgrade guide explains that `data-scroll-behavior="smooth"` opts into temporarily overriding smooth scrolling during route changes. Do not add it reflexively as a smooth-scroll fix; test the intended split between hash navigation and page navigation.

Files: `HomeNav.tsx`, `LegacyNavBar.tsx`, shared scroll CSS, and `app/layout.tsx` only if framework configuration is required.

### 5. Add restrained interaction feedback

Use 140–200 ms color, border, or underline feedback for links and tabs. Keep content visible immediately. Remove the need for repeated card entrance animations or large hover translations. Smooth anchor scrolling is the primary requested movement. Keep visible keyboard focus, 44 px interactive targets, and full reduced-motion support.

### 6. Validate and commit in independent chunks

1. CSS normalization and Journal proportions.
2. Content states and card refinement.
3. Navigation and scrolling fixes.
4. Review notes and validation results.

Review desktop and mobile screenshots before expanding the change to other pages. Keep admin behavior intact and check its shared Markdown preview after CSS changes. Do not change publishing, authentication, or database behavior for this visual refinement.

## Completion criteria

- Review Journal light/dark states at 320, 390, 768, and 1440 px, including zoom and long titles.
- Header, content, toolbar, and footer align consistently; no horizontal page overflow.
- Confirm empty Journal, populated cards, missing covers, long titles, search with no results, challenge progress, and current-focus states using local fixtures or unsaved previews. Do not publish sample records.
- Same-page navigation moves smoothly when permitted and lands on the intended heading. Reduced-motion users get immediate movement.
- Cross-route hashes, direct links, modified clicks, repeated clicks, browser history, and mobile menu dismissal continue to work.
- Article and challenge navigation preserve appropriate scroll behavior; switching Journal views does not jump to the top.
- Keyboard navigation, visible focus, accessible labels, and contrast checks pass. Automated accessibility checks supplement visual and keyboard review.
- Full lint, production build, and existing Journal tests pass. Add targeted navigation coverage if an actual behavioral fix requires it.

## References

- Installed Next.js guides: `node_modules/next/dist/docs/01-app/03-api-reference/02-components/link.md` and `01-app/02-guides/upgrading/version-16.md` (the latter’s Scroll Behavior Override section).
- [MDN: scroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-behavior).
- [Next.js Link reference](https://nextjs.org/docs/app/api-reference/components/link), with installed-version documentation taking precedence for this repository.
- Local frontend-design skill and UI/UX guidance for native scrolling and reduced motion. Existing skills are sufficient; no additional installation is necessary.

## Implementation record — 4 November 2026

Retained the original two-line headline and Journal navigation. Reduced the display type to 56 px maximum, tuned mobile wrapping, aligned the Journal to the shared 1160 px container, and applied IBM Plex Sans consistently to the public header. Consolidated competing style rules and removed the restoration override block. Cards use restrained border feedback; cards without covers keep their natural height. Long titles and topics wrap within their containers.

Replaced the large dashed empty panel with a compact, left-aligned message. Empty section counts are omitted. Search has a distinct label and clear control; the no-results action clears both the query and topic selection and returns focus to search. Challenge progress and current-focus content retain their existing behavior.

Added a shared HomeSectionLink for homepage section destinations. Same-page clicks use native anchors, including repeated clicks. Cross-page clicks first mount the homepage without an automatic scroll, then apply the intended fragment to that same history entry and scroll to the mounted target. This resolves a duplicated fragment observed after Back/Forward navigation in the installed Next.js version. A small navigation-intent module distinguishes deliberate section clicks from history and direct URL loads. The scroll enhancement observes DOM readiness instead of using delays, cleans up its observer, respects reduced motion, and moves keyboard focus to the destination. The framework's documented scroll attribute keeps ordinary page transitions separate from hash scrolling.

Updated the developer title to “Full-stack & mobile developer,” with Node.js and Express mentioned in the introduction and metadata. Actual employment titles are unchanged.

Validation:

- Full ESLint, production build/TypeScript compilation, whitespace checks, and all 17 existing Journal tests passed.
- Public Journal review covered empty, populated article, and populated challenge states at 320, 390, 768, and 1440 px in both themes: 24 automated accessibility checks, no WCAG A/AA violations, no horizontal page overflow, and matching header/content alignment.
- Search, topic filtering, combined reset, clear-search behavior, and reset focus were verified against temporary local fixtures.
- Admin regression review covered sign-in, overview, article editor, Markdown preview, challenge editor, and current-focus editor, alongside the public Journal: 28 additional accessibility checks at 390 and 1440 px in both themes, with no violations or page overflow. Code copying and sign-out also passed. No content was saved.
- Browser navigation review passed in development and production previews: same-page and repeated clicks, cross-page links from Journal and Apps, Back/Forward URLs and hash destinations, reduced motion, direct hashes and reloads, mobile menu closure, destination focus, skip-link keyboard use, and narrow-screen reflow. No page errors were recorded. Back/Forward retains the framework/browser's existing hash-restoration behavior.
- Temporary fixture routes were removed before the final build. Screenshots and JSON review reports remain local under ignored `output/playwright/`; sample content was never published.
