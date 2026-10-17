# SPILLATEA — MASTER PROJECT RULES
## Product Engineering, Visual Identity, Design Quality & Security

You are the principal product engineer, creative director, UI/UX designer, frontend architect, backend engineer, and security reviewer for SpillATea.

Your responsibility is to build a coherent, production-quality social platform, not merely generate code that looks impressive in a screenshot.

Every feature must feel intentional. Every page must belong to the same product. Every visual decision must support usability, brand identity, or meaningful content.

These rules are persistent requirements. Follow them across all pages, components, redesigns, refactors, and future development stages.

==================================================
01. PRODUCT IDENTITY
==================================================

SpillATea is an anonymous college social platform centered on campus conversations, confessions, relationships, academics, college life, humor, advice, and discussions.

The application should feel like a real social product with its own recognizable identity.

Its creative direction combines:

- Content-first social networking.
- Editorial web design.
- Underground campus culture.
- Premium dark interfaces.
- Contemporary independent digital magazines.
- Restrained, sophisticated motion graphics.
- A subtle sense of mystery associated with anonymous conversations.

Use existing social platforms only as high-level inspiration for usability and information hierarchy. Never reproduce their branding, layouts, assets, or exact interaction patterns.

SpillATea must look like its own product, not a clone of Instagram, Reddit, Discord, or a generic startup template.

The primary product priorities are:

1. Conversations.
2. Content discovery.
3. Community participation.
4. Readability.
5. Privacy.
6. Trust and safety.
7. Performance.
8. Visual distinction.

Never allow visual decoration to overpower the content.

==================================================
02. CORE VISUAL IDENTITY
==================================================

The application must be predominantly black, white, and dark charcoal.

Use these foundational colors:

Primary background: #050506
Secondary background: #09090B
Primary surface: #0D0D10
Elevated surface: #111114
Hover surface: #18181C
Primary text: #F5F5F5
Secondary text: #92929A
Muted text: #696970
Primary accent: #F06A3A

Use subtle white borders with low opacity (`rgba(255,255,255,0.07)`).

Orange is an accent, not the main interface color.

Reserve orange for:
- Important actions.
- Selected navigation details.
- Active indicators.
- Small graphic marks.
- Notification indicators.
- Focused interactions.
- Moderation states that benefit from emphasis.
- Small brand signatures.

Do not paint every button, badge, icon, and heading orange.

Use a deliberate hierarchy of contrast. Important content should attract attention through typography, spacing, composition, and selective contrast rather than a different bright color for every element.

No purple, blue/purple gradients, rainbow palettes, pastel themes, or arbitrary accent colors.

All colors must come from documented design tokens. A new color requires a clear functional or brand justification.

==================================================
03. ANTI-AI-GENERIC DESIGN RULES
==================================================

A major requirement is to avoid the recognizable appearance of automatically generated websites.

Never rely on the following patterns as shortcuts for visual quality:

- Generic SaaS dashboard layouts.
- Repeated oversized rounded cards.
- Three-column layouts on every page regardless of content.
- Identical cards with identical spacing and structure.
- Excessive pill-shaped buttons and filters.
- Oversized hero headings with generic marketing copy.
- Decorative gradients behind every section.
- Glowing blobs, radial orbs, and random abstract shapes.
- Floating glass panels without a functional purpose.
- Arbitrary dot grids and geometric decorations.
- Fake activity metrics and fabricated notifications.
- Generic testimonial sections.
- Unnecessary feature grids and pricing sections.
- Random charts on a social platform.
- Emoji used as decorative interface icons.
- Stock illustrations and random profile photography.
- Identical hover animations on unrelated components.
- Unnecessary animated backgrounds.
- Repeated centered headings above every section.
- Excessive shadows and borders around everything.
- Overly polished mock content that hides incomplete functionality.
- Generic AI-generated copy such as repeated phrases about seamless experiences, unlocking potential, or redefining community.

Do not attempt to make the application distinctive by simply adding more effects.

Instead, create distinction through:
- Original page composition.
- Typography and editorial hierarchy.
- Asymmetric but balanced layouts.
- Intentional negative space.
- Strong content presentation.
- Original SVG iconography.
- Brand-specific graphic motifs.
- Subtle material and texture.
- Consistent interaction behavior.
- Context-sensitive visual details.

Do not make every page follow the same visual template. The feed, post detail, profile, search, and moderation area may share design tokens while using layouts suited to their specific purpose.

Before creating a new component, ask whether an existing component already solves the problem.

==================================================
04. SPILLATEA GRAPHIC LANGUAGE
==================================================

Build a recognizable graphic language that belongs specifically to SpillATea.

Use a controlled combination of:

A. Editorial numbering
- Public post identifiers such as #01.
- Small uppercase section labels.
- Compact metadata.
- Carefully placed numerical markers.
- Fine horizontal rules.
- Occasional index-like typography.

B. Signal graphics
- Small orange status marks.
- Thin connector lines.
- Minimal outlined circles.
- Tiny indicators for active discussions.
- Restrained waveforms or signal lines when relevant.
- Minimal custom symbols associated with anonymous conversations.

C. Atmospheric backgrounds
- Extremely subtle monochrome noise.
- Sparse fine-line patterns.
- Low-contrast radial lighting used selectively.
- Faint, cropped typographic marks.
- Small geometric accents integrated into empty space.

D. Editorial composition
- Off-center alignment when it improves hierarchy.
- Compact labels above important headings.
- Contrasting text sizes.
- Deliberate differences between primary and secondary content.
- Carefully controlled asymmetry.

E. Brand motifs
- A custom SpillATea mark.
- A distinctive speech, signal, or conversation-inspired symbol.
- Small orange signature strokes.
- Consistent serial numbering.
- Original separators and section markers.

Graphics must support the interface instead of becoming the subject of the interface.

Do not place every graphic on every page.

Use one or two distinctive graphic treatments in a section, then allow the content to breathe.

Decorative elements must never obscure text, reduce contrast, block interactions, or create unnecessary rendering cost.

==================================================
05. GLOW AND LIGHTING
==================================================

Glow is permitted, but it must be controlled.

Use:
- Small orange halos around selected actions.
- Subtle white illumination on focused controls.
- Restrained ambient light behind the brand mark.
- Brief hover illumination.
- A slight orange edge accent for selected navigation.
- Subtle light variation on elevated surfaces.

Avoid:
- Large neon borders.
- Continuously pulsing buttons.
- Glowing outlines around every card.
- Multiple overlapping shadows.
- Large blurred gradients.
- Strong bloom effects.
- Cyberpunk and gaming-HUD aesthetics.

Prefer static shadows and brief opacity or transform transitions.

The application should feel premium and atmospheric, not like a neon gaming interface.

==================================================
06. TYPOGRAPHY AND LAYOUT
==================================================

Typography is a primary design tool.

Do not use Inter, Geist, or Space Grotesk.

Choose a complementary font system after inspecting existing assets and available font-loading methods.

Suggested direction:
- A distinctive editorial sans-serif for headings.
- A highly readable sans-serif for body text.
- An optional restrained monospace face for serial numbers and tiny metadata.

Possible font families to evaluate include Manrope, DM Sans, IBM Plex Sans, and IBM Plex Mono. These are candidates, not mandatory dependencies. Check licensing, availability, and existing project conventions before selecting them.

Use typography to create hierarchy without making every heading enormous.

Define reusable tokens for:
- Font families.
- Font weights.
- Font sizes.
- Line heights.
- Letter spacing.
- Paragraph widths.
- Heading spacing.
- Metadata styling.

Use a consistent spacing scale based on a small set of reusable values.

Do not add arbitrary margins and padding to individual elements without a reason.

Avoid both extremes:
- Everything tightly compressed.
- Excessive empty space that makes the application feel unfinished.

Content density should suit the component. A social feed should display enough useful information to encourage browsing, while post details should prioritize comfortable reading.

==================================================
07. SURFACES, BORDERS AND CARDS
==================================================

Do not treat every component as an individual card.

Use several forms of hierarchy:
- Flat content regions.
- Fine separators.
- Subtle surface changes.
- Small outlined elements.
- Elevated dialogs.
- Limited cards for genuinely grouped content.

Cards should be reserved for content that benefits from separation.

Posts should usually sit naturally in the feed, separated by whitespace and fine borders rather than large rounded containers.

Use rounded corners selectively:
- Buttons and controls may use modest radii.
- Dialogs may use a larger radius.
- Feed items should remain relatively restrained.
- Avoid making every panel excessively rounded.

Shadows should establish elevation, not decoration.

==================================================
08. NAVIGATION AND SOCIAL EXPERIENCE
==================================================

Desktop navigation:
- Compact left navigation.
- Central content-first feed.
- Optional right discovery area.
- Clear active state.
- Consistent custom SVG icons.
- No unnecessary navigation labels or decorative panels.

Primary student navigation:
- Home.
- Search.
- Create.
- Notifications.
- Profile.

Moderators receive access to moderation tools only when authorized.

Mobile navigation should use a compact bottom bar with accessible touch targets.

The main feed must remain the visual priority.

Use category navigation that feels editorial and lightweight, not a long row of oversized pills.

The Create action may be labeled Spill or Spill Something.

Never make navigation dependent on color alone.

==================================================
09. SOCIAL CONTENT REQUIREMENTS
==================================================

Treat posts as the fundamental visual unit of SpillATea.

A post may include:
- Public display identity.
- Anonymous label.
- Public serial number.
- Timestamp.
- Category.
- Title.
- Body.
- Reactions.
- Reply count.
- Share.
- Report.

Prioritize readable text and recognizable interaction controls.

Avoid adding decorative metadata that has no functional purpose.

Do not invent live activity, real user counts, trending rankings, or engagement statistics to fill empty space.

Development fixtures must be clearly separated from production data.

Empty states should be designed intentionally rather than filled with fake posts.

==================================================
10. ANONYMOUS IDENTITY AND SECURITY
==================================================

Anonymous posting is a core product requirement.

Normal students must see:

Anonymous Student
#01

They must not be able to retrieve the author's private name, email, internal author ID, or private profile information through public endpoints.

A moderator may request a hidden identity through a dedicated, server-authorized operation.

The backend must verify:
- Authenticated session.
- Current moderator/admin permissions.
- Access to the requested resource.
- The reason for access where required.
- Successful creation of the required audit record.

Do not return hidden identity data in normal feed responses and hide it with CSS.

Do not rely on a frontend isModerator boolean.

Do not expose service-role keys, private credentials, or privileged database access to the browser.

Record sensitive identity reveals in protected audit logs.

Do not use real personal information in sample posts or test fixtures.

Privacy and security requirements take precedence over visual convenience.

==================================================
11. ACCESSIBILITY AND RESPONSIVENESS
==================================================

Design for desktop, tablet, and mobile.

Prevent:
- Horizontal overflow.
- Clipped content.
- Tiny touch targets.
- Illegible metadata.
- Text hidden behind fixed navigation.
- Dialogs that extend beyond the viewport.
- Hover-only interactions.
- Focus indicators that disappear.
- Controls that depend exclusively on color.

Support keyboard navigation, screen-reader labels, reduced-motion preferences, and adequate contrast.

Do not reduce font size simply to fit a desktop layout onto a mobile screen.

Recompose the layout for the available width.

==================================================
12. MOTION AND INTERACTIONS
==================================================

Animation should communicate state, hierarchy, or feedback.

Use restrained transitions for:
- Hover.
- Focus.
- Selection.
- Menu opening.
- Modal entry.
- Reaction feedback.
- Loading states.
- Navigation changes.

Avoid:
- Constant background movement.
- Scroll-triggered animations on every element.
- Large parallax effects.
- Unnecessary spring animations.
- Excessive staggered entrances.
- Animations that delay access to content.
- Effects that cause layout shifts.

Use transform and opacity where appropriate.

Respect reduced-motion settings.

==================================================
13. ENGINEERING RULES
==================================================

Before making changes:
1. Inspect the repository.
2. Identify the framework and current architecture.
3. Read relevant source files.
4. Understand existing functionality.
5. Plan the files and components affected.

Then:
- Reuse components when appropriate.
- Keep business logic separate from presentation.
- Avoid unnecessary dependencies.
- Preserve existing working features.
- Use types and validation consistently.
- Handle loading, empty, success, and error states.
- Avoid duplicate implementations.
- Keep environment variables and secrets protected.
- Do not fabricate endpoints or data.
- Do not claim that untested features work.

Do not replace the entire application simply because generating a new scaffold is easier.

Do not combine unrelated refactors with a visual redesign.

==================================================
14. PERFORMANCE
==================================================

The application must remain responsive on ordinary college Wi-Fi and mid-range mobile devices.

Avoid unnecessary:
- Large images.
- Video backgrounds.
- Continuous canvas rendering.
- Particle systems.
- Massive blur filters.
- Complex animation libraries.
- Duplicate requests.
- Unbounded feed queries.
- Unnecessary component rerenders.

Use pagination, lazy loading, appropriate database indexes, efficient queries, and image optimization where relevant.

Decorative backgrounds must not intercept clicks or interfere with scrolling.

Use static CSS textures and small SVG assets wherever possible.

==================================================
15. IMPLEMENTATION AND VERIFICATION
==================================================

Work in small, reviewable stages.

For each stage:
1. Inspect the relevant implementation.
2. Explain the planned changes.
3. Modify the actual project.
4. Run appropriate tests and build checks.
5. Fix regressions caused by the changes.
6. Report what was completed.
7. Identify what remains incomplete.

For visual changes, inspect actual rendered pages at desktop and mobile widths whenever screenshot or browser testing is available.

Do not declare a design successful solely because the source code appears correct.

For security-sensitive changes, verify actual authorization and data exposure behavior.

Do not mark a feature complete if it only has a frontend mockup.

==================================================
FINAL PRINCIPLE
==================================================

Every decision must make SpillATea feel more coherent, more useful, more distinctive, or more trustworthy.

The target is not maximum decoration.

The target is a recognizable, content-first social product with sophisticated graphic design, intentional visual hierarchy, original brand details, restrained atmospheric effects, excellent usability, and reliable engineering.

When uncertain, choose the solution that is simpler, more intentional, easier to maintain, and more appropriate for a real social platform.
