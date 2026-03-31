# Website Improvement Work Log

Purpose: Track every action and decision to prevent duplicate work.

## 2026-03-27

### 1. Initial analysis
- Reviewed existing demo structure and code.
- Found heavy template-style e-commerce features (cart, modal checkout demo) not ideal for a one-person operation.
- Decision: rebuild to a direct-order flow.

### 2. Best-practice research snapshot
- Performance impact on retention and conversions: web.dev reference reviewed.
- Local business structured data guidance: Google Search Central reviewed.
- Accessibility baseline: WCAG quick reference reviewed.
- Product schema fields reference reviewed from schema.org.

### 3. Rebuild actions completed
- Replaced index.html with:
  - Semantic structure
  - Local-business focused content
  - Product catalog section
  - Quick request form
  - Contact links for direct channels
  - JSON-LD LocalBusiness baseline
  - Social metadata (OG/Twitter)
- Replaced styles.css with:
  - New design system variables
  - Mobile-first responsive layout
  - Accessible focus states
  - Meaningful but restrained motion
  - Reduced-motion support
- Replaced script.js with:
  - Single config object for business links + products
  - Dynamic product rendering
  - Category filtering
  - One-click prefilled WhatsApp order links
  - Quick request form to WhatsApp
  - Mobile navigation toggle logic

### 4. Open placeholders to update (important)
- WhatsApp number in script.js (whatsappNumber).
- Instagram URL in script.js and JSON-LD.
- Email address in script.js.
- JSON-LD url in index.html.

### 5. Next planned steps
- Replace demo product photos with real product images.
- Add real pickup/delivery policy text.
- Add lightweight analytics event tracking.
- Run Rich Results Test and Lighthouse after deployment.

### 6. Demo polish pass (Serbian + visuals)
- Complete UI localization to Serbian (Latin):
  - Navigation, hero, catalog, process, about, contact, form labels, buttons, footer.
- Updated site metadata text in Serbian and set language to sr.
- Replaced hero and catalog visuals with more product-focused image set for a better demo impression.
- Cleaned and replaced script.js with a single consistent demo logic layer (previous mixed script content removed).
- Kept demo workflow simple and realistic: browse -> WhatsApp inquiry -> manual confirmation.

### 7. Comprehensive code review and hardening pass
- Root issue found: styles.css still had a large legacy block from an older template, causing inconsistent behavior and confusing UI remnants.
- Actions taken:
  - Rebuilt styles.css from scratch (removed dead/conflicting rules).
  - Improved catalog resilience with explicit loading/error/fallback status text.
  - Hardened JS init with guarded listeners and try/catch fallback message.
  - Rewrote customer-facing copy in key sections to remove technical/internal wording.
  - Standardized locale terms (Beograd vs Belgrade in visible UI and structured data).
- Research completed and documented in RESEARCH_NOTES.md.

### 8. Complete from-scratch rebuild (current session)
- Deleted all 3 files (index.html, styles.css, script.js) and rebuilt from zero.
- Brand name: "Mašnica" (placeholder, means bow/ribbon in Serbian).
- New HTML structure:
  - Demo notice banner, sticky header with nav, hero, products (filter + grid), how-to-order (3 steps), about (2-column), delivery (3 options), contact (channels + form), footer (3-column).
  - `lang="sr"` with proper Serbian Latin diacritics throughout.
  - JSON-LD LocalBusiness structured data, Open Graph tags.
  - Skip link, `<noscript>` fallback for catalog.
- New CSS design system:
  - 19 custom properties in `:root`.
  - `color-mix()` for demo notice border.
  - Google Fonts: Fraunces (headings) + Manrope (body).
  - Three responsive breakpoints: 1024px tablet, 768px mobile, 480px small mobile.
  - `prefers-reduced-motion` support.
  - IntersectionObserver-based scroll reveal (`.js .reveal`).
- New JavaScript:
  - Single `config` object with all placeholder data.
  - Dynamic rendering: products, contact channels, social links.
  - Category filter dropdown.
  - WhatsApp deep links with prefilled messages per product.
  - Hamburger menu with animated X toggle.
  - Form → WhatsApp submission.
  - `escapeHtml()` for XSS prevention.

### 9. Image optimization pass
- Replaced all 6 product images with better-fitting Pexels photos (scrunchies, hair ties, accessories).
- Replaced hero and about section images.
- Reduced all product images from 640x800 to 400x400.
- Changed product card aspect-ratio from 4:5 to 1:1 (square).
- Reduced hero image max-height from 580px to 420px.
- Added max-height: 380px to about image.

### 10. Feature additions (research-driven)
Based on UX research and best practices review, added 6 features:
1. **Testimonials section** — 3 placeholder customer reviews (Jelena/Pančevo, Milica/Beograd, Ana/Novi Sad) with star ratings, 3-column grid.
2. **FAQ section** — 6 questions using native `<details>` accordion (materials, production time, custom colors, payment, care, gift wrapping). No extra JS needed.
3. **Payment methods** — Added below delivery options: Gotovina (cash), Uplata na račun (bank transfer), Pouzeće (cash on delivery).
4. **Lead time on products** — Each product card shows "⏱ Izrada: X–Y dana" (1–2 days simple, 2–3 scrunchies, 3–5 sets). Added `leadTime` field to config.
5. **Favicon** — 🎀 ribbon emoji as SVG data URI. No external file needed.
6. **Floating WhatsApp button** — Fixed green button bottom-right, always visible. On mobile ≤768px, text hides, only 💬 icon shows.

### 11. Section reorder (research-driven)
Researched optimal landing page section ordering using NNGroup (113 homepage guidelines, homepage real estate allocation) and Unbounce (anatomy of a landing page). Key finding: social proof should appear immediately after product browse to reinforce trust before showing conversion steps.

**Before:** Hero → Products → How to Order → About → Testimonials → Delivery → FAQ → Contact
**After:** Hero → Products → **Testimonials** → How to Order → About → Delivery → FAQ → Contact

- Moved Testimonials section from after About to right after Products.
- Fixed alternating `section-alt` background classes across all sections to maintain visual rhythm:
  - Products (normal) → Testimonials (alt) → How to Order (normal) → About (alt) → Delivery (normal) → FAQ (alt) → Contact (normal)

### 12. Hair damage liability fixes
User flagged that product performance claims ("doesn't leave marks on hair", "gentle on hair") could create liability if a customer's hair is damaged. Changed all descriptions from claims about what the product WON'T do to factual descriptions of what the product IS.

Changes made:
- **sc-01 product desc** (script.js): "koji ne ostavlja tragove na kosi" → "od glatke tkanine, bez metalnih delova"
- **ht-01 product desc** (script.js): "Izdržljive i nežne prema kosi" → "sa mekanom elastičnom trakom"
- **Milica testimonial** (script.js): "Konačno gumice koje ne kidaju kosu!" → "Odličan kvalitet i prelepe boje!"
- **FAQ materials answer** (index.html): "da budu nežni prema kosi i izdržljivi" → "mekane tkanine bez metalnih kopči ili oštrih delova"

Principle: describe materials and construction (soft satin, no metal parts, elastic band), not performance promises.

### 13. Full layout restructure (research-driven)
User reported the page flow felt disjointed — ordering-related sections were separated by unrelated content, making customers "jump through modules." Conducted thorough research:

**Research sources:**
- NNGroup "Scrolling and Attention" — 57% of viewing time above the fold, 74% in first two screenfuls. Most important content must be highest.
- NNGroup "Information Scent" — Related content near each other strengthens the navigation "scent trail." Breaking context with unrelated content makes users lose the thread.
- Orbit Media "Website Navigation" — Serial position effect: first and last nav items most remembered. Descriptive labels > generic. Navigation order matters.
- HubSpot "Landing Page Best Practices" — Proven structure: Headline → Value prop → Features/Products → Social proof → CTA. Social proof should appear near claims it validates. "Front-load your value."

**Problem identified:** About section sat in the middle of the conversion funnel, separating the ordering process from delivery/payment info. A customer scrolling through "how to order" → "workshop story" → "delivery options" lost the purchasing thread.

**Solution — two-phase page structure:**

| Phase | Sections | User's mental question |
|---|---|---|
| ATTRACT | Hero | "What is this?" |
| TRUST | About | "Who makes these?" |
| BROWSE | Products | "Show me what you sell" |
| VALIDATE | Testimonials | "Are they any good?" |
| BUY | How to Order → Delivery+Payment → FAQ → Contact | "How do I get one?" |

**Before:** Hero → Products → Testimonials → How to Order → **About** → Delivery → FAQ → Contact
**After:** Hero → **About** → Products → Testimonials → How to Order → Delivery → FAQ → Contact

Changes made:
- Moved About section from position 5 (between How to Order and Delivery) to position 2 (right after Hero, before Products)
- About now builds trust/emotional connection BEFORE browsing — handmade-in-Pančevo story is the brand's biggest differentiator
- All purchase/conversion sections (How to Order → Delivery+Payment → FAQ → Contact) are now one uninterrupted block
- Fixed alternating `section-alt` backgrounds: About (alt) → Products (normal) → Testimonials (alt) → How to Order (normal) → Delivery (alt) → FAQ (normal) → Contact (normal)
- Updated header navigation order: Proizvodi | O nama | Naručivanje | Kontakt
- Updated footer navigation order to match

### Current file sizes (approximate)
- index.html: ~340 lines
- styles.css: ~1075 lines
- script.js: ~400 lines

### Open placeholders still to replace with real data
- Phone: "+381 60 000 0000"
- WhatsApp: "381600000000"
- Email: "info@example.com"
- Facebook: "https://facebook.com/masnica.pancevo"
- Instagram: "https://instagram.com/masnica.pancevo"
- Business name: "Mašnica" (placeholder)
- All product images (Pexels stock photos)
- All product names, descriptions, prices
- Testimonials (placeholder names and text)
- Business hours (Pon–Pet 09–18h, Sub 10–14h)

### 14. Font change: Fraunces + Manrope → Playfair Display + Lora
**Research-driven decision.** Analyzed fonts via Google Fonts Knowledge (emotive considerations, pairing typefaces), Awwwards (top 20 Google Fonts), and individual font specimen pages.

**Problem:** Fraunces is a "wonky" serif designed for tech startups — doesn't match a handmade, feminine, artisan brand. Manrope is neutral/cold geometric sans-serif.

**Solution:** Playfair Display (headings) + Lora (body)
- **Playfair Display**: Transitional/Didone serif, high-contrast with delicate hairlines, inspired by 18th-century printing. Top choice for fashion, beauty, and artisan brands. 12 styles (400-900 + italics). Used on 3.38M websites.
- **Lora**: Contemporary serif with calligraphic roots — "brushed curves perfectly convey the mood of a modern-day story." Screen-optimized, variable font. Made by Cyreal (strong Cyrillic/Latin support). Used on 2.15M websites.
- Both have full Serbian Latin diacritics (č, ć, đ, š, ž).
- Pairing rationale: Didone headings (sharp elegance) + Calligraphic body (warm brushed curves) = sufficient contrast without dissonance (per Google Fonts Knowledge pairing guidelines).

**Changes made:**
- `index.html`: Updated Google Fonts `<link>` from Fraunces+Manrope to Playfair Display+Lora
- `styles.css`: Updated `--heading` from `"Fraunces"` to `"Playfair Display"` and `--body` from `"Manrope"` to `"Lora"`
- All other font-family references use CSS custom properties (`var(--heading)`, `var(--body)`) — no other changes needed

### Tech stack summary
- Pure HTML5, CSS3, vanilla JavaScript — no frameworks, no build tools.
- Google Fonts via CDN (Playfair Display + Lora).
- Pexels stock images via CDN.
- Zero dependencies, zero npm packages.

### Future enhancements (parking lot)
- **Real product photos**: Replace Pexels placeholders with Purple Star's actual product photos from Instagram.
- **Real e-commerce**: If product line grows to 20+ items, consider migrating to Shopify or adding Stripe/local payment processor. Note: Stripe doesn't officially operate in Serbia yet; local options include AllSecure, Banca Intesa e-commerce, NestPay.
- **Multi-page**: If product catalog grows significantly or SEO becomes a priority, consider separate pages per category/product.
- **"Prikaži još" button**: When inventory exceeds 12–15 products, add a show-more button to the product grid.
- **Additional filters**: Price range filter, popularity sort (requires tracking).

### 15. Client meeting prep (Serbian-language questions)
- Reviewed and refined CLIENT_MEETING_GUIDE.md questions into Serbian (27 questions across 7 categories)
- Added anticipated client concerns/objections with prepared answers (10 Q&A scenarios)
- Key discovery: Instagram handle is `_purple_star_13` — business name may not be "Mašnica" at all
- Cart functionality noted as future enhancement in parking lot above
- Client meeting scheduled for Monday

### 16. Instagram profile review — critical findings

Reviewed full Instagram profile screenshots for `_purple_star_13`. Major revelations:

**Business name is "Purple Star"** (not Mašnica)
- Has a circular logo: star icon + cursive "Purple Star" text
- Need the original logo file in high resolution (PNG w/ transparent bg)

**Product range is MUCH broader than the current demo:**
- Current demo: only scrunchie gumice za kosu
- Actual products:
  1. **Scrunchie gumice za kosu** — satenske, pliš/velvet, pamučne sa printom
  2. **Trake za kosu** (headbands)
  3. **Ogrlice** (beaded necklaces)
  4. **Minđuše** (earrings)
  5. **Narukvice** (bracelets)
  6. **Setovi** (gift sets — has IG highlight for this)
- This changes the site from "gumice za kosu" site to "handmade ukrasi za kosu i nakit" (hair accessories + jewelry)

**Color/brand identity:**
- Purple is the brand color (💜 used throughout, name is "Purple Star")
- Current demo uses terracotta/narandžasta — **needs to change to purple theme**

**Ordering method:**
- Bio says "Poručivanje → DM" (ordering via Instagram DM)
- Current demo assumes WhatsApp — need to confirm if WhatsApp is even used
- Should likely add Instagram DM as primary ordering channel

**Photography:**
- Photos are genuinely good: colorful, well-lit, consistent white fabric backgrounds
- Patterns/materials visible: satin solids, leopard print, zebra, polka dot, cherry print, confetti/abstract, neon colors, velvet/plush pastels
- Lifestyle product shots with props (books, plants, candles, star decorations)
- Can likely use his real photos on the website

**Social proof:**
- 760 followers, 114 posts — decent traction for a small handmade business
- Has story highlights: "Vaše sličice 💜" (customer photos), "Novogodišnji..." (New Year's collection), "Setovi 💜" (sets), "Vaši utisci 💜" (customer reviews)
- Visible real customer review: "Gumice stigle, prelepe, pogotovo glam kolekcija. Hvala puno i srecni praznici i Vama 🍎❤️"
- Response: "Hvala vama 💜 Drago mi je da vam se sviđaju 🤩💜❤️"
- Mentions "glam kolekcija" — may have named product collections

### 17. Major rebuild — Purple Star rebrand & new business logic

Complete rebuild of all 3 files based on client meeting answers. Backup copies saved as `.bak` files.

**Branding:**
- Renamed from "Mašnica" → "Purple Star" across all files (title, meta, JSON-LD, header, footer)
- Replaced text logo with `<img src="Logo.jpg">` in header and footer
- Color theme changed from terracotta (#c4654a) to purple (#7c3aed) on white (#fafafa)
- Favicon changed from 🎀 to ⭐
- Footer background changed from warm brown to deep navy (#1e1b4b)

**Product display:**
- Replaced 6 mixed products with 10 scrunchie placeholders across 3 material categories
- Categories: Satenske, Plišane, Pamučne (replacing Scrunchie/Gumice/Setovi)
- All products priced at 500 RSD placeholder
- `featured` flag on select products for "Preporučeno" sort order
- Replaced dropdown category filter with pill-style tabs
- Added sort dropdown (Preporučeno / Cena ↑ / Cena ↓ / Naziv A–Ž)
- Product "Naruči" button now scrolls to order form and pre-fills product name

**Order form — FormSubmit.co:**
- Replaced WhatsApp-based form with FormSubmit.co POST form
- Form fields: Ime, Email, Telefon, Način preuzimanja (radio), Adresa (conditional), Narudžbina
- Hidden fields: `_subject`, `_autoresponse` (customer confirmation), `_template` (table), `_honey` (spam), `_captcha`, `_next` (dynamic redirect)
- `_next` set dynamically via JS to current page URL + #contact
- Address field shows/hides based on delivery method selection
- Note: FormSubmit.co requires email activation — first submission to a new email triggers confirmation

**Ordering schedule:**
- Added Sunday noon cutoff logic (Europe/Belgrade timezone)
- Warning banner appears in form when ordering after Sunday noon
- Schedule info displayed in How to Order section and Contact section
- All shipments go out Monday

**Delivery & payment:**
- Reduced from 3 delivery options to 2: Lično u Pančevu (free) + BEX/AKS courier (customer pays)
- Reduced from 3 payment methods to 1: Cash only (pickup or COD)

**Contact channels:**
- Removed: WhatsApp, Facebook, phone number
- Kept: Email + Instagram (@_purple_star_13) only
- Removed floating WhatsApp button entirely
- Updated footer social links to Instagram only

**FAQ updates:**
- Removed custom orders question (no custom orders)
- Added shipping schedule question
- Added delivery cost question
- Updated payment answer (cash only)
- Updated materials answer for scrunchies specifically

**Removed:**
- Demo notice banner
- WhatsApp floating button + all WhatsApp JS functions (waLink, productMessage)
- Facebook references
- Phone number references
- Lead time display on products
- `demo-notice` CSS

**CSS changes:**
- All custom properties updated for purple theme
- Added: `.pill`, `.filter-pills`, `.sort-control`, `.radio-group`, `.radio-label`, `.sunday-notice`, `.order-schedule`, `.logo-img`, `.footer-logo-img`, `.form-fieldset` styles
- Removed: `.wa-float`, `.demo-notice` styles
- Updated all shadow/hover colors from terracotta to purple
- Delivery grid changed from 3-col to 2-col centered layout

**Technical:**
- FormSubmit.co `_autoresponse` sends customer a confirmation email automatically (requires standard POST, not AJAX)
- Honeypot spam field (`_honey`) for bot protection
- `document.addEventListener("DOMContentLoaded", init)` preserved from original

---

## 18. Cart System, Language Fix, Favicon & Scrolling Header (Session 7)

**User feedback after reviewing the Purple Star rebuild:**
Four changes requested: (1) a "fake" shopping cart system, (2) fix language from "scrunchie-je/ji/ja" to "Scrunchies", (3) purple favicon, (4) header turns purple on scroll.

### Changes made:

**Cart system (localStorage-based, no backend):**
- Added cart toggle button (🛒) with live count badge in header
- Added cart drawer (slide-in from right) with overlay, items list, quantity controls, remove buttons, total, and "Nastavi na narudžbinu" checkout button
- Cart persists in localStorage (`purplestar_cart` key)
- Product cards now show "Dodaj u korpu" button with brief "✓ Dodato!" feedback animation
- Checkout flow: clicking "Nastavi na narudžbinu" closes drawer → scrolls to #contact → form shows order summary + hidden field with itemized cart data
- Form submission blocked with alert if cart is empty
- Hidden `Narudžbina` field contains all cart items + total, sent via FormSubmit.co
- `#form-cart-summary` div renders cart contents visually inside the form
- Old `Narudžbina` textarea replaced with optional `Napomena` (notes) textarea
- How to Order steps updated for cart workflow: Dodaj u korpu → Naruči → Preuzmi ili primi

**Language fix:**
- All "scrunchie-ji", "scrunchie-je", "scrunchie-ja" → "scrunchies" throughout HTML
- Testimonials in script.js config updated ("scrunchie-ja" → "scrunchies", "scrunchie-ji" → "scrunchies")
- More natural in Serbian context; user preference

**Purple SVG favicon:**
- Replaced emoji ⭐ favicon with inline SVG: purple circle (#7c3aed) with white ★
- Works across all browsers, matches brand color

**Scrolling purple header:**
- JS scroll listener adds `.scrolled` class to `.site-header` when scrollY > 60px
- CSS: `.site-header.scrolled` gets purple bg (rgba(124,58,237,.95)), white nav links, white logo, white cart icon
- Smooth transition via CSS `transition: background .3s, box-shadow .3s`
- Mobile responsive updated for scrolled state

**HTML structure changes:**
- Header: wrapped nav-toggle + new cart-toggle in `.header-actions` div
- Added `#cart-overlay` div + `#cart-drawer` aside (with header/body/footer sections)
- Form: replaced order textarea with hidden `#cart-order-data` field + `#form-cart-summary` display div

**CSS additions:**
- `.header-actions`, `.cart-toggle`, `.cart-count` badge
- `.cart-overlay`, `.cart-drawer` (full drawer system with open/close transitions)
- `.cart-item` (3-col grid: 56px img | info | actions), `.cart-qty` controls, `.cart-item-remove`
- `.cart-drawer-footer`, `.cart-total`, `.cart-checkout-btn`
- `.form-cart-summary`, `.form-cart-line`
- `.site-header.scrolled` + all child selector overrides

**script.js rewrite:**
- Added: `getCart()`, `saveCart()`, `addToCart()`, `removeFromCart()`, `updateCartQty()`, `getCartTotal()`, `getCartCount()`, `findProduct()`
- Added: `renderCartUI()`, `openCart()`, `closeCart()`, `updateFormCartData()`
- Added: `setupScrolledHeader()` — passive scroll listener
- Added: `setupFormValidation()` — blocks submit on empty cart
- Updated: `renderProducts()` — "Dodaj u korpu" buttons with add-to-cart listeners
- Updated: `getElements()` — removed `orderTextarea`, added all cart/drawer/form element refs
- Removed: old `data-product` anchor links and `orderTextarea` prefill logic
- IntersectionObserver scroll reveal preserved
- `prefers-reduced-motion` support preserved

### Status as of session 17
- Site rebranded to Purple Star with purple-on-white theme
- 10 placeholder scrunchie products in 3 categories
- FormSubmit.co order form (needs email activation for production)
- Email + Instagram only contact channels
- BEX/AKS shipping + Pančevo pickup, cash only
- Sunday noon ordering cutoff with visual warning
- Old files preserved as .bak backups
- Placeholder email (info@example.com) used throughout — replace with real email before launch

**Sells at physical events:**
- One photo shows a market/event display table with ALL products laid out (scrunchies, necklaces, etc.)
- May want a section for upcoming events/sajmovi on the website

**Created MEETING_QUESTIONS_SR.md** — comprehensive Serbian-language meeting guide:
- 33 questions across 8 categories (A–H), all informed by Instagram findings
- 13 anticipated Q&A scenarios from friend's perspective with prepared answers
- 7 critical follow-up items flagged

---

## Status as of 2026-03-27 — READY FOR MONDAY MEETING

### What exists:
| File | Lines | Purpose |
|------|-------|---------|
| index.html | ~340 | Demo site (Serbian, single-page, responsive) |
| styles.css | ~1075 | Full design system + responsive layout |
| script.js | ~400 | All site logic, config, rendering |
| WORK_LOG.md | this file | Complete decision + change log |
| CLIENT_MEETING_GUIDE.md | ~200 | English meeting guide + pricing + hosting |
| MEETING_QUESTIONS_SR.md | ~230 | Serbian meeting questions + anticipated Q&A (informed by Instagram) |
| RESEARCH_NOTES.md | — | UX/design research from earlier sessions |
| BEST_PRACTICES.md | — | Web development best practices reference |

### What needs to happen after the meeting:
1. **Rebrand**: "Mašnica" → "Purple Star" (name, logo, meta tags, JSON-LD, footer, header)
2. **Color scheme**: Terracotta → Purple (CSS custom properties — should be ~5 variable changes)
3. **Expand product categories**: Add nakit section (ogrlice, minđuše, narukvice) + trake za kosu
4. **Update Instagram URL**: `masnica.pancevo` → `_purple_star_13` in script.js config
5. **Confirm ordering channel**: DM? WhatsApp? Viber? All of them?
6. **Replace all placeholder data**: Real products, prices, photos, contact info, story, testimonials
7. **Add logo**: Replace text logo with actual Purple Star logo image
8. **Site description update**: From "gumice za kosu" to "handmade ukrasi za kosu i nakit"

### Placeholders still to replace (full list):
- Business name: "Mašnica" → "Purple Star"
- Phone: "+381 60 000 0000" → real number
- WhatsApp: "381600000000" → real number
- Email: "info@example.com" → real email
- Facebook: "https://facebook.com/masnica.pancevo" → real URL
- Instagram: "https://instagram.com/masnica.pancevo" → "https://instagram.com/_purple_star_13"
- All 6 product images → real photos
- All product names/descriptions/prices → real data
- 3 testimonials → real customer reviews
- Business hours → confirmed hours
- JSON-LD telephone, email → real data
- OG meta title/description → updated for Purple Star
- `<title>` tag → "Purple Star | Handmade ukrasi za kosu i nakit — Pančevo"
