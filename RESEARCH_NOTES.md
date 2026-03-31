# Research Notes - Demo Website Best Practices

Date: 2026-03-27
Scope: Small-business handmade hair accessories demo website (Pancevo/Beograd)

## Sources reviewed
- Google Search Central: SEO Starter Guide
- web.dev: Why speed matters
- web.dev: Optimize Cumulative Layout Shift (CLS)
- Google Search Central: LocalBusiness structured data
- W3C WCAG quick reference (2.1)
- Nielsen Norman Group: Response Times (0.1s, 1s, 10s)

## Key findings and practical implications

### 1) Business-fit UX for a solo owner
- For a one-person business, simple direct inquiry flow is often better than full checkout complexity in a demo.
- A clear user path improves trust: browse products -> send inquiry -> manual confirmation.
- Keep CTA consistent and obvious on every key section.

### 2) Performance and perceived quality
- Fast loading directly affects retention and conversions (web.dev guidance and case studies).
- Human response-time expectations:
  - ~0.1s feels instant
  - ~1s keeps user flow
  - ~10s requires explicit progress feedback
- Demo implication: avoid heavy frameworks, avoid unnecessary runtime complexity.

### 3) Prevent empty or shifting sections (CLS)
- Common CLS causes: images/content without reserved dimensions.
- Good practice:
  - Provide width and height for images.
  - Reserve space for late-rendered blocks.
  - Avoid injecting content that pushes visible content unexpectedly.
- Demo implication: catalog area should have loading/error/fallback states to avoid large blank spaces.

### 4) Accessibility baseline (WCAG 2.1 AA relevant)
- Provide semantic structure (header/nav/main/sections/footer).
- Maintain keyboard focus visibility.
- Use text alternatives for images.
- Keep adequate contrast and readable typography.
- Include skip link for keyboard users.

### 5) Local SEO fundamentals
- Clear title and description reflecting local service area.
- Keep content people-first, easy to read, and genuinely useful.
- Use meaningful headings and link text.
- Use LocalBusiness structured data with valid fields.
- Keep business data consistent across site and social profiles.

### 6) Content strategy for this niche
- Best-converting content blocks for handmade accessories:
  - Price and lead time per product
  - Clear ordering method
  - Delivery/pickup area and expectations
  - Short trust signals tied to real process
- Avoid technical/internal language in customer-facing sections.

## Audit checklist for future iterations
- Catalog always visible or has explicit loading/error text.
- No dead CSS/JS from previous templates.
- Every image has meaningful alt text and dimensions.
- Mobile navigation and CTA tested on small screens.
- WhatsApp link format valid and message prefill correct.
- Structured data remains truthful (no fake ratings/reviews).

## Decisions applied in this pass
- Simplified and clarified section copy in Serbian.
- Added catalog loading/fallback status text.
- Hardened JS init with guarded listeners and error fallback message.
- Removed legacy conflicting CSS and rebuilt stylesheet cleanly.
- Kept architecture lightweight and demo-appropriate.
