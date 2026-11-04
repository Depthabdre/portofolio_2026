# Homepage redesign plan

Prepared 30 October 2026. Status: implemented locally and validated. The original proposal below is retained as design rationale; the implementation record at the end describes the delivered result.

Screenshot and report links below refer to generated local review artifacts in `output/playwright/`. These artifacts are excluded from version control.

## Objective and audience

Present Abdrehim as an engineer who ships useful mobile and web products and can explain the decisions behind them. The user confirmed hiring managers and engineering teams as the primary audience, while explicitly asking that general visitors can also get to know him. Potential clients, app users, students, and people curious about Abdrehim should find the homepage approachable.

Prioritize evidence of shipped work, individual ownership, technical decisions and tradeoffs, and collaboration. Make roles and contributions easy to scan, with direct access to the CV, public code, live products, and contact information. Introduce Abdrehim as a person in the opening, provide a clearly labeled About destination, and give teaching and personal interests a dedicated section. Explain each app's everyday purpose before technical detail, so visitors need no engineering background to understand his work.

The homepage should answer four questions quickly: who are you, what do you build, what proves your ability, and how can someone reach you? Its distinctive material is already available: offline learning in A+, the reading experience in Real English, focus tools, teaching, mentoring, and AI training. Build the visual identity around those subjects.

Success is a clear, memorable presentation of this work. No visual style can prove whether a website was made with AI. Fonts, cards, gradients, and dark mode are not inherently unprofessional; the issue here is their cumulative use without a clear content hierarchy.

## Audit of the current implementation

Inspected the homepage components, content, global CSS, navigation, real product assets, and the running localhost page. Desktop screenshots were captured at 1440 × 1000 and the mobile introduction at 390 × 844. The mobile capture shows a text-only first viewport, with the app-style bottom navigation occupying additional space. This is a design and code audit, not a production performance or full accessibility certification.

Baseline captures: [desktop introduction](../output/playwright/home-before-desktop.png), [desktop projects](../output/playwright/projects-before-desktop.png), and [mobile introduction](../output/playwright/home-before-mobile.png).

| Current evidence | Effect | Proposed change |
| --- | --- | --- |
| `HeroSection.tsx` uses a full-viewport introduction and a large `HeroScene` canvas | The first screen gives substantial space to an abstract illustration while actual apps remain below the stats section | Replace the canvas with a clear product preview; shorten the intro |
| `app/page.tsx` places `QuickStatsBento` before projects | Credentials delay the strongest evidence of engineering work | Put selected work directly after the introduction |
| `globals.css` combines radial glows, fixed gradients, a grid, and texture | Multiple decorative treatments compete with screenshots | Use quiet surfaces and a deliberate contrast hierarchy |
| `FeaturedProjects.tsx` gives all four projects similar glass-card treatment | The strongest project has no clear editorial priority | One lead case study, two supporting projects, one compact additional-work entry |
| Mobile screenshots render at 132 × 220 inside horizontal rails | Visitors can recognize colors but cannot comfortably inspect the interface | Choose representative screens, show them larger, provide optional accessible enlargement |
| Project links and technology icons share horizontally constrained rows | Useful destinations are clipped in the desktop capture | Give project actions their own wrapping row and render technology names as compact text |
| Every screenshot is named `Product Preview` | Screen-reader descriptions do not identify the product or screen | Give informative images specific descriptions; hide purely duplicate decoration |
| Project content heights are equalized with `ResizeObserver` and inline `minHeight` values | Different-length stories inherit extra whitespace, including on narrow layouts | Use independent content sizing and CSS layout |
| `ExperienceTimeline.tsx` mixes employment, education, mentoring, and general community work, with badges but no dates | Chronology and professional contribution are difficult to scan | Separate employment from education/community and add only confirmed dates |
| Desktop navigation has seven destinations and calls the first one `Hero` | Internal implementation terminology appears in the visitor interface | Use a name/home link and clear destination labels |
| Mobile uses a bottom tab bar plus a secondary menu | Navigation adds app-like chrome to a reading-oriented website | Use a compact header and accessible menu |
| Several sections animate into visibility; timeline and particle movement are not fully controlled by reduced-motion preferences | Reading depends too much on animation and scroll position | Render content visibly by default; keep optional motion local and purposeful |
| Footer combines a repeating technology marquee, personal interests, and contact | The closing action has unnecessary competition | Separate a short personal note from a direct contact footer |

Existing positives to preserve: real project screenshots, genuine personal interests, CV download, direct project links, responsive foundations, and meaningful engineering subject matter.

## Research and how it changes this proposal

1. **Choose a subject-specific direction before choosing components.** Anthropic explains how vague frontend prompts converge on familiar visual defaults. Its current frontend-design skill advocates making the subject matter drive the hero and spending visual emphasis in one place. Apply this by centering actual product screens and engineering decisions. This is guidance, not evidence that a particular font or palette guarantees originality. [Article](https://claude.com/resources/articles/improving-frontend-design-through-skills), [skill source](https://github.com/anthropics/skills/tree/main/skills/frontend-design).
2. **Use hierarchy to make importance visible.** NN/g describes scale, hierarchy, balance, contrast, and grouping as core visual-design principles. Apply a strong size difference between the flagship project and supporting work, and group role, problem, and result together. [NN/g](https://www.nngroup.com/articles/principles-visual-design/).
3. **Keep the person's work and voice prominent.** Lee Robinson's homepage centers a direct biography and writing; Emil Kowalski's centers a concise introduction, named projects, and writing. Borrow their content clarity, without copying their identities or layouts. [Lee Robinson](https://leerob.com/), [Emil Kowalski](https://emilkowal.ski/). Rauno's homepage also makes his discipline and selected destinations immediately explicit. [Rauno Freiberg](https://rauno.me/).
4. **Give movement a purpose.** Emil Kowalski illustrates how animation can clarify feedback or instead slow an interface. Use brief feedback for menus and galleries, and avoid repeated scroll choreography. [You Don't Need Animations](https://emilkowal.ski/ui/you-dont-need-animations).
5. **Specify reviewable design rules.** Articulating the reason behind a decision makes agent-produced work more consistent. Encode concrete type, spacing, motion, and content rules, then compare actual screenshots with them. [Agents with Taste](https://emilkowal.ski/ui/agents-with-taste).

The existing UI/UX skill was consulted. Its initial design-system result was a documentation landing page; a narrower retry produced a casual/brutalist personal-portfolio direction. Neither fits the professional brief well enough to adopt wholesale. The visual proposal below is a considered design recommendation, not a validated automatic database match. Its Next.js image and server-component guidance was relevant and checked against the installed framework documentation.

## Recommended visual direction

A bright, precise product showcase with expressive product imagery and straightforward typography. This light direction is a proposal, not a claim that dark portfolios are less professional. A dark version could use the same structure if preferred.

Use a white canvas with cool, pale screenshot stages. Let the actual products contribute gold, blue, and other colors naturally. Avoid adding a decorative color wash across the entire site. The memorable element should be the flagship app presentation.

### Initial tokens to validate in the browser

| Role | Proposal | Reason |
| --- | --- | --- |
| Canvas | `#FFFFFF` | Keeps different product palettes distinct |
| Screenshot stage | `#F2F5F7` | Separates imagery without glass or heavy shadows |
| Primary text | `#20252C` | Strong reading contrast |
| Secondary text | `#5B6470` | Visible supporting content |
| Action accent | `#174A6E` | Restrained blue, reserved for actions and focus |
| Divider | `#D9E0E5` | Separates content groups where necessary |

These values are starting tokens. Verify every real foreground/background pair after implementation, especially disabled controls and focus rings.

- Typography: propose IBM Plex Sans for headings, body, and controls. Its clear forms support technical explanations and product captions without requiring a separate decorative display face. Compare against the existing Inter using the real name and project titles before locking the choice; font novelty alone is not a success criterion.
- Type scale: desktop introduction around 56–64 px; mobile 36–42 px; section titles 28–36 px; body 16–18 px; metadata 14 px. Use fluid sizing and tune actual line breaks.
- Text measure: approximately 55–68 characters for body copy. Left-align primary reading content.
- Layout: shared container around 1160 px; 20 px mobile gutters, 32 px tablet gutters, generous desktop margins. Build on a consistent 8 px spacing rhythm with 4 px adjustments for small controls.
- Spacing: roughly 80–112 px between desktop sections and 48–64 px on mobile, adjusted to content. Avoid forcing the introduction to fill the entire viewport.
- Shape: small control radii and moderate screenshot-stage radii. Preserve real device/screenshot proportions. Do not wrap every paragraph in a panel.
- Motion: ordinary links respond immediately; menu/gallery feedback approximately 150–220 ms. No automatic 3D scene, cursor follower, endless marquee, or scroll-tracing beam in the proposed homepage.

### Composition

```text
Abdrehim Misbah       Work   Experience   About   Apps   Journal   Contact

I build mobile and web         Actual A+ product screen
apps for learning             Large enough to understand
and focused work.             Caption explaining the screen
Short personal introduction
View selected work   Download CV

Selected work
A+ Tutorial Class             Two purposeful screenshots
Problem, role, decisions      of the learning/offline flow
Verified outcome and links

Real English                  Student Focus
Reading experience            Study dashboard
Short engineering story       Short engineering story

More software: Focus Session for Mac + app directory

Experience
Organization / role           Contribution / confirmed dates
Education and mentoring      Compact secondary group

About Abdrehim                Real portrait, teaching, interests

Contact                       Email / LinkedIn / GitHub
```

Mobile follows the same reading order in one column. Keep the introduction short enough that real project imagery appears within roughly the first screen or first short scroll at a typical 390 × 844 viewport. Do not shrink screenshots or text to force that target. The hero preview and full A+ story should use different views rather than repeating the same image.

## Section-by-section content plan

### Introduction and navigation

Suggested draft: **“I build mobile and web apps for learning and focused work.”** Supporting copy: “I'm Abdrehim, a software engineer working with Flutter and the web. My projects include offline learning tools, language-learning apps, and software that helps people focus.” This is draft copy grounded in the repository; refine it with the user's preferred voice.

Use a name/home link and clear Work, Experience, About, Apps, Journal, and Contact destinations. About should take general visitors directly to the personal introduction. On mobile, use a menu button with an accessible name, expanded state, keyboard behavior, and sensible focus handling. Sticky navigation must not cover anchor targets. Keep a short path to the CV and direct contact.

### Selected work

Lead with **A+ Tutorial Class** because the repository describes a deployed app with a concrete offline-learning problem and student adoption. The current source claims 2,000+ students/users; that figure has not been independently verified. Do not quietly reinterpret it as downloads, active users, paying users, or a current measurement.

For each project, publish a short explanation of the problem, Abdrehim's specific contribution, one meaningful engineering decision, and the outcome. Avoid a long feature checklist and repeated technology badges. If no measured result exists, explain what was shipped and the constraint it addresses.

Select A+ course/library/learning screens before its login and splash screens. Inspect the candidate assets at full size to choose the final pair. For Real English, prioritize an actual reading/feed interaction over introductory illustration screens. For Student Focus, show the dashboard. Keep Focus Session for Mac as a compact additional project linking to its details or download.

Use existing live links where they work. Describe a private repository as private immediately; replace the misleading source-code action and explanatory overlay with a short disclosure. Optional gallery expansion should be keyboard operable with clear captions and close behavior. No new case-study route is required for the first pass: concise stories can live on the homepage.

### Experience

Rework the active `ExperienceTimeline.tsx` into scannable entries. Each employment entry should show role, organization, verified date range, and one or two concrete contributions. The source lists Horan Technologies and Eskalate; confirm current status and dates before publishing a chronology.

User-confirmed additions, already added to the existing timeline:

- **AI Trainer at [Revelo](https://www.revelo.com)** — January–March 2026.
- **AI Trainer at [rustLabs](https://experts.rustlabs.ai/#fields)** — current role. Display Present; the start date has not been supplied.

These role and date facts come from the user. The company websites provide context and link destinations, not independent verification of employment. Keep descriptions general until the user supplies specific responsibilities; do not infer model names, clients, evaluation techniques, or results from company marketing. Preserve existing roles unless the user indicates they ended.

Separate AASTU/A2SV education and GDG mentoring from employment. Condense the overlapping general teaching entry. Avoid inventing employment dates, graduation status, impact metrics, or organizational endorsements. Undated entries can still look finished while dates remain unconfirmed.

### About and contact

Replace the large stats bento with an approachable About section, linked directly from navigation. Use the existing portrait if its crop and quality work at the intended size. Explain who Abdrehim is, what he enjoys building and teaching, and his interests in natural first-person language. Keep this useful to general visitors without requiring them to read a technical résumé. Include teaching and mentoring, plus one natural sentence about interests. The repository's GPA, problem count, subscriber count, and students taught need confirmation before being presented as current facts. Distinguish students taught from app users.

Finish with a visible email address, CV, and relevant social links. Avoid inventing availability or adding a contact form that needs infrastructure. Keep only the tools most relevant to each project; remove the technology marquee from the homepage.

## Implementation sequence and boundaries

| Phase | Work | Completion evidence |
| --- | --- | --- |
| 1. Content and baseline | Use the confirmed hiring audience; inventory links, claims, screenshots, CV, and current mobile/desktop captures | Content matrix with confirmed facts and unresolved claims |
| 2. Visual composition | Compare a restrained light product showcase with a restrained dark alternative using the same real content; develop the recommended light direction | Desktop and mobile compositions where products clearly lead |
| 3. Foundation and hero | Add scoped tokens, typography, container, header, and introduction | First viewport reviewed at narrow and wide widths |
| 4. Selected work | Extract project data, build flagship/supporting layouts, choose readable imagery, simplify actions | Every project has clear contribution and usable destinations |
| 5. Experience and personal content | Simplify timeline, condense credentials, add portrait/about and direct contact | Employment, education, and mentoring are distinguishable |
| 6. Review and validation | Test production build, interaction, accessibility, performance, and cross-route effects; refine screenshots | Recorded checks and final desktop/mobile comparison |

Expected source changes:

- `app/page.tsx`: reorder sections and remove the homepage cursor mount.
- `app/globals.css`: introduce scoped homepage tokens; protect other routes that depend on existing dark variables and `.section-shell`.
- `app/layout.tsx`: integrate the selected font carefully; root changes affect every route.
- `components/nav/NavBar.tsx`: simplify navigation while preserving cross-route anchors, Apps/Journal access, and the current admin exclusion.
- `components/hero/HeroSection.tsx` and `lib/content/hero.ts`: concise introduction, genuine product visual, clear actions.
- `components/projects/FeaturedProjects.tsx`: replace identical cards and measurement logic with purposeful CSS layout. Extract content to `lib/content/projects.ts` if useful.
- `components/experience/ExperienceTimeline.tsx`: structured employment and secondary education/community entries.
- `components/stats/QuickStatsBento.tsx`: remove from homepage composition; migrate useful facts into relevant sections.
- `components/footer/FooterSection.tsx`: separate personal context and contact; remove repeating marquee from this page.
- `components/hero/HeroScene.tsx`, `CustomCursor.tsx`, and `MagneticLink.tsx`: remove homepage dependencies as appropriate; delete files or packages only after checking all other consumers.

Keep the existing Next.js, React, and Tailwind stack. No new UI or animation framework is needed. Prefer server-rendered static content with small client components for menus or an optional gallery. Preserve current app downloads, CV, projects, journal behavior, and admin functionality.

The installed Next.js 16.2.1 guides for server/client components, fonts, and images were read. Consult the relevant local guide again for any additional API being changed. In this version, `Image`'s old `priority` property is deprecated; choose the documented eager/fetch-priority/preload behavior based on the actual LCP image, without combining incompatible hints. Set accurate image `sizes`, dimensions/aspect ratios, and lazy-load supporting screens. Do not add fonts through browser CSS imports when `next/font` is available.

## Acceptance criteria

- A quick first-view review identifies Abdrehim's role, the kind of software he builds, and where to inspect the work. Run a five-second comprehension check with a few target readers if available; do not claim user validation from an agent review.
- A nontechnical visitor can explain who Abdrehim is and what at least one app does, find About directly, and reach his social links or contact information without interpreting engineering jargon.
- The flagship project receives visibly more emphasis than secondary credentials. Screenshots are useful at their displayed size, and opening them is optional for understanding the project.
- Copy is specific to Abdrehim. Swapping in another person's name should make the content obviously inaccurate; avoid generic claims about passion or innovation.
- Review at 360, 390, 768, 1024, and 1440 px widths, plus 320 CSS px reflow and 200% zoom. No accidental horizontal page overflow, clipped actions, overlapping navigation, or hidden contact information.
- One clear h1, logical headings and landmarks, meaningful image alternatives, visible focus, keyboard-operable navigation/gallery, and reduced-motion support. Aim for 44 × 44 px interactive hit areas as a usability target. WCAG 2.2 AA's target-size criterion is 24 × 24 CSS px with exceptions; these are different standards. [W3C](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
- Body text contrast at least 4.5:1; inspect large text and control boundaries using their applicable contrast requirements. Automated accessibility checks supplement keyboard and visual review.
- Production goals: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, assessed at the 75th percentile when field data exists. Use local lab results as a diagnostic, not a claim that real-user targets were achieved. [Web Vitals](https://web.dev/articles/vitals).
- Capture a before/after performance baseline under consistent conditions; verify the homepage no longer loads the decorative Three.js scene if removed. Reserve image space to avoid layout shifts.
- Run the existing lint and build scripts; report pre-existing failures separately. Check console errors, CV download, anchors, project links, Apps, Journal, and admin navigation behavior. Do not add tests that merely restate class names.
- Final review includes screenshots, a list of source changes, the actual validation results, and any unresolved content questions.

## Tools prepared and remaining decisions

Already available: `ui-ux-pro-max`. Installed for this work: Anthropic's `frontend-design` and OpenAI's `playwright`, under `/Users/abdrehimmisbah/.codex/skills/`. Their instructions were inspected; the new skills are available for automatic discovery on the next turn. Installation alone does not ensure design quality; the browser review and content-specific decisions remain essential.

Remaining editorial inputs: light/dark preference if strongly held, confirmed employment dates and current status, metric definitions/dates, and preferred project priority. These do not prevent preparing a coherent first implementation: use the confirmed hiring audience, the recommended light direction, and conservative existing content without invented claims.

The visual redesign is implemented locally. The experience section includes the user-confirmed AI Trainer roles at Revelo and rustLabs, their website links, and the supplied date/status information.


## Implementation record — 30 October 2026

Implemented a light homepage with IBM Plex Sans, restrained blue actions, real product screenshots, a compact navigation header, and a personal introduction. A+ leads the selected work; Real English and Student Focus have supporting presentations. Engineering explanations expand using native HTML details controls, and screenshots open at full size. Focus Session links to its source and the existing app directory.

Employment is separate from the personal/education/mentoring content. Revelo retains January–March 2026 and rustLabs is marked Present without an invented start date. About includes the existing portrait, teaching, education, interests, and links to YouTube and Journal. Contact and the CV remain directly accessible. Existing unconfirmed numerical claims were not promoted into new headline metrics.

Homepage sections render as Server Components. The mobile menu is a small client component with native disclosure behavior, Escape dismissal and outside-click dismissal. The older navigation is loaded separately for the other public routes. Decorative Three.js, cursor-following, marquee and scroll-reveal features are no longer mounted on the homepage. Existing components and packages used elsewhere were retained.

Homepage CSS is scoped in `app/home.css`. Existing Apps, Journal and admin styles remain in place. Fonts are bundled as Latin-subset WOFF2 files with licenses, using `next/font/local`: this resolved the Google Fonts connection errors encountered during production builds. Inter and JetBrains Mono remain available for the existing routes; IBM Plex Sans is used for the homepage. The small header uses a system sans-serif to avoid an additional homepage font download.

Validation completed:

- Production build and TypeScript compilation passed.
- Full-project ESLint passed. An existing journal test helper variable was renamed from `module` to `loadedModule` to satisfy its Next.js lint rule; all 17 existing journal tests passed.
- Browser reflow checked at 320, 360, 390, 768, 1024 and 1440 px with no horizontal page overflow.
- Mobile menu opening, Escape dismissal, project-details expansion, reduced-motion behavior and skip-link keyboard focus were checked. All homepage image assets loaded, all internal anchor targets existed, and the homepage contained no canvas.
- Apps, Journal, admin login and homepage returned HTTP 200 in browser checks.
- Mobile Lighthouse audit of the production preview: performance 95, accessibility 100, best practices 100, SEO 100. FCP 0.9 s, LCP 3.0 s, total blocking time 30 ms, CLS 0. The LCP lab result remains above the proposed 2.5 s target. This is a local simulated-mobile result, not real-user field data or a full accessibility certification; INP was not measured.
- The Lighthouse audit preceded the final keyboard-focus addition (`tabIndex=-1` on main), which was separately verified in the browser.

Artifacts: [desktop](../output/playwright/home-final-desktop.png), [mobile](../output/playwright/home-final-mobile.png), [desktop opening](../output/playwright/home-final-desktop-hero.png), [Lighthouse report](../output/playwright/lighthouse-home-final.json).

No deployment was performed. The existing local development server remains the preview for this repository.

### Portrait and motion follow-up

Replaced both homepage portraits with the user-selected `public/AbdreProfile.jpg`. The About image uses a 4:5 crop and the small introduction avatar is positioned around the face.

Added a brief CSS opening sequence for the introduction and product preview, one-time viewport entrances for project imagery and the portrait, and restrained link, image, button, menu and disclosure feedback. A small client enhancement uses IntersectionObserver and native Web Animations; static content remains visible without JavaScript. Existing visible content and direct anchor landings are not replayed on initialization. Reduced-motion preferences disable CSS movement and stop active observer-driven animations, including when the setting changes during the session.

Build and lint passed after this change. Browser checks confirmed the new image, desktop/mobile crops, a single portrait entrance, and disabled motion under reduced-motion preferences. The Lighthouse figures above describe the earlier redesign audit and were not rerun for this follow-up.

### Opening copy refinement

Updated the primary identity to Frontend & mobile developer and the opening headline to “From the web / to your pocket.” The supporting introduction now names React, Next.js and Flutter, with a modest emphasis on learning and making interfaces easier to use. The page title and description reflect the same identity. AI training remains in Experience.

### Experience sequence, contrast and theme update

At the user's request, the experience section now uses an ordered, connected timeline with four roles. Only rustLabs is labeled Present. Other date/status labels, including the Revelo date range and the date mention in its description, are removed from the displayed homepage; the previously supplied dates remain documented in the earlier content notes. Horan's description uses neutral wording without implying an end date.

Introduced semantic homepage color tokens for light and dark modes, stronger text contrast, distinct product-image stages, and an ink-colored experience section. Added a keyboard-operable theme toggle in the header. It follows the system theme until the visitor chooses a mode, persists that choice in localStorage, responds to system changes when no choice is stored, and synchronizes storage changes between tabs. A small document-head initializer applies the selected theme before rendering. The palette is scoped to homepage components, preserving the existing styles of the other routes.

Validation: production build and full-project lint passed. Browser checks confirmed theme switching, reload persistence, system-theme changes, keyboard activation, mobile-menu operation, no horizontal overflow at 320–1440 px, four ordered experience entries, zero displayed date elements and exactly one Present label. Automated axe checks reported zero WCAG A/AA violations for light and dark modes at 390 px and 1440 px. These automated checks supplement the visual and keyboard review.

Screenshots: [dark homepage](../output/playwright/home-dark-mode.png), [light homepage](../output/playwright/home-light-mode.png), [experience sequence](../output/playwright/experience-sequence.png).

### Journal and admin design-system alignment

Promoted the light/dark palette to `app/design-system.css` and centralized IBM Plex Sans in `app/typography.ts`. The homepage, Journal, article layouts, and admin Studio now consume the same typography and semantic colors. Journal uses the shared public header with an active Journal indicator, correct links back to homepage sections, and a theme toggle. The admin sign-in and authenticated topbar also expose the saved theme preference.

Replaced the older mint palette, decorative gradients, small uppercase metadata, and translucent controls with the portfolio's blue accents, solid surfaces, restrained borders, readable labels, and consistent buttons. Updated article Markdown, code blocks, tables, status badges, form inputs, sidebar, and editor previews for both themes. The sign-in page uses the same ink-colored visual treatment as the homepage experience section. Updated author/account portraits and the public author role to match the homepage.

Validation: production build, full-project lint, and all 17 existing journal tests passed. Authenticated browser review covered the overview, article editor, Markdown preview, challenge editor and current-focus editor in light and dark modes. Together with Journal and sign-in, all seven views had no page overflow and zero automated WCAG A/AA violations at 390 px and 1440 px. Code copying was verified against the browser clipboard in a separate focused check. Existing sign-in and sign-out actions worked. No article, challenge, check-in or current-focus content was saved during these checks. The public journal currently has no published articles, so content styling was exercised through the unsaved editor preview.

Screenshots: [Journal](../output/playwright/journal-light.png), [admin overview](../output/playwright/admin-overview-light.png), [dark editor preview](../output/playwright/admin-preview-dark.png), [sign-in](../output/playwright/admin-sign-in-light.png).

### Journal layout correction

The user asked to keep the previous Journal UI and limit the refresh to background, font, and theme colors. Restored the original “Ideas into practice. One entry at a time.” header, introductory wording, large two-line composition, original content width, card rounding, and dashed empty state. Existing tabs, filters, article/challenge grids and behavior retain their original structure. Public-only layout rules preserve the separate admin styling. Header spacing accounts for the shared navigation now being in normal document flow. Verified light/dark rendering, tab navigation and 320–1440 px reflow; scoped lint and whitespace checks passed.
