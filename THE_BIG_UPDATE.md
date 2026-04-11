# THE BIG UPDATE — Purple Star Enhancement Plan

> **Created:** 2026-04-07
> **Purpose:** Comprehensive, prioritized roadmap for upgrading the Purple Star website from its current single-page state to a fully dynamic, conversion-optimized storefront.
> **Source material:** [Lenkika.rs — Full Analysis & Inspiration](Lenkika.rs%20-%20Full%20Analysis%20%26%20Inspiration.md) (competitive analysis) + [Google Sheets Cart Plan](GOOGLE_SHEETS_CART_PLAN.md) (backend spec) + current codebase audit.
> **Tech constraint:** Pure HTML5, CSS3, vanilla JavaScript — no frameworks, no build tools.

---

## Overview

5 phases, ordered by dependency. Phase 1 is the foundation that enables Phases 2–4. Phase 3 can run in parallel with Phase 2. Phase 5 is the final gate before going live.

```
Phase 1: Google Sheets Backend ──────┐
                                     ├──▶ Phase 2: Product Experience
Phase 3: Mobile Bottom Nav ──────────┤    (depends on Phase 1)
         (parallel, no deps)         │
                                     ├──▶ Phase 4: WhatsApp/Viber
                                     │    (needs client number)
                                     │
                                     └──▶ Phase 5: Pre-Launch Checklist
                                          (after all phases)
```

---

## Phase 1: Google Sheets Backend (FOUNDATION)

> **Complexity:** Large
> **Depends on:** Nothing — this is the first phase
> **Blocks:** Phase 2 (NOVO/sale badges need date/price fields from Sheet)
> **Full spec:** See [GOOGLE_SHEETS_CART_PLAN.md](GOOGLE_SHEETS_CART_PLAN.md) for complete implementation details

This phase replaces all hardcoded data and FormSubmit.co with a Google Sheets backend + Apps Script API. The owner will manage products, testimonials, and orders by editing a spreadsheet — no code changes needed for day-to-day operations.

### Step 1.1 — Create Google Sheet (5 tabs)

**Tab: Proizvodi (Products)** — 10 columns:

| Column | Type | Notes |
|--------|------|-------|
| ID | Text | Unique slug, e.g. `sat-01` |
| Naziv | Text | Product name |
| Kategorija | Text | Must match Kategorije tab keys: `satenske`, `plisane`, `pamucne` |
| Cena | Number | Price in RSD |
| Stanje | Number | Stock count — drives stock badges (Phase 1) |
| Slika | URL | Primary product image |
| Alt tekst | Text | Image alt text for accessibility |
| Opis | Text | Product description |
| Istaknuto | TRUE/FALSE | Featured products sort first |
| Aktivno | TRUE/FALSE | FALSE hides product from site without deleting row |

**Tab: Kategorije** — 2 columns:

| Column | Type | Notes |
|--------|------|-------|
| Ključ | Text | Category slug: `satenske`, `plisane`, `pamucne` |
| Naziv | Text | Display name: `Satenske`, `Plišane`, `Pamučne` |

**Tab: Narudžbine (Orders)** — Header row only (auto-populated by Apps Script):

| Column | Auto-filled by |
|--------|----------------|
| Datum | Apps Script timestamp |
| ID narudžbine | Generated: `PS-YYYYMMDD-XXXX` |
| Ime | Customer form |
| Email | Customer form |
| Telefon | Customer form |
| Preuzimanje | Delivery method |
| Adresa | Conditional (courier only) |
| Napomena | Optional note |
| Stavke | JSON cart items |
| Ukupno | Calculated total |
| Status | Default: "Nova" |

**Tab: Utisci (Testimonials)** — 4 columns:

| Column | Type | Notes |
|--------|------|-------|
| Ime | Text | Customer name |
| Tekst | Text | Review text |
| Lokacija | Text | City |
| Aktivno | TRUE/FALSE | Show/hide toggle |

**Tab: Podešavanja (Settings)** — Key-value pairs:

| Key | Default | Purpose |
|-----|---------|---------|
| `email_vlasnika` | (client email) | Order notification recipient |
| `prag_niska_zaliha` | 5 | Stock count ≤ this → amber "Još samo X!" badge |
| `prag_kriticna_zaliha` | 2 | Stock count ≤ this → red "Poslednji komadi!" badge |

### Step 1.2 — Write Apps Script (`Code.gs`)

Two endpoints deployed as a web app (Anyone can access, Execute as me):

**`doGet(e)`** — Returns JSON:
```json
{
  "products": [],
  "categories": [],
  "testimonials": [],
  "settings": {}
}
```

**`doPost(e)`** — Handles two types:
- **Orders:** Validates cart, creates order row in Narudžbine, decrements stock in Proizvodi (using `LockService` for concurrency), generates order ID (`PS-YYYYMMDD-XXXX`), sends HTML email to owner + confirmation email to customer
- **Inquiries:** Logs contact form submissions, sends email to owner

**Critical CORS note:** Use `Content-Type: text/plain;charset=utf-8` (NOT `application/json`) to avoid preflight → 405 error. Use `redirect: "follow"` to handle Apps Script's 302 redirect. Always deploy a **new version** after code changes.

### Step 1.3 — Modify `script.js`

| Change | Detail |
|--------|--------|
| **Remove** | `config.products` array (~50 lines), `config.categories` object (~5 lines), `config.testimonials` array (~20 lines) |
| **Add to config** | `APPS_SCRIPT_URL: "https://script.google.com/macros/s/.../exec"` |
| **Add function** | `fetchSiteData()` — GET request to Apps Script, caches response in `sessionStorage` with 60-second TTL. On failure: show `.error-banner` with Instagram DM fallback link |
| **Modify** | `renderProducts(els)` — data source changes from `config.products` to fetched `siteData.products`. Add stock badge HTML inside card template |
| **Modify** | `renderTestimonials(els)` — data source changes from `config.testimonials` to fetched `siteData.testimonials` |
| **Modify** | `setupFormValidation(els)` — replace FormSubmit.co AJAX URL with Apps Script POST. Change `Content-Type` to `text/plain`. Add `redirect: "follow"` |
| **Add function** | `renderStockBadge(stock, settings)` — returns badge HTML based on thresholds from Podešavanja |
| **Modify** | `init()` — call `fetchSiteData()` first, then render products/testimonials with fetched data. Show loading skeleton while fetching |

**Stock badge logic in `renderProducts()`:**

| Stock level | Badge | Card behavior |
|-------------|-------|---------------|
| > `prag_niska_zaliha` (default 5) | No badge | Normal |
| 3–5 | `<span class="stock-badge stock-low">Još samo X!</span>` | Normal |
| 1–2 | `<span class="stock-badge stock-critical">Poslednji komadi!</span>` | Normal |
| 0 | Red overlay + `<span class="stock-badge stock-out">Rasprodato</span>` | `.btn-add-cart` disabled, card dimmed |

### Step 1.4 — Modify `index.html`

- Remove FormSubmit.co hidden fields: `_next`, `_autoresponse`, `_template`, `_captcha` from both `#order-form` and `#inquiry-form`
- Add loading skeleton inside `#product-grid`:
  ```html
  <div class="loading-skeleton" id="products-loading">
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
  </div>
  ```
- Add error banner (hidden by default):
  ```html
  <div class="error-banner" id="error-banner" hidden>
      <p>Došlo je do greške pri učitavanju. <a href="https://instagram.com/_purple_star_13">Pišite nam na Instagram</a></p>
      <button class="btn btn-small" onclick="location.reload()">Pokušaj ponovo</button>
  </div>
  ```

### Step 1.5 — Add to `styles.css`

New component styles:

| Selector | Purpose |
|----------|---------|
| `.stock-badge` | Base: font-size .72rem, font-weight 700, padding .2rem .6rem, border-radius `var(--radius-pill)`, absolute position on product card image |
| `.stock-low` | background: `rgba(245, 158, 11, .15)`, color: `#92400e` (amber) |
| `.stock-critical` | background: `rgba(239, 68, 68, .15)`, color: `#991b1b` (red) |
| `.stock-out` | background: `var(--danger)`, color: white |
| `.product-card.out-of-stock` | opacity: 0.6, pointer-events on image/name only |
| `.product-card.out-of-stock .btn-add-cart` | pointer-events: none, opacity: 0.5, cursor: not-allowed |
| `.loading-skeleton` | display: grid matching `.product-grid` columns |
| `.skeleton-card` | height: 320px, border-radius: `var(--radius)`, background: linear-gradient shimmer animation |
| `@keyframes shimmer` | Background position animation (pulse effect) |
| `.error-banner` | text-align: center, padding: 2rem, color: `var(--danger)`, border: 1px solid currentColor |

### Step 1.6 — Testing Checklist

- [ ] Seed Google Sheet with current 10 products (copy data from `config.products`)
- [ ] Load site → products render from API (not hardcoded)
- [ ] Filter pills work with fetched categories
- [ ] Sort dropdown works with fetched products
- [ ] Testimonials render from Utisci tab
- [ ] Place a test order → check Narudžbine sheet for new row
- [ ] Verify owner receives HTML email with order table
- [ ] Verify customer receives confirmation email
- [ ] Set a product stock to 4 → amber badge appears
- [ ] Set stock to 1 → red badge appears
- [ ] Set stock to 0 → "Rasprodato" overlay, button disabled
- [ ] Disconnect internet → error banner shows with Instagram fallback
- [ ] Reconnect → click "Pokušaj ponovo" → data loads

---

## Phase 2: Product Experience Enhancements

> **Complexity:** Medium-Large
> **Depends on:** Phase 1 (needs dynamic data from Sheets for material, dates, old prices)
> **Blocks:** Nothing
> **Inspiration:** Lenkika.rs analysis §7.2, §7.5, §7.6, §9

6 features that upgrade how customers browse and interact with products.

### Step 2.1 — Material Badges on Product Cards

**Why:** Customers think about scrunchies by material ("I want satin" vs. "I want plush") — Lenkika has material filtering but we can do this more elegantly with visual badges on each card. *(Lenkika analysis §7.2)*

**Sheet change:** Add `Materijal` column to Proizvodi tab (values: `Saten`, `Pliš`, `Pamuk`)

**JS change in `renderProducts()`:**
Add a second `.badge` element after the category badge inside `.product-meta`:
```html
<span class="badge badge-material">{material}</span>
```

**CSS — `.badge-material` variants:**

| Material | Background | Text color |
|----------|-----------|------------|
| Saten | `rgba(201, 160, 135, .15)` | `#8b6f56` (warm gold) |
| Pliš | `rgba(212, 160, 160, .15)` | `#9e6b6b` (soft rose) |
| Pamuk | `rgba(156, 170, 151, .15)` | `#5a7054` (reuse existing sage) |

The `.product-meta` flex row handles wrapping naturally — no layout changes needed.

### Step 2.2 — Quick-View Product Modal

**Why:** Lenkika requires a full page load for product details. We can show full product info in a modal without leaving the catalog — less friction, faster browsing. *(Lenkika analysis §9, hybrid idea #5)*

**HTML — add before `</body>`:**
```html
<div class="product-modal-overlay" id="product-modal-overlay"></div>
<div class="product-modal" id="product-modal" role="dialog" aria-modal="true"
     aria-label="Detalji proizvoda">
    <button class="product-modal-close" id="product-modal-close" aria-label="Zatvori">
        <i class="ph ph-x"></i>
    </button>
    <div class="product-modal-content" id="product-modal-content">
        <!-- Dynamically populated -->
    </div>
</div>
```

**JS — new functions:**

| Function | Purpose |
|----------|---------|
| `openProductModal(els, productId)` | Find product in fetched data, build modal HTML (gallery + info + similar products), show modal with transition, trap focus, disable body scroll |
| `closeProductModal(els)` | Hide modal, restore body scroll, return focus to triggering element |
| `buildModalContent(product, allProducts)` | Returns HTML string: 2-column grid (gallery left, info right) with name, price, badges, full description, qty selector, "Dodaj u korpu" button, and similar products section |

**Open triggers:**
- Click on `.product-card img` → opens modal
- Click on `.product-card h3` → opens modal
- The `.btn-add-cart` button continues to add directly to cart (NO modal)

**Close triggers:**
- Click `.product-modal-close` button
- Click `.product-modal-overlay`
- Press `Escape` key
- Reuse the same pattern as `closeCart(els)`

**CSS:**

| Selector | Styles |
|----------|--------|
| `.product-modal-overlay` | Fixed, full-screen, `rgba(0,0,0,.5)`, backdrop-filter blur, z-index: 1100, opacity transition |
| `.product-modal` | Fixed, centered, max-width: 900px, max-height: 90vh, overflow-y: auto, white background, border-radius: `var(--radius-lg)`, z-index: 1200, transform: `scale(0.95)` + opacity 0 → `scale(1)` + opacity 1 |
| `.product-modal-content` | 2-column grid: `grid-template-columns: 1fr 1fr`, gap: 2rem, padding: 2rem |
| `.product-modal-close` | Absolute top-right, 40px circle, z-index: 1300 |
| `@media (max-width: 768px)` | Modal: width 100vw, height 100vh, border-radius 0, grid → single column |

**Add to `getElements()`:**
```javascript
productModal: document.getElementById("product-modal"),
productModalOverlay: document.getElementById("product-modal-overlay"),
productModalContent: document.getElementById("product-modal-content"),
productModalClose: document.getElementById("product-modal-close")
```

### Step 2.3 — Image Gallery with Zoom

**Why:** Lenkika has multi-image products and zoom — essential for fashion items where customers want to inspect fabric texture. *(Lenkika analysis §7, image gallery)*

**Sheet change:** Add `Slike` column to Proizvodi tab (comma-separated URLs for additional images). Primary `Slika` field remains — `Slike` holds extras.

**Gallery structure inside modal:**
```
┌─────────────────────────────────┐
│                                 │
│         Main Image              │  ← Click opens lightbox
│         (large, centered)       │
│                                 │
├──────┬──────┬──────┬──────┬─────┤
│thumb │thumb │thumb │thumb │     │  ← Horizontal scroll strip
└──────┴──────┴──────┴──────┴─────┘
```

**Lightbox overlay (on main image click):**
- Full-screen dark overlay with centered image
- Close on click anywhere, Escape key, or X button
- CSS `touch-action: pinch-zoom` for mobile zoom

**Fallback:** If product has only 1 image (no `Slike` field), show single image without thumbnail strip.

**CSS additions:**

| Selector | Purpose |
|----------|---------|
| `.gallery-main img` | max-height: 400px, object-fit: contain, cursor: zoom-in, border-radius: `var(--radius)` |
| `.gallery-thumbs` | display: flex, gap: .5rem, overflow-x: auto, padding: .5rem 0 |
| `.gallery-thumb` | 64px × 64px, object-fit: cover, border-radius: `var(--radius-sm)`, cursor: pointer, opacity: 0.6, border: 2px solid transparent |
| `.gallery-thumb.active` | opacity: 1, border-color: `var(--brand)` |
| `.lightbox` | Fixed full-screen, z-index: 1500, background: `rgba(0,0,0,.9)`, display: flex, align/justify: center |
| `.lightbox img` | max-width: 90vw, max-height: 90vh, object-fit: contain |

### Step 2.4 — Similar Products in Modal

**Why:** Cross-selling section boosts engagement and average order value. Lenkika shows 5 "Slični proizvodi" — we show 3-4 with a more personal label. *(Lenkika analysis §7.5, §9 hybrid idea #2)*

**Location:** Below the product info inside `.product-modal-content`

**Section label:** "Pogledaj i ove" ("Check these out too")

**Logic in `buildModalContent()`:**
1. Filter fetched products by same `category`, exclude current product
2. Shuffle remaining, pick first 3-4
3. If same category has < 2 products, show random products from other categories instead
4. Render as mini-cards: image (small square) + name + price
5. Clicking a mini-card calls `openProductModal(els, newProductId)` — swaps modal content without closing

**CSS — `.product-card-mini`:**
- Horizontal layout: 64px square image + text (name + price) side by side
- Border: 1px solid `var(--border)`, border-radius: `var(--radius-sm)`
- Hover: border-color `var(--brand)`, cursor pointer
- Gap: .75rem between mini-cards

### Step 2.5 — "NOVO" Badge on Recent Products

**Why:** Lenkika has a "Nova kolekcija" category but no visual badge on individual cards. A badge creates gentle urgency without fake sales. *(Lenkika analysis §9, hybrid idea #4)*

**Sheet change:** Add `Datum dodavanja` column to Proizvodi tab (date format: YYYY-MM-DD)

**Logic in `renderProducts()`:**
```javascript
var twoWeeksAgo = new Date();
twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
var isNew = product.datumDodavanja && new Date(product.datumDodavanja) >= twoWeeksAgo;
```
If `isNew`, add to card image container:
```html
<span class="badge badge-new">NOVO</span>
```

**CSS — `.badge-new`:**
- Position: absolute, top: 10px, left: 10px (on product card image)
- Background: `var(--brand)`, color: white
- Font-size: .72rem, font-weight: 700, text-transform: uppercase
- Padding: .25rem .6rem, border-radius: `var(--radius-pill)`
- Z-index: 2 (above image)

**Requires:** `.product-card` image container needs `position: relative` (add if missing — already has `overflow: hidden`)

### Step 2.6 — Sale Percentage Badges (Genuine Only)

**Why:** Lenkika uses permanent fake sales (-14% on everything) which destroys credibility. We show percentage badges ONLY for genuine, time-limited promotions. *(Lenkika analysis §7.6, §8.6)*

**Sheet change:** Add `Stara cena` column to Proizvodi tab (number, 0 or blank = no sale)

**Logic in `renderProducts()`:**
```javascript
var isOnSale = product.staraCena && product.staraCena > product.cena;
if (isOnSale) {
    var pct = Math.round((1 - product.cena / product.staraCena) * 100);
    // Add badge + strikethrough price
}
```

**Card changes when on sale:**
- Badge on image (top-right): `<span class="badge badge-sale">-${pct}%</span>`
- Price display: `<del class="price-old">${formatPrice(staraCena)}</del> <span class="price price-sale">${formatPrice(cena)}</span>`

**CSS:**

| Selector | Styles |
|----------|--------|
| `.badge-sale` | position: absolute, top: 10px, right: 10px, background: `var(--danger)`, color: white |
| `.price-old` | font-family: `var(--body)`, font-size: .85rem, color: `var(--text-muted)`, text-decoration: line-through |
| `.price-sale` | color: `var(--danger)`, font-weight: 700 |

**Key decision:** The owner controls sales by setting `Stara cena` in the Sheet. When promotion ends, clear the field — badge disappears automatically. No code deploy needed.

### Phase 2 — Testing Checklist

- [ ] Add `Materijal` to 3-4 products → material badges appear with correct colors
- [ ] Click product image → modal opens with product details
- [ ] Click product name → same modal opens
- [ ] Click "Dodaj u korpu" button → adds to cart (NO modal)
- [ ] Modal shows image gallery with thumbnails for multi-image products
- [ ] Click main image in modal → lightbox opens with zoom
- [ ] "Pogledaj i ove" shows 3-4 related products
- [ ] Click related product → modal content swaps (no close/reopen)
- [ ] Close modal: X button, overlay click, Escape key all work
- [ ] Set `Datum dodavanja` to today → "NOVO" badge appears on card
- [ ] Set `Datum dodavanja` to 15 days ago → no "NOVO" badge
- [ ] Set `Stara cena` > `Cena` → sale badge with correct percentage + strikethrough price
- [ ] Clear `Stara cena` → sale badge disappears
- [ ] Mobile (≤768px): modal goes full-screen, gallery stacks vertically

---

## Phase 3: Mobile Bottom Navigation Bar

> **Complexity:** Small-Medium
> **Depends on:** Nothing — can be built in parallel with Phase 2
> **Blocks:** Nothing
> **Inspiration:** Lenkika.rs analysis §7.1 — their strongest UX feature

Fixed 3-button bar at the bottom of the screen on mobile, keeping key shopping actions within thumb reach at all times. Lenkika uses 4 buttons (Shop, Filters, Wishlist, Cart) — we simplify to 3 buttons aligned with our direct-order flow.

### Step 3.1 — HTML

Add before `</body>` (after footer, before scripts):

```html
<nav class="mobile-bottom-bar" id="mobile-bottom-bar" aria-label="Brza navigacija">
    <button class="bottom-bar-btn" data-target="products" aria-label="Proizvodi">
        <i class="ph ph-storefront"></i>
        <span>Proizvodi</span>
    </button>
    <button class="bottom-bar-btn" data-target="cart" aria-label="Korpa">
        <i class="ph ph-shopping-cart"></i>
        <span class="bottom-bar-badge" id="bottom-bar-cart-count" hidden>0</span>
        <span>Korpa</span>
    </button>
    <button class="bottom-bar-btn" data-target="order" aria-label="Naruči">
        <i class="ph ph-clipboard-text"></i>
        <span>Naruči</span>
    </button>
</nav>
```

### Step 3.2 — CSS

```css
.mobile-bottom-bar {
    display: none;
}

@media (max-width: 768px) {
    .mobile-bottom-bar {
        display: flex;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 60px;
        background: var(--surface);
        border-top: 1px solid var(--border);
        box-shadow: 0 -2px 10px rgba(60, 40, 20, .08);
        z-index: 900;
        justify-content: space-around;
        align-items: center;
        padding-bottom: env(safe-area-inset-bottom);
    }

    body {
        padding-bottom: 70px;
    }

    .toast-container {
        bottom: 80px;
    }
}
```

**`.bottom-bar-btn`:**
- Display: flex, flex-direction: column, align-items: center, gap: 2px
- Background: none, border: none, cursor: pointer
- Min touch target: 44×44px
- Icon: 22px, color: `var(--text-muted)`
- Text: font-size .65rem, font-weight: 600, text-transform: uppercase, letter-spacing: .03em
- Active state (`.active`): icon + text color → `var(--brand)`
- Transition: color 200ms

**`.bottom-bar-badge`:**
- Position: absolute (relative to icon container)
- Top: -4px, right: -8px
- Min-width: 16px, height: 16px, border-radius: 999px
- Background: `var(--brand)`, color: white
- Font-size: .6rem, font-weight: 700

### Step 3.3 — JavaScript

**Add to `getElements()`:**
```javascript
mobileBottomBar: document.getElementById("mobile-bottom-bar"),
bottomBarCartCount: document.getElementById("bottom-bar-cart-count")
```

**Button handlers (add in `init()`):**

| Button | `data-target` | Action |
|--------|---------------|--------|
| Proizvodi | `products` | Smooth scroll to `#products` section, close cart if open |
| Korpa | `cart` | Call `openCart(els)` |
| Naruči | `order` | If cart is empty: smooth scroll to `#how-to-order`. If cart has items: `openCart(els)` then `showCartStep(els, 'checkout')` |

**Cart badge sync — add to `renderCartUI(els)` after updating `els.cartCount`:**
```javascript
if (els.bottomBarCartCount) {
    if (count > 0) {
        els.bottomBarCartCount.textContent = count;
        els.bottomBarCartCount.hidden = false;
    } else {
        els.bottomBarCartCount.hidden = true;
    }
}
```

**Active section highlighting (optional):**
Use IntersectionObserver on main sections (`#products`, `#how-to-order`, `#contact`) to add `.active` class to corresponding bottom bar button as user scrolls. Reuse existing `setupReveal()` observer pattern.

### Phase 3 — Testing Checklist

- [ ] Desktop (>768px): bottom bar is hidden
- [ ] Mobile (≤768px): bottom bar appears fixed at bottom
- [ ] Tap "Proizvodi" → smooth scrolls to products section
- [ ] Tap "Korpa" → cart drawer slides open
- [ ] Add items to cart → badge count appears on Korpa button (synced with header badge)
- [ ] Tap "Naruči" with items in cart → cart opens to checkout step
- [ ] Tap "Naruči" with empty cart → scrolls to "How to Order" section
- [ ] Page content doesn't hide behind the bar (padding-bottom applied)
- [ ] Toast notifications appear above the bar (bottom: 80px)
- [ ] iPhone: safe-area-inset padding prevents bar from overlapping home indicator
- [ ] Cart drawer z-index stays above bottom bar

---

## Phase 4: WhatsApp/Viber Integration

> **Complexity:** Small
> **Depends on:** Client providing their WhatsApp number
> **Blocks:** Nothing
> **Inspiration:** Lenkika.rs analysis §8.11 — their biggest missing feature and a key channel for Serbian e-commerce

### Step 4.1 — Floating WhatsApp Button

**HTML — add before `</body>`:**
```html
<a class="whatsapp-float"
   href="https://wa.me/381XXXXXXXXX"
   target="_blank"
   rel="noopener"
   aria-label="Pišite nam na WhatsApp"
   id="whatsapp-float">
    <i class="ph ph-whatsapp-logo"></i>
</a>
```

**CSS — `.whatsapp-float`:**

| Property | Value |
|----------|-------|
| Position | fixed, bottom: 24px, right: 24px |
| Size | 56px × 56px, border-radius: 50% |
| Background | `#25D366` (WhatsApp green) |
| Color | white, font-size: 28px |
| Shadow | `0 4px 12px rgba(37, 211, 102, .35)` |
| Z-index | 800 |
| Hover | transform: scale(1.08), enhanced shadow |
| Animation | `whatsapp-pulse 2s ease-in-out 3` (3 cycles then stops) |

**Positioning adjustments:**

| Context | Bottom offset |
|---------|--------------|
| Desktop | `bottom: 24px` |
| Mobile with bottom bar (≤768px) | `bottom: 140px` |

**`@keyframes whatsapp-pulse`:**
```css
0%, 100% { box-shadow: 0 4px 12px rgba(37, 211, 102, .35); }
50% { box-shadow: 0 4px 20px rgba(37, 211, 102, .55),
      0 0 0 8px rgba(37, 211, 102, .1); }
```

**Accessibility:** `prefers-reduced-motion` → `animation: none`

### Step 4.2 — WhatsApp Order Button in Cart

**Location:** Inside `.cart-drawer-footer`, below the existing "Nastavi na poručivanje" button

**HTML (dynamically added by JS):**
```html
<a class="btn btn-whatsapp btn-small" id="cart-whatsapp-btn"
   href="#" target="_blank" rel="noopener">
    <i class="ph ph-whatsapp-logo"></i> Naruči putem WhatsApp-a
</a>
```

**New JS function — `buildWhatsAppOrderUrl(cart)`:**
```javascript
function buildWhatsAppOrderUrl(cart) {
    var lines = ["Zdravo! Želim da naručim:\n"];
    cart.forEach(function(item) {
        var product = findProduct(item.id);
        if (!product) return;
        lines.push("• " + product.name + " × " + item.qty +
                    " (" + formatPrice(product.price * item.qty) + ")");
    });
    lines.push("\nUkupno: " + formatPrice(getCartTotal()));
    var text = encodeURIComponent(lines.join("\n"));
    return "https://wa.me/" + config.whatsapp + "?text=" + text;
}
```

**Update `renderCartUI(els)`:**
When cart has items, update the WhatsApp button's `href` with `buildWhatsAppOrderUrl()` result.

**CSS — `.btn-whatsapp`:**
- Background: `#25D366`, color: white
- Hover: background: `#20BD5A`
- Width: 100%, text-align: center
- Margin-top: .5rem

### Step 4.3 — Config & Contact Section

**Add to `config`:**
```javascript
whatsapp: "381XXXXXXXXX",  // PLACEHOLDER — replace with client's number
```

**Modify `renderContactChannels(els)`:**
Add WhatsApp as a third channel below email and Instagram:
```html
<a href="https://wa.me/381XXXXXXXXX" target="_blank" rel="noopener">
    <i class="ph ph-whatsapp-logo"></i> WhatsApp
</a>
```

### Phase 4 — Testing Checklist

- [ ] WhatsApp float button visible bottom-right on desktop
- [ ] Click float → opens WhatsApp with correct number
- [ ] Mobile: float button positioned above bottom nav bar
- [ ] Add 2-3 items to cart → "Naruči putem WhatsApp-a" button visible
- [ ] Click WhatsApp order → WhatsApp opens with pre-filled cart summary
- [ ] Summary includes all items with names, quantities, per-item totals, and grand total
- [ ] Contact section shows WhatsApp alongside email and Instagram
- [ ] `prefers-reduced-motion` → no pulse animation on float button

---

## Phase 5: Pre-Launch Checklist

> **Complexity:** Medium (mostly coordination, not code)
> **Depends on:** All previous phases (or launch with subset complete)
> **Inspiration:** Lenkika.rs analysis §8.1 (template text disaster), §8.2 (typos), §8.4 (generic descriptions), §8.5 (liability claims)

Every item below must be checked before going live. No exceptions. Lenkika's embarrassing template disclaimers on their delivery page prove what happens when you skip this step.

### Step 5.1 — Replace Placeholder Data

| Placeholder | Current value | Action |
|-------------|---------------|--------|
| Email | `info@example.com` | Get real email → update `config.email`, Apps Script action URLs, JSON-LD |
| WhatsApp | `381XXXXXXXXX` | Get number → update `config.whatsapp` |
| Products | 10 hardcoded items, all 500 RSD | Get real data → populate Google Sheet |
| Product images | Pexels stock photos | Get real photos → upload + update Sheet URLs |
| Product descriptions | Generic placeholders | Write unique descriptions WITH client |
| Testimonials | Jelena M., Milica S., Ana T. | Collect real reviews (with permission) |
| Logo | `Logo.jpg` (current) | Get high-res PNG transparent background |
| Hero image | Pexels stock | Get real lifestyle/product photo |
| About image | Pexels stock | Get real photo of client/workspace |
| OG meta image | Not set | Create 1200×630 branded image |
| JSON-LD | Placeholder email, generic desc | Update all fields with real info |
| Copyright year | 2026 | Verify matches launch year |

### Step 5.2 — Activate Integrations

- [ ] **If Phase 1 complete:** Deploy Apps Script → copy URL to `config.APPS_SCRIPT_URL`
- [ ] **If Phase 1 NOT complete:** POST to FormSubmit.co with real email to trigger activation
- [ ] Test data fetch from deployed script URL
- [ ] Test order submission end-to-end with real email
- [ ] Verify owner receives order notification email
- [ ] Verify customer receives confirmation email

### Step 5.3 — Content Quality

These rules come directly from lessons in the Lenkika.rs competitive analysis:

- [ ] **Every product has a UNIQUE description** — no copy-pasted boilerplate *(Lenkika §8.4)*
- [ ] **No hair damage claims** — describe what the product IS (materials, construction), NOT what it WON'T do *(Lenkika §8.5)*
- [ ] **No permanent fake sale prices** — genuine, time-limited promotions only *(Lenkika §8.6)*
- [ ] **No template/placeholder text visible** — search for "example", "placeholder", "lorem", "TODO" *(Lenkika §8.1)*
- [ ] **Native Serbian speaker proofreads ALL text** — every heading, button, label, description *(Lenkika §8.2)*
- [ ] **Product names unique across entire catalog** — no duplicates across categories *(Lenkika §8.7)*
- [ ] **Verify all Serbian diacritics** — č, ć, š, ž, đ render correctly in all browsers

### Step 5.4 — Technical Validation

- [ ] **Lighthouse audit** — Performance ≥90, Accessibility ≥95, Best Practices ≥90, SEO ≥90
- [ ] **Google Rich Results Test** — validate JSON-LD LocalBusiness
- [ ] **Test on real Android phone** (Chrome) — full browse → filter → cart → checkout → submit flow
- [ ] **Test on real iPhone** (Safari) — same flow + verify safe-area for bottom bar
- [ ] **Test error states:** empty cart checkout, API failure fallback, slow network (skeleton visible)
- [ ] **Test Sunday noon cutoff** — warning appears after Sunday 12:00 Belgrade time
- [ ] **Verify HTTPS** on deployed URL
- [ ] **Check all CDN resources** — Google Fonts, Phosphor Icons, product images
- [ ] **Test keyboard navigation** — tab through entire page, all interactive elements reachable
- [ ] **Check `prefers-reduced-motion`** — all animations disabled

### Step 5.5 — Deploy

- [ ] Choose hosting: **Netlify** (recommended) or Cloudflare Pages — both free
- [ ] Push code to GitHub/GitLab (version control)
- [ ] Connect repository to hosting → auto-deploy on push
- [ ] Optional: custom domain or free subdomain initially
- [ ] Verify live site — all sections, images, interactions work
- [ ] Share URL with client for final approval
- [ ] Optional: basic analytics (Plausible, Umami, or Google Analytics)

---

## Summary of All File Changes

### `script.js`

| Phase | Changes |
|-------|---------|
| 1 | Remove `config.products/categories/testimonials` (~80 lines). Add `APPS_SCRIPT_URL`. Add `fetchSiteData()`. Rewire `renderProducts()`, `renderTestimonials()`, `setupFormValidation()`. Add `renderStockBadge()`. Modify `init()` to fetch-first. |
| 2 | Add material badge in `renderProducts()`. Add `openProductModal()`, `closeProductModal()`, `buildModalContent()`. Add NOVO badge logic. Add sale badge + strikethrough. Add gallery/lightbox/similar-products rendering. Extend `getElements()`. |
| 3 | Add bottom bar elements to `getElements()`. Add button handlers in `init()`. Sync cart badge in `renderCartUI()`. Optional: active-section IntersectionObserver. |
| 4 | Add `config.whatsapp`. Add `buildWhatsAppOrderUrl()`. Update `renderCartUI()` for WhatsApp href. Update `renderContactChannels()`. |

### `styles.css`

| Phase | New selectors |
|-------|---------------|
| 1 | `.stock-badge`, `.stock-low`, `.stock-critical`, `.stock-out`, `.product-card.out-of-stock`, `.loading-skeleton`, `.skeleton-card`, `@keyframes shimmer`, `.error-banner` |
| 2 | `.badge-material` (3 variants), `.product-modal-overlay`, `.product-modal`, `.product-modal-content`, `.product-modal-close`, `.gallery-main`, `.gallery-thumbs`, `.gallery-thumb`, `.lightbox`, `.product-card-mini`, `.badge-new`, `.badge-sale`, `.price-old`, `.price-sale` (+ responsive at 768px) |
| 3 | `.mobile-bottom-bar`, `.bottom-bar-btn`, `.bottom-bar-badge`, responsive body padding-bottom, toast-container shift |
| 4 | `.whatsapp-float`, `@keyframes whatsapp-pulse`, `.btn-whatsapp`, responsive bottom offset |

### `index.html`

| Phase | Changes |
|-------|---------|
| 1 | Remove FormSubmit.co hidden fields. Add `#products-loading` skeleton. Add `#error-banner`. |
| 2 | Add `.product-modal-overlay` + `.product-modal` container. |
| 3 | Add `<nav class="mobile-bottom-bar">` with 3 buttons. |
| 4 | Add `<a class="whatsapp-float">`. |

### External (non-code)

| Phase | What |
|-------|------|
| 1 | Create Google Sheet (5 tabs), write Apps Script `Code.gs`, deploy web app |
| 5 | Replace all placeholder data, collect real assets, proofread, deploy |

---

## Excluded Features (with rationale)

| Feature | Why excluded |
|---------|-------------|
| **Wishlist / save-for-later** | Overengineered for current small catalog (~10-20 products). Reconsider if catalog exceeds 30+ items. |
| **Multi-pack per-piece pricing** | Client doesn't currently offer sets/multi-packs. Add when she does. |
| **Search** | Not needed until catalog exceeds ~30 products. Filter pills + sort handle discovery. |
| **Breadcrumbs** | Single-page site — no hierarchy to navigate. Add when individual product pages are introduced. |
| **Material filter sidebar** | Material badges on cards provide visual identification. Full sidebar filtering is overkill for 3 materials. |
| **User accounts / login** | No need — cash-only payment means no saved payment methods, no order history for customers. |

---

*This plan should be re-evaluated after each phase is completed. Priorities may shift based on client feedback, real user behavior after launch, and catalog growth.*
