# Purple Star — Project Reference

> **Last updated:** 2026-04-07
> **Purpose:** Single source of truth for the current state of the project, key decisions, and next steps.
> **History:** This file consolidates 25 development iterations spanning 2026-03-27 through 2026-04-06. The original chronological log was replaced with this current-state reference to reduce noise and prevent confusion between what was planned vs. what was actually built.

---

## 1. Project Overview

| Field | Value |
|-------|-------|
| **Brand** | Purple Star |
| **Product** | Handmade scrunchies (satin, plush, cotton) |
| **Location** | Pančevo, Serbia |
| **Market** | Serbian consumers (Serbian language, RSD pricing) |
| **Instagram** | [@_purple_star_13](https://instagram.com/_purple_star_13) |
| **Tech stack** | Pure HTML5, CSS3, vanilla JavaScript — no frameworks, no build tools |
| **Dependencies** | Google Fonts (DM Serif Display + DM Sans), Phosphor Icons (CDN), Pexels images (CDN) |
| **Hosting** | Not yet deployed — planned for Netlify/Cloudflare Pages (free) |

---

## 2. Current State (What's Actually Built)

### Section Order (top to bottom)

```
Header (sticky, turns dark on scroll)
  └── Logo — Nav (Proizvodi | O nama | Naručivanje | Kontakt) — Cart icon — Hamburger

1. Hero              — Headline, description, 2 CTAs, product image
2. Marquee strip     — Scrolling text banner (brand values)
3. Products          — Filter pills (Sve + 3 categories) + sort dropdown + 3-col grid
4. Testimonials      — 3 customer review cards
5. How to Order      — 3-step visual guide + Monday shipping schedule notice
6. Delivery          — 2 cards (pickup + courier) + payment info (cash only)
7. About             — 2-column text + image layout
8. FAQ               — 6-item native <details> accordion
9. Contact           — Info + channels (left) + inquiry form (right)

Footer (3-column: brand/location | nav links | social)
```

### Cart System

- **Storage:** localStorage (`purplestar_cart` key)
- **UI:** Slide-out drawer from right with overlay
- **Flow:** 3 steps inside drawer:
  1. Cart items (quantity controls, remove, total)
  2. Checkout form (name, email, phone, delivery method, conditional address, note)
  3. Order confirmation (success icon, order summary, email note)
- **Submission:** AJAX POST to FormSubmit.co (`/ajax/` endpoint)
- **Feedback:** Toast notifications on add-to-cart ("Pogledaj korpu" action button)
- **Desktop:** Drawer expands from 400px → 560px during checkout (`.checkout-mode`)

### Design System

| Token | Value | Notes |
|-------|-------|-------|
| **Brand color** | `#c9a087` (warm caramel) | Gradient buttons with `--brand-dark: #a67a5b` |
| **Background** | `#faf7f4` (warm off-white) | |
| **Surface** | `#ffffff` | Cards, forms |
| **Surface-alt** | `#f3eeea` | Alternating section backgrounds |
| **Text** | `--neutral-700` (`#3d3730`) | Warm-tinted neutrals, not pure grey |
| **Text muted** | `--neutral-500` (`#6e6860`) | |
| **Accent rose** | `#d4a0a0` | Testimonial stars |
| **Accent sage** | `#9caa97` | Category badges |
| **Accent** | `#8b7d6b` | Labels, secondary elements |
| **Heading font** | DM Serif Display | Warm, elegant serif |
| **Body font** | DM Sans | Clean geometric sans by same designer (Colophon Foundry) |
| **Icons** | Phosphor Icons | Regular weight, via CDN |
| **Border radius** | 10px / 18px / 32px / 999px | sm / default / lg / pill |
| **Container** | 1100px max | `min(var(--container), calc(100% - 2rem))` |
| **Shadows** | 3 levels | Warm-tinted `rgba(60, 40, 20, .05/.08/.10)` |

### Responsive Breakpoints

| Breakpoint | Layout changes |
|------------|---------------|
| ≤1024px | Hero/about/contact → single column, footer → 2-col |
| ≤768px | Hamburger menu, product grid → 2-col, steps/delivery/testimonials → 1-col |
| ≤480px | Product grid → 1-col, hero CTAs stack vertically |
| `prefers-reduced-motion` | All animations/transitions disabled |

### Accessibility

- Skip link (`Preskoči na sadržaj`)
- Semantic HTML landmarks (header/nav/main/sections/footer)
- `aria-label` on nav, cart drawer, buttons
- `aria-live="polite"` on product grid and toast container
- `aria-expanded` on hamburger menu
- Focus-visible outlines (`3px solid var(--brand)`)
- All form inputs properly labeled
- `noscript` fallback for product catalog
- Min touch targets 44×44px on buttons

### SEO & Structured Data

- `lang="sr"`, `<meta name="theme-color" content="#c9a087">`
- Descriptive `<title>` and `<meta description>` in Serbian
- Open Graph tags (title, description, type, locale)
- JSON-LD `LocalBusiness` (name, description, address: Pančevo RS, areaServed)
- Favicon: `favicon-32x32.png`
- Logo: `Logo.jpg`

### Approximate File Sizes

| File | Lines | Purpose |
|------|-------|---------|
| `index.html` | ~510 | Complete single-page site |
| `styles.css` | ~1,950 | Full design system + responsive + cart drawer |
| `script.js` | ~990 | Config, cart, rendering, form handling, UI logic |

---

## 3. Open Placeholders (Must Replace Before Launch)

| Placeholder | Current value | Where |
|-------------|---------------|-------|
| **Email** | `info@example.com` | script.js config, FormSubmit action URLs (both forms), JSON-LD |
| **FormSubmit activation** | Not activated | First POST to real email triggers FormSubmit.co confirmation email |
| **Product images** | Pexels stock photos via CDN | script.js config (10 products) |
| **Product names** | Generic placeholders ("Satenski scrunchie — Klasik", etc.) | script.js config |
| **Product prices** | All 500 RSD | script.js config |
| **Product descriptions** | Generic placeholder text | script.js config |
| **Testimonials** | Fake names (Jelena M., Milica S., Ana T.) | script.js config |
| **Logo** | `Logo.jpg` exists but need confirmed high-res version | Header + footer `<img>` |
| **Hero image** | Pexels stock photo | index.html |
| **About image** | Pexels stock photo | index.html |
| **OG meta image** | Not set | index.html `<head>` |
| **JSON-LD email** | `info@example.com` | index.html `<script type="application/ld+json">` |
| **Copyright year** | 2026 | Footer — verify matches launch year |

---

## 4. Key Decisions & Rationale

### Brand & Identity
| Decision | Choice | Why |
|----------|--------|-----|
| Brand name | "Purple Star" | Confirmed from client's Instagram (@_purple_star_13). Originally "Mašnica" placeholder. |
| Color palette | Warm earthy (caramel `#c9a087`) | Evolved through terracotta → purple → current warm palette. Despite "Purple" in name, warm earthy tones better suit handmade artisan feel. Worth discussing with client. |
| Typography | DM Serif Display + DM Sans | Same designer (Colophon Foundry) guarantees harmony. Evolved: Fraunces+Manrope → Playfair Display+Lora → DM Serif Display+DM Sans. Full Serbian diacritics support. |
| Product scope | Scrunchies only (for now) | Instagram shows broader range (jewelry, headbands) but site focuses on scrunchies with 3 material categories: Satenske, Plišane, Pamučne. |

### Ordering & Contact
| Decision | Choice | Why |
|----------|--------|-----|
| Order method | FormSubmit.co AJAX | Lightweight, free, no backend. AJAX submission keeps user in-app (no redirect). Autoresponse email to customer. |
| Contact channels | Email + Instagram only | Client uses Instagram DM for orders. WhatsApp/Facebook/phone removed — client doesn't use them. |
| Payment | Cash only | Pickup cash or COD (pouzeće). No online payment — would require registered business entity in Serbia. |
| Delivery | Pančevo pickup (free) + BEX/AKS courier | Client pays nothing for pickup. Courier cost on buyer. |
| Shipping schedule | Mondays only, Sunday noon cutoff | JS checks Belgrade timezone. Warning banner appears in form after Sunday noon. |

### Technical
| Decision | Choice | Why |
|----------|--------|-----|
| No frameworks | Pure HTML/CSS/JS | Zero dependencies, fast load, simple hosting, easy maintenance. No build step needed. |
| Cart in localStorage | Client-side only | Appropriate for scale. Server-side cart is overkill for <20 products. |
| No individual product pages | Single-page catalog | Small catalog doesn't justify multi-page. Add later if catalog grows. |
| FormSubmit.co over Google Sheets | Simpler for now | Google Sheets backend is planned as Phase 2 (see GOOGLE_SHEETS_CART_PLAN.md). |
| Scroll reveal animations | IntersectionObserver | Lightweight, no library needed. Respects `prefers-reduced-motion`. |
| Sticky header color change | Dark on scroll | Adds depth. JS adds `.scrolled` class at 60px scroll threshold. |

### Content
| Decision | Choice | Why |
|----------|--------|-----|
| No hair damage claims | Describe materials, not performance | Liability risk — "doesn't break hair" could be used against the brand if hair is damaged. Describe what the product IS (soft satin, no metal parts), not what it WON'T do. |
| No fake sales/discounts | Honest everyday pricing | Permanent fake markdowns destroy trust. Use real discounts only for genuine promotions. |
| Unique product descriptions | Each product gets specific text | Copy-pasted descriptions hurt SEO and customer trust (competitor Lenkika.rs does this — see analysis). |
| Serbian language throughout | `lang="sr"`, all UI text in Serbian | Target market is Serbian consumers. Product names use English color/style names (fashion convention). |

---

## 5. Features Removed (and Why)

These were in earlier iterations but deliberately removed based on client input or design decisions:

| Feature | Removed in | Reason |
|---------|-----------|--------|
| WhatsApp ordering | Session 17 | Client doesn't use WhatsApp — orders via Instagram DM |
| Floating WhatsApp button | Session 17 | Removed with WhatsApp |
| Facebook links | Session 17 | Client not active on Facebook |
| Phone number display | Session 17 | Client prefers Instagram DM over phone |
| Lead time on product cards | Session 17 | Removed for cleaner cards — all ship Monday anyway |
| Demo notice banner | Session 17 | No longer a demo |
| Custom orders FAQ item | Session 17 | Client doesn't do custom orders |
| 3 payment methods | Session 17 | Reduced to cash only (was: cash + bank transfer + COD) |
| 3 delivery options | Session 17 | Reduced to 2 (was: pickup + BEX + AKS as separate, now BEX/AKS combined) |

---

## 6. Next Steps

### Phase 2: Google Sheets Backend (documented in GOOGLE_SHEETS_CART_PLAN.md)
- Products, categories, testimonials fetched from Google Sheet instead of hardcoded config
- Stock tracking with auto-decrement on order
- Stock badges on product cards (low stock / sold out)
- Custom HTML order emails via Apps Script
- Order history in spreadsheet
- Owner can update products by editing spreadsheet rows

### Features to Consider Adding
| Feature | Priority | Notes |
|---------|----------|-------|
| **WhatsApp/Viber integration** | High | Key channel for Serbian e-commerce. Floating button + direct ordering. |
| **Mobile bottom navigation bar** | High | Pattern from Lenkika analysis — keeps Proizvodi/Korpa/Naruči within thumb reach. |
| **Product detail modal/page** | Medium | Quick-view with image gallery, full description, related products. |
| **Image gallery with zoom** | Medium | Multiple product photos with lightbox. Depends on client providing photos. |
| **Material badges on cards** | Medium | Small colored tag: "Saten" / "Pliš" / "Pamuk" for quick visual filtering. |
| **Related products section** | Medium | "Pogledaj i ove" — 3-4 similar items. Increases engagement. |
| **Wishlist** | Low | localStorage-based save-for-later. Low priority for small catalog. |
| **Search** | Low | Not needed until catalog exceeds ~30 products. |
| **Breadcrumbs** | Low | Only relevant if/when individual product pages are added. |

### Pre-Launch Checklist
- [ ] Replace ALL placeholder data (see Section 3)
- [ ] Activate FormSubmit.co with real email address
- [ ] Get high-res logo file from client (PNG with transparent background)
- [ ] Get real product photos from client
- [ ] Write real product descriptions with client
- [ ] Collect real testimonials (with permission)
- [ ] Proofread all Serbian text with native speaker
- [ ] Run Lighthouse audit
- [ ] Run Google Rich Results Test
- [ ] Test on real mobile device
- [ ] Test full order flow end-to-end
- [ ] Set up domain (optional — can use free hosting URL initially)
- [ ] Deploy to Netlify/Cloudflare Pages

---

## 7. Project File Inventory

| File | Purpose |
|------|---------|
| `index.html` | Complete single-page website |
| `styles.css` | Full design system + responsive layout |
| `script.js` | All site logic, config data, rendering |
| `Logo.jpg` | Purple Star logo |
| `favicon-32x32.png` | Browser tab icon |
| `WORK_LOG.md` | This file — project reference |
| `THE_BIG_UPDATE.md` | 5-phase enhancement roadmap (Sheets backend → Product UX → Mobile nav → WhatsApp → Launch) |
| `GOOGLE_SHEETS_CART_PLAN.md` | Phase 1 backend integration spec (referenced by THE_BIG_UPDATE) |
| `Lenkika.rs - Full Analysis & Inspiration.md` | Competitor analysis (source material for THE_BIG_UPDATE) |
| `BEST_PRACTICES.md` | Web development guidelines |
| `RESEARCH_NOTES.md` | UX/performance research from early sessions |

---

*Files removed on 2026-04-07 (obsolete): GOOGLE_SHEETS_INTEGRATION_PLAN.md (superseded by CART_PLAN), WEBSITE_REDESIGN_PLAN.md (fully implemented), CLIENT_MEETING_GUIDE.md (meeting completed), MEETING_QUESTIONS_SR.md (meeting completed), index.html.bak / styles.css.bak / script.js.bak (outdated backups).*