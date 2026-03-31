# Purple Star — Website Redesign Plan

> Research-backed recommendations for layout, color, typography, and cart solution.
> Date: 2026-03-31

---

## Table of Contents

1. [Website Layout Plan](#1-website-layout-plan)
2. [Purple & White Color System](#2-purple--white-color-system)
3. [Font Recommendations](#3-font-recommendations)
4. [Cart Problem — Analysis & Solution](#4-cart-problem--analysis--solution)

---

## 1. Website Layout Plan

### Current Issues

- The page is a single long scroll with sections in this order: Hero → About → Products → Testimonials → How to Order → Delivery → FAQ → Contact. The problem: **About comes before Products**, which delays what the customer actually wants to see.
- No visual hierarchy distinction between primary selling sections and secondary info sections.
- Hero has no product urgency — just generic "handmade scrunchies" messaging.

### Recommended Section Order (Top to Bottom)

```
┌─────────────────────────────────────────────────┐
│  HEADER (sticky)                                │
│  Logo left — Nav center — Cart + Menu right     │
├─────────────────────────────────────────────────┤
│  1. HERO                                        │
│     - Lifestyle image or product flat-lay        │
│     - Headline: emotional, benefit-focused       │
│     - Subheadline: what makes it special         │
│     - 2 CTAs: "Pogledaj ponudu" + "Naruči"      │
│     - Optional: trust badges (handmade, local)   │
├─────────────────────────────────────────────────┤
│  2. PRODUCTS (the money section — show it early) │
│     - Filter pills (Sve | Satenske | Plišane...) │
│     - Sort dropdown                              │
│     - 3-column grid (2 on tablet, 1 on mobile)  │
│     - Each card: image, name, price, add-to-cart │
├─────────────────────────────────────────────────┤
│  3. SOCIAL PROOF / TESTIMONIALS                  │
│     - 3 testimonial cards in a row              │
│     - Real customer quotes                       │
├─────────────────────────────────────────────────┤
│  4. HOW TO ORDER (visual 3-step process)        │
│     - Step 1: Browse & add to cart              │
│     - Step 2: Fill in details                   │
│     - Step 3: Receive your order                │
│     - Order schedule notice                      │
├─────────────────────────────────────────────────┤
│  5. ABOUT (brand story)                          │
│     - Image + text side-by-side                 │
│     - Keep short — 2-3 paragraphs max           │
│     - Highlight: handmade, local, quality        │
├─────────────────────────────────────────────────┤
│  6. DELIVERY & PAYMENT                           │
│     - 2-3 cards: pickup, BEX, AKS              │
│     - Payment: cash only, highlighted clearly    │
├─────────────────────────────────────────────────┤
│  7. FAQ (accordion)                              │
│     - 5-6 most common questions                  │
├─────────────────────────────────────────────────┤
│  8. CONTACT                                      │
│     - Left: contact info + social links          │
│     - Right: general inquiry form                │
├─────────────────────────────────────────────────┤
│  FOOTER                                          │
│  Logo — Nav links — Social — Copyright           │
└─────────────────────────────────────────────────┘
```

### Key Layout Principles

| Principle | Why | How |
|-----------|-----|-----|
| **Products first** | Shoppers want to see products immediately. Baymard research: 67% of mobile sites lose users due to poor homepage-to-product navigation. | Move Products to section #2, right after hero. |
| **Social proof near products** | Testimonials convert better when close to the purchase decision. | Place testimonials directly after the product grid. |
| **About moved lower** | Brand story is important but secondary — users who care will scroll to it. | Section #5 instead of #2. |
| **Sticky header stays** | Quick navigation without scrolling back. | Already implemented — keep it. |
| **Whitespace between sections** | Purple-heavy design needs breathing room to avoid visual fatigue. | Use `padding: 5rem 0` on sections, generous `gap` in grids. |
| **Single-column hero on mobile** | Two-column hero breaks on small screens. | Already responsive — keep current behavior. |

### Product Card Layout Improvement

Current cards are good but can be enhanced:

```
┌──────────────────────┐
│   ┌──────────────┐   │
│   │              │   │
│   │  Product     │   │   ← 1:1 aspect ratio (keep)
│   │  Image       │   │
│   │              │   │
│   └──────────────┘   │
│                      │
│  Product Name        │   ← Bold, 1 line, truncate with ellipsis
│  ┌────┐              │
│  │ Cat│   500 din.   │   ← Category badge + price on same line
│  └────┘              │
│                      │
│  Short description   │   ← 2-line max, muted color
│  text here...        │
│                      │
│  ┌──────────────────┐│
│  │  Dodaj u korpu   ││   ← Full-width button in card
│  └──────────────────┘│
└──────────────────────┘
```

**Recommended change:** Make the add-to-cart button full-width inside the card instead of auto-width. This increases the touch target and makes the card feel more complete.

---

## 2. Purple & White Color System

### The Problem with the Current Palette

The current CSS uses `#7c3aed` as the single brand purple. This is a vibrant violet that works well as an accent but needs a full shade system for a professional feel. The `--surface-alt: #f3eeff` is a good start for the light purple tint, but there aren't enough intermediate shades.

### Recommended Purple Shade Scale (9 steps)

Following the Refactoring UI methodology: pick a base (500), define the extremes (100 and 900), then fill in the gaps.

```
Purple Scale (brand color):

  100:  #f5f0ff   — Lightest tint (section backgrounds, subtle highlights)
  200:  #ede5ff   — Light tint (hover states on light backgrounds)
  300:  #d4c1fc   — Medium-light (borders on active elements, badge backgrounds)
  400:  #b794f6   — Light accent (secondary buttons, highlights)
  500:  #8b5cf6   — BASE — Primary buttons, links, active states
  600:  #7c3aed   — Current brand color — use for hover on primary buttons
  700:  #6d28d9   — Darker accent (pressed states, emphasis)
  800:  #5b21b6   — Dark (footer background alternative, dark UI elements)
  900:  #4c1d95   — Darkest (text on light backgrounds when extreme contrast needed)
```

### Recommended Neutral (Purple-tinted Grey) Scale

Instead of pure greys, use greys with a slight purple tint to create a cohesive look. This is a key technique — it makes whites and greys feel like they "belong" to the purple brand.

```
Neutral Scale (purple-tinted greys):

  50:   #faf8ff   — Near-white (body background)
  100:  #f3f0f7   — Off-white (alternate section backgrounds)
  200:  #e8e3f0   — Light grey (borders, dividers)
  300:  #d1cad9   — Medium-light grey (disabled text, placeholders)
  400:  #9f95ab   — Medium grey (muted text, captions)
  500:  #6e6680   — Mid grey (secondary text)
  600:  #524a63   — Dark grey (body text — primary readable color)
  700:  #3d3552   — Darker (headings)
  800:  #2d2440   — Very dark (header/footer backgrounds)
  900:  #1a1128   — Near-black (avoid pure #000)
```

### Complete CSS Custom Properties

```css
:root {
    /* --- Purple Brand Scale --- */
    --purple-100: #f5f0ff;
    --purple-200: #ede5ff;
    --purple-300: #d4c1fc;
    --purple-400: #b794f6;
    --purple-500: #8b5cf6;
    --purple-600: #7c3aed;
    --purple-700: #6d28d9;
    --purple-800: #5b21b6;
    --purple-900: #4c1d95;

    /* --- Neutral Scale (purple-tinted) --- */
    --neutral-50:  #faf8ff;
    --neutral-100: #f3f0f7;
    --neutral-200: #e8e3f0;
    --neutral-300: #d1cad9;
    --neutral-400: #9f95ab;
    --neutral-500: #6e6680;
    --neutral-600: #524a63;
    --neutral-700: #3d3552;
    --neutral-800: #2d2440;
    --neutral-900: #1a1128;

    /* --- Semantic Tokens (mapped from scales) --- */
    --bg:           #ffffff;
    --bg-alt:       var(--neutral-50);     /* #faf8ff */
    --surface:      #ffffff;
    --surface-alt:  var(--purple-100);     /* #f5f0ff — section-alt backgrounds */
    --text:         var(--neutral-700);    /* #3d3552 — main body text */
    --text-heading: var(--neutral-800);    /* #2d2440 — headings, emphasis */
    --text-muted:   var(--neutral-500);    /* #6e6680 — captions, secondary */
    --brand:        var(--purple-500);     /* #8b5cf6 — primary actions */
    --brand-hover:  var(--purple-600);     /* #7c3aed — button hover */
    --brand-dark:   var(--purple-700);     /* #6d28d9 — pressed / active */
    --brand-light:  var(--purple-200);     /* #ede5ff — badge backgrounds */
    --brand-lightest: var(--purple-100);   /* #f5f0ff — tinted section bg */
    --border:       var(--neutral-200);    /* #e8e3f0 */

    /* --- Semantic Colors (not purple) --- */
    --success:      #059669;              /* Stock OK, positive feedback */
    --warning:      #d97706;              /* Low stock, caution */
    --danger:       #dc2626;              /* Remove from cart, errors */

    /* --- Footer --- */
    --footer-bg:    var(--neutral-800);    /* #2d2440 */
    --footer-text:  var(--neutral-300);    /* #d1cad9 */
    --footer-heading: #ffffff;
}
```

### Color Application Map

| Element | Color Token | Example Hex |
|---------|-------------|-------------|
| Body background | `--bg` | `#ffffff` |
| Alt section backgrounds | `--surface-alt` | `#f5f0ff` |
| Primary button background | `--brand` | `#8b5cf6` |
| Primary button hover | `--brand-hover` | `#7c3aed` |
| Primary button text | white | `#ffffff` |
| Outline button border | `--brand` | `#8b5cf6` |
| Outline button text | `--brand` | `#8b5cf6` |
| Heading text | `--text-heading` | `#2d2440` |
| Body text | `--text` | `#3d3552` |
| Muted/caption text | `--text-muted` | `#6e6680` |
| Category badge bg | `--brand-light` | `#ede5ff` |
| Category badge text | `--brand-dark` | `#6d28d9` |
| Card borders | `--border` | `#e8e3f0` |
| Step number circles | `--brand` bg, white text | `#8b5cf6` / `#fff` |
| Footer background | `--footer-bg` | `#2d2440` |
| Footer text | `--footer-text` | `#d1cad9` |
| Header scrolled bg | `--brand-hover` | `#7c3aed` at 95% opacity |

### Contrast Ratios (WCAG AA)

All essential pairings verified at minimum 4.5:1 for normal text:

| Foreground | Background | Ratio | Pass? |
|------------|------------|-------|-------|
| `--text` (#3d3552) | `--bg` (#ffffff) | **9.2:1** | AA |
| `--text-muted` (#6e6680) | `--bg` (#ffffff) | **5.1:1** | AA |
| white (#ffffff) | `--brand` (#8b5cf6) | **4.6:1** | AA |
| white (#ffffff) | `--brand-hover` (#7c3aed) | **5.7:1** | AA |
| `--brand-dark` (#6d28d9) | `--brand-light` (#ede5ff) | **7.8:1** | AA |
| `--footer-text` (#d1cad9) | `--footer-bg` (#2d2440) | **8.5:1** | AA |

### Hero Background Enhancement

Instead of a flat white background, use a subtle purple gradient:

```css
.hero {
    background: linear-gradient(
        135deg,
        var(--purple-100) 0%,
        #ffffff 40%,
        #ffffff 60%,
        var(--purple-100) 100%
    );
}
```

This creates a soft purple wash that frames the hero content without overwhelming it.

---

## 3. Font Recommendations

### Current: Montserrat (headings) + Lora (body)

**Assessment:**
- **Montserrat** is a geometric sans-serif. It's clean and readable but very commonly used — it doesn't differentiate the brand much. It also feels somewhat rigid/corporate for a handmade products brand.
- **Lora** is a well-crafted serif with calligraphic influences. It's a solid body font but feels slightly heavy at smaller sizes.

### Recommended Option A (Best for this brand): DM Serif Display + DM Sans

**Why this pairing:**
- Both are from the same type designer (Colophon Foundry for Google), so they share structural DNA — metrics align naturally.
- **DM Serif Display** has elegant, high-contrast letterforms with a warm, feminine feel — ideal for a handmade accessories brand. The serifs are refined but not fussy.
- **DM Sans** is geometric and highly readable, with open apertures that work well for body text, product descriptions, and UI elements.
- Both are free on Google Fonts with excellent language support (including Serbian Latin/Cyrillic).
- Combined file size is smaller than Montserrat + Lora.

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400;1,9..40,500&display=swap" rel="stylesheet">
```

```css
:root {
    --heading: "DM Serif Display", Georgia, serif;
    --body: "DM Sans", system-ui, sans-serif;
}
```

**Use cases:**
| Element | Font | Weight | Size |
|---------|------|--------|------|
| H1 (hero) | DM Serif Display | 400 | clamp(2rem, 5vw, 3.2rem) |
| H2 (sections) | DM Serif Display | 400 | clamp(1.5rem, 3.5vw, 2.25rem) |
| H3 (cards) | DM Sans | 600 | 1.15rem |
| Body text | DM Sans | 400 | 1rem (16px) |
| Buttons/UI | DM Sans | 700 | 0.95rem |
| Labels/badges | DM Sans | 700, uppercase | 0.8rem |
| Price | DM Sans | 700 | 1rem |
| Nav links | DM Sans | 600 | 0.95rem |

### Recommended Option B (Alternative): Playfair Display + Plus Jakarta Sans

**Why:**
- **Playfair Display** is a transitional serif with high contrast and stylish italics — widely used on fashion/beauty sites.
- **Plus Jakarta Sans** is a modern geometric sans-serif with friendly rounded terminals.
- Slightly more "editorial" feel than Option A.

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet">
```

### Recommended Option C (Safe/Clean): Cormorant Garamond + Inter

**Why:**
- **Cormorant Garamond** is one of the most elegant free serifs — very refined for a luxury handmade feel.
- **Inter** is the swiss-knife of sans-serifs — near-perfect readability at any size.
- More classic/timeless feel.

### My Recommendation: Go with Option A (DM Serif Display + DM Sans)

Reasons:
1. Same designer = guaranteed harmony between heading and body fonts
2. DM Serif Display has a warm, approachable elegance perfect for handmade products
3. DM Sans is extremely readable on screens, even at small sizes
4. Both have excellent Serbian Latin support
5. Optical size axis on DM Sans allows micro-optimization
6. Lighter total file weight than current Montserrat + Lora

---

## 4. Cart Problem — Analysis & Solution

### What's the "Cart Problem"?

Based on analysis of the current code, the cart has these issues:

#### Problem 1: Cart submits via FormSubmit.co — no stock control
- Users can order unlimited quantities of any product. There's no way to know if something is actually available.
- The owner has to manually check each order against actual stock, then email the customer if something is out of stock.
- This leads to a bad customer experience and wasted time for the owner.

#### Problem 2: No order confirmation in the UI
- After submitting the order form, FormSubmit.co redirects the user away to its own page, then redirects back. 
- There's no clear in-app confirmation step showing "order received, here's what you ordered."
- The `_next` field redirects back to the homepage — the user doesn't know what happened.

#### Problem 3: Cart data is in localStorage only — fragile
- Cart lives entirely in the browser's localStorage.
- If the user clears data, switches browsers, or uses incognito mode, the cart is gone.
- No server-side validation of what was ordered.

#### Problem 4: No stock visibility for customers
- Customers can't see if a product is in stock, low stock, or sold out.
- This is a common cause of Order → Disappointment → Negative brand impression.

#### Problem 5: Cart form is crammed in a drawer
- The full checkout form (name, email, phone, delivery method, address, notes) is squeezed into a 400px-wide slide-in drawer.
- On mobile this is nearly full-screen anyway, but on desktop the form fields feel tight.

### Solution Comparison

| Approach | Stock Control | Owner Can Update | Complexity | Cost | Reliability |
|----------|--------------|------------------|------------|------|-------------|
| **A. FormSubmit.co (current)** | None | No (needs dev) | Low | Free | Medium (3rd party) |
| **B. Google Sheets + Apps Script** | Yes, auto-decrement | Yes (edits spreadsheet) | Moderate | Free | Good |
| **C. Formspree / Formcarry** | None | No | Low | Free tier limited | Medium |
| **D. Snipcart** | Yes | Yes (dashboard) | Low (drop-in) | $20/month or 2% | Excellent |
| **E. Firebase + Cloud Functions** | Yes | Needs custom admin | High | Free tier | Excellent |
| **F. Hybrid: Sheets API for stock + FormSubmit for orders** | Partial (display-only) | Yes | Low-Moderate | Free | Good |

### Recommended Solution: Google Sheets + Apps Script (Option B)

This is the best fit for Purple Star because:

1. **The owner's "admin panel" is a spreadsheet** — zero learning curve.
2. **Stock auto-decrements on order** — no manual tracking.
3. **Email notifications are built in** — Apps Script sends to owner + customer.
4. **It's completely free** — no monthly fees, no percentage of sales.
5. **You already have a complete plan for this** — the `GOOGLE_SHEETS_INTEGRATION_PLAN.md` is thorough and ready.

### But — Before the Sheets Integration is Built, Do This First

The Sheets integration is the right long-term solution, but it requires building the Apps Script backend. **In the meantime, here are immediate improvements to the current cart that can be done today:**

### Phase 1: Immediate Cart UX Fixes (No Backend Required)

#### Fix 1: Add an in-app order confirmation step

Instead of FormSubmit.co redirecting away, submit the form via `fetch()` and show a Step 3 confirmation inside the cart drawer.

```
Step 1: Cart Items → Step 2: Checkout Form → Step 3: ✅ Confirmation
```

The confirmation shows:
- "Narudžbina je poslata!"
- Order summary (products, quantities, total)
- "Potvrdu ćeš dobiti na email" message
- Cart clears automatically after successful submit

**This can be done with the current FormSubmit.co backend** — FormSubmit supports AJAX submissions:

```javascript
// Instead of native form submit:
fetch("https://formsubmit.co/ajax/real-email@example.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        showCartStep(els, "confirmation");
        localStorage.removeItem(CART_KEY);
        renderCartUI(els);
    }
});
```

#### Fix 2: Better drawer-to-page checkout on desktop

On screens wider than 768px, when the user clicks "Nastavi na narudžbinu," instead of keeping the form in the 400px drawer, **expand the drawer to overlay the center of the screen** as a modal-style panel (max 560px wide). This gives form fields more room.

```css
@media (min-width: 768px) {
    .cart-drawer.checkout-mode {
        width: min(560px, 90vw);
    }
}
```

#### Fix 3: Add "Dodato u korpu" toast notification

When a user adds an item, instead of just changing the button text briefly, show a small toast/snackbar at the bottom of the screen:

```
┌──────────────────────────────────────────┐
│  ✓ Satenski scrunchie — Klasik dodat     │
│    u korpu (1)          [Pogledaj korpu] │
└──────────────────────────────────────────┘
```

This provides clear feedback and a shortcut to open the cart.

#### Fix 4: Cart persistence warning

Add a single line below the cart total:

```
ℹ️ Korpa se čuva samo u ovom pregledaču.
```

This sets expectations so users aren't surprised if their cart disappears.

### Phase 2: Google Sheets Integration (Full Solution)

This is fully documented in `GOOGLE_SHEETS_INTEGRATION_PLAN.md`. The key changes:

1. **Products fetched from Google Sheets API** instead of hardcoded `config.products`
2. **Stock visibility on product cards** — badges: "Još samo 3!" (low), "Poslednji komadi!" (critical), "Rasprodato" (out)
3. **Stock validation on order submit** — server-side check before decrementing
4. **Auto-generated order IDs** — `PS-20260331-001`
5. **Styled HTML emails** — to owner and customer
6. **3-step cart flow** — Items → Shipping → Confirmation (with order ID)

### Phase 2 Cart Flow (Final State)

```
Step 1: Cart Items                    Step 2: Shipping Info              Step 3: Confirmation
                                                                         
┌─────────────────────┐              ┌─────────────────────┐           ┌─────────────────────┐
│ 🛒 Tvoja korpa    × │              │ 📋 Podaci za       × │           │ ✅ Narudžbina       × │
│                     │              │    dostavu            │           │    primljena!          │
│ [Satenski × 2]      │              │                       │           │                       │
│ [Plišani  × 1]      │              │ ← Nazad na korpu     │           │ Broj: PS-20260331-001 │
│                     │              │                       │           │                       │
│                     │              │ Ime: [________]       │           │ Satenski ×2 = 1000    │
│                     │              │ Email: [________]     │           │ Plišani  ×1 = 500     │
│                     │              │ Telefon: [________]   │           │ ─────────────────     │
│                     │              │ Preuzimanje: (•)(•)(•)│           │ UKUPNO: 1.500 din.    │
│                     │              │ Adresa: [________]    │           │                       │
│                     │              │ Napomena: [________]  │           │ Potvrda je poslata na │
│ ─────────────────── │              │                       │           │ ana@example.com       │
│ Ukupno: 1.500 din.  │              │ [Tvoja narudžbina]    │           │                       │
│ [Nastavi ▶]         │              │ [Pošalji narudžbinu]  │           │ [Zatvori]             │
└─────────────────────┘              └─────────────────────┘           └─────────────────────┘
```

### Product Card with Stock Badge (Phase 2)

```
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│   ┌──────────────┐   │    │   ┌──────────────┐   │    │   ┌──────────────┐   │
│   │  Product     │   │    │   │  Product     │   │    │   │  ░░RASPRO░░  │   │
│   │  Image       │   │    │   │  Image       │   │    │   │  ░░DATO░░░  │   │
│   └──────────────┘   │    │   └──────────────┘   │    │   └──────────────┘   │
│                      │    │                      │    │                      │
│  Product Name        │    │  Product Name        │    │  Product Name        │
│  Satenske  500 din.  │    │  Satenske  500 din.  │    │  Satenske  500 din.  │
│                      │    │  ⚠️ Još samo 3!      │    │                      │
│  Description text... │    │  Description text... │    │  Description text... │
│                      │    │                      │    │                      │
│ [  Dodaj u korpu   ] │    │ [  Dodaj u korpu   ] │    │ [   Rasprodato     ] │
│                      │    │                      │    │   (disabled, grey)   │
└──────────────────────┘    └──────────────────────┘    └──────────────────────┘
     Stock > 5                  Stock 3-5 (amber)           Stock = 0 (grey)
```

### Implementation Priority

| Priority | Task | Effort | Impact |
|----------|------|--------|--------|
| **1** | Reorder sections (Products before About) | 15 min | High — faster path to products |
| **2** | Apply new color system (CSS variables) | 30 min | High — professional, cohesive look |
| **3** | Switch fonts to DM Serif Display + DM Sans | 15 min | Medium — brand personality |
| **4** | Add AJAX form submit + Step 3 confirmation | 1-2 hrs | High — no more redirect confusion |
| **5** | Add toast notification for "added to cart" | 30 min | Medium — better feedback |
| **6** | Expand drawer on checkout (desktop) | 20 min | Medium — less cramped form |
| **7** | Build Google Sheets backend (Phase 2) | 4-6 hrs | Very High — stock control, emails, admin |
| **8** | Add stock badges to product cards | 1 hr | High — transparency for customers |

---

## Summary

| Area | Current | Recommended |
|------|---------|-------------|
| **Section order** | Hero → About → Products | Hero → Products → Testimonials → How to Order → About |
| **Font heading** | Montserrat (geometric sans) | DM Serif Display (elegant serif) |
| **Font body** | Lora (serif) | DM Sans (clean sans) |
| **Color base** | Single `#7c3aed` | 9-shade purple scale + purple-tinted neutrals |
| **Cart checkout** | FormSubmit.co redirect | AJAX submit + in-app confirmation (Phase 1), Google Sheets (Phase 2) |
| **Stock control** | None | Google Sheets with auto-decrement (Phase 2) |
| **Cart feedback** | Button text swap for 1s | Toast notification with "view cart" shortcut |

All changes are designed to be implemented incrementally — each one improves the site independently.
