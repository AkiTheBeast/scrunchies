# Google Sheets Backend — Complete Integration Plan

> **Status:** Ready to implement  
> **Created:** 2026-04-01  
> **Replaces:** `GOOGLE_SHEETS_INTEGRATION_PLAN.md` + cart sections from `WEBSITE_REDESIGN_PLAN.md`  
> **Cost:** Free (Google Sheets + Apps Script + Gmail)

---

## Table of Contents

1. [Why Google Sheets?](#1-why-google-sheets)
2. [Architecture Overview](#2-architecture-overview)
3. [What You Must Do Manually](#3-what-you-must-do-manually)
4. [Google Sheet Structure](#4-google-sheet-structure)
5. [What We Implement (Code)](#5-what-we-implement-code)
6. [Apps Script — Full Specification](#6-apps-script--full-specification)
7. [Website Code Changes](#7-website-code-changes)
8. [Stock Badges & Out-of-Stock Design](#8-stock-badges--out-of-stock-design)
9. [Cart Flow (3-Step)](#9-cart-flow-3-step)
10. [Email Templates](#10-email-templates)
11. [Caching & Fallback Strategy](#11-caching--fallback-strategy)
12. [CORS & Fetch — Critical Technical Notes](#12-cors--fetch--critical-technical-notes)
13. [Quotas & Limitations](#13-quotas--limitations)
14. [Testing Checklist](#14-testing-checklist)
15. [How to Update the Apps Script](#15-how-to-update-the-apps-script)
16. [Decisions Log](#16-decisions-log)

---

## 1. Why Google Sheets?

| Criteria | Current (Hardcoded + FormSubmit.co) | Google Sheets + Apps Script |
|---|---|---|
| **Cost** | Free | Free |
| **Owner updates stock** | Needs developer every time | Edits a spreadsheet cell |
| **Stock auto-decrements** | No | Yes, on order submit |
| **Email to owner on order** | FormSubmit.co (basic) | Apps Script (customizable HTML) |
| **Customer confirmation email** | FormSubmit.co autoresponse (fixed text) | Apps Script (customizable with order ID) |
| **Add/remove products** | Needs developer | Add/delete a row in the Sheet |
| **Add/edit testimonials** | Needs developer | Edit the Utisci tab |
| **Contact form handling** | FormSubmit.co | Apps Script (centralized) |
| **Stock visibility for customers** | None | Real-time badges on product cards |
| **Order history** | Email inbox only | Searchable spreadsheet with status tracking |
| **Complexity to build** | Already built | Moderate (one-time setup) |
| **Friend's skill required** | None — calls developer | Open spreadsheet, change a number |

**Google Sheets wins** because the "admin panel" is literally a spreadsheet — zero learning curve.

---

## 2. Architecture Overview

```
Browser (Purple Star website)
  │
  ├── GET ?action=products  ──────▶  Google Apps Script (Web App)
  │◀── JSON {products, categories,     │
  │    testimonials}                    ├── Reads: Proizvodi sheet
  │                                     ├── Reads: Kategorije sheet
  │                                     ├── Reads: Utisci sheet
  │                                     ├── Reads: Podešavanja sheet
  │
  ├── POST {action:"order", ...}  ──▶  On order:
  │◀── JSON {success, orderId}         │  1. Validate all fields
  │                                     │  2. Check stock (with lock)
  │                                     │  3. Decrement stock
  ├── POST {action:"inquiry",...} ──▶  │  4. Log to Narudžbine sheet
  │◀── JSON {success}                  │  5. Email owner (HTML)
  │                                     │  6. Email customer (confirmation)
  │
  │   Fallback: sessionStorage cache
  │   + "Piši nam na Instagram DM"
  │
  └── localStorage: cart items only
```

**Data flows:**
- **Products, categories, testimonials** — fetched from Sheet on each page load (cached 60s in sessionStorage)
- **Orders** — POSTed to Apps Script, which validates, decrements stock, logs, and emails
- **Contact inquiries** — POSTed to Apps Script, which logs and emails owner
- **Cart** — stays in localStorage (client-side only, same as now)

---

## 3. What You Must Do Manually

These steps **cannot** be automated — they require your friend's Google account and manual action.

### Step-by-step setup checklist

| # | What to do | Who | Details |
|---|-----------|-----|---------|
| **M1** | Have a Gmail account ready | Friend | e.g. `purplestar13@gmail.com` — this owns the Sheet and sends order emails. Can be an existing Gmail. |
| **M2** | Create a new Google Sheet | Friend | Open [sheets.google.com](https://sheets.google.com), click "+ Blank". Name it **"Purple Star — Prodavnica"**. |
| **M3** | Create 5 sheet tabs | Friend | See [Section 4](#4-google-sheet-structure) for exact tab names and column headers. Rename the default "Sheet1" tab, then add 4 more tabs using the "+" button at the bottom. |
| **M4** | Enter product data | Friend | Fill the **Proizvodi** tab with all products. Each row = one product. We provide the exact column format below. Product IDs must match the current placeholder IDs (`sat-01`, `sat-02`, etc.) or be new unique IDs. |
| **M5** | Enter categories | Friend | Fill the **Kategorije** tab. Currently 3 rows: `satenske` → `Satenske`, `plisane` → `Plišane`, `pamucne` → `Pamučne`. |
| **M6** | Enter testimonials | Friend | Fill the **Utisci** tab with customer reviews. Currently 3 placeholders — replace with real ones or keep as-is. |
| **M7** | Enter settings | Friend | Fill the **Podešavanja** tab with key-value pairs (email address, stock thresholds). See format below. |
| **M8** | Open Apps Script editor | Friend | In the Google Sheet, go to **Extensions → Apps Script**. This opens a code editor in a new tab. |
| **M9** | Paste the code | Friend | We write a `Code.gs` file. Friend selects all default code in the editor, deletes it, and pastes our code. Click the save button (💾). |
| **M10** | Deploy as Web App | Friend | Click **Deploy → New deployment**. Click the gear icon ⚙️ next to "Select type" → choose **Web app**. Set **"Execute as"** to **"Me"**. Set **"Who has access"** to **"Anyone"**. Click **Deploy**. |
| **M11** | Authorize permissions | Friend | First deployment shows a permissions popup. Click **"Review permissions"** → select your Google account → click **"Advanced"** → **"Go to Purple Star (unsafe)"** → **"Allow"**. This is a one-time step — Google flags all new scripts this way. |
| **M12** | Copy the deployment URL | Friend | After deploying, a URL appears like `https://script.google.com/macros/s/XXXX.../exec`. Copy this and send it to the developer. |
| **M13** | Test a real order | Both | After we wire up the site, friend places a test order. Verify: order appears in Narudžbine sheet, stock decremented in Proizvodi sheet, owner email received, customer email received. |

### After initial setup — ongoing manual tasks

| Task | How often | What to do |
|------|-----------|-----------|
| **Update stock** | After making new products | Open Sheet → Proizvodi tab → change the number in the "Stanje" column |
| **Add a product** | When creating new items | Add a new row to Proizvodi with all columns filled |
| **Hide a product** | When sold out permanently | Set "Aktivno" column to `FALSE` (or delete the row) |
| **Track orders** | After each order | Update "Status" column in Narudžbine: `Nova` → `U pripremi` → `Poslato` → `Završeno` |
| **Add testimonial** | When getting nice reviews | Add a row to Utisci tab with name, text, location, `TRUE` |
| **Update Apps Script** | When developer changes the code | See [Section 15](#15-how-to-update-the-apps-script) — requires creating a new deployment version |

---

## 4. Google Sheet Structure

### Tab 1: "Proizvodi" (Products)

| Column | Header (row 1) | Type | Example | Notes |
|--------|----------------|------|---------|-------|
| A | ID | Text | `sat-01` | Unique identifier, never changes |
| B | Naziv | Text | `Satenski scrunchie — Klasik` | Product name shown on the website |
| C | Kategorija | Text | `satenske` | Must match a key in the Kategorije tab |
| D | Cena | Number | `500` | Price in RSD (dinars), no formatting |
| E | Stanje | Number | `8` | **Current stock count. This is what you edit.** |
| F | Slika | URL | `https://images.pexels.com/...` | Full image URL |
| G | Alt tekst | Text | `Satenski scrunchie u klasičnoj boji` | Image description for accessibility |
| H | Opis | Text | `Mekan satenski scrunchie...` | Product description paragraph |
| I | Istaknuto | TRUE/FALSE | `TRUE` | Featured products sort first in "Preporučeno" |
| J | Aktivno | TRUE/FALSE | `TRUE` | Set to `FALSE` to hide from website without deleting |

**Example rows:**

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| sat-01 | Satenski scrunchie — Klasik | satenske | 500 | 8 | https://... | Satenski scrunchie... | Mekan satenski... | TRUE | TRUE |
| sat-02 | Satenski scrunchie — Roze | satenske | 500 | 5 | https://... | Roze satenski... | Nežno roze... | FALSE | TRUE |
| pli-01 | Plišani scrunchie — Soft | plisane | 500 | 0 | https://... | Plišani scrunchie... | Mekan plišani... | TRUE | TRUE |

### Tab 2: "Kategorije" (Categories)

| Column | Header (row 1) | Example |
|--------|----------------|---------|
| A | Ključ | `satenske` |
| B | Naziv | `Satenske` |

Start with 3 rows:

| Ključ | Naziv |
|-------|-------|
| satenske | Satenske |
| plisane | Plišane |
| pamucne | Pamučne |

To add a new category (e.g., trake za kosu), just add a row: `trake` | `Trake za kosu`.

### Tab 3: "Narudžbine" (Orders)

**Only create the header row — data is auto-populated by the script.**

| Column | Header (row 1) |
|--------|----------------|
| A | Datum |
| B | ID narudžbine |
| C | Ime |
| D | Email |
| E | Telefon |
| F | Preuzimanje |
| G | Adresa |
| H | Napomena |
| I | Stavke |
| J | Ukupno |
| K | Status |

When an order comes in, the script fills columns A–J automatically. Column K starts as `Nova` — you manually update it as you process the order:

`Nova` → `U pripremi` → `Poslato` → `Završeno`

### Tab 4: "Utisci" (Testimonials)

| Column | Header (row 1) | Example |
|--------|----------------|---------|
| A | Ime | `Jelena M.` |
| B | Tekst | `Naručila sam set scrunchies...` |
| C | Lokacija | `Pančevo` |
| D | Aktivno | `TRUE` |

Set Aktivno to `FALSE` to hide a testimonial without deleting it.

### Tab 5: "Podešavanja" (Settings)

Simple key-value pairs in columns A and B:

| A (Ključ) | B (Vrednost) | Purpose |
|-----------|-------------|---------|
| email_vlasnika | `purplestar13@gmail.com` | Where order notifications are sent |
| prag_niska_zaliha | `5` | Show amber "Još samo X!" badge at this level or below |
| prag_kriticna_zaliha | `2` | Show red "Poslednji komadi!" badge at this level or below |
| dan_roka | `0` | Sunday cutoff day (0=Sunday, 1=Monday, etc.) |
| sat_roka | `12` | Cutoff hour (24h format) |
| instagram | `_purple_star_13` | Instagram handle for DM fallback messages |

---

## 5. What We Implement (Code)

### Implementation phases

| Phase | What | Depends on | Files changed |
|-------|------|-----------|---------------|
| **A** | Write the Google Apps Script (`Code.gs`) | Sheet exists with data (M2–M7) | New: `Code.gs` (pasted into Sheet) |
| **B** | Update website JavaScript | Apps Script deployed (M8–M12) | `script.js` (major rewrite) |
| **C** | Update website HTML | Parallel with B | `index.html` (moderate changes) |
| **D** | Update website CSS | Parallel with B | `styles.css` (additions only) |
| **E** | Testing | All above complete | All files |

### What stays the same

- Cart still lives in localStorage (client-side, same `purplestar_cart` key)
- 3-step cart drawer flow (Items → Checkout → Confirmation) — already built in Phase 1
- Toast notifications — already built
- Drawer expansion on checkout — already built
- Section order, color system, fonts — already done

### What changes

| Current | After integration |
|---------|------------------|
| Products hardcoded in `config.products` (script.js) | Fetched from Google Sheet via Apps Script API |
| Categories hardcoded in `config.categories` | Fetched from Sheet |
| Testimonials hardcoded in `config.testimonials` | Fetched from Sheet |
| Order form POSTs to FormSubmit.co | POSTs to Apps Script |
| Contact form POSTs to FormSubmit.co | POSTs to Apps Script |
| No stock visibility | Stock badges on product cards |
| No stock validation | Server-side stock check before order |
| No order IDs | Auto-generated `PS-YYYYMMDD-NNN` order IDs |
| Basic FormSubmit emails | Custom HTML emails with order tables |
| No order history | Searchable Orders sheet with status tracking |

---

## 6. Apps Script — Full Specification

### `doGet(e)` — Fetch site data

**URL:** `GET https://script.google.com/macros/s/{ID}/exec?action=products`

**Returns:**
```json
{
  "products": [
    {
      "id": "sat-01",
      "name": "Satenski scrunchie — Klasik",
      "category": "satenske",
      "price": 500,
      "stock": 8,
      "image": "https://...",
      "alt": "Satenski scrunchie u klasičnoj boji",
      "desc": "Mekan satenski scrunchie...",
      "featured": true
    }
  ],
  "categories": {
    "satenske": "Satenske",
    "plisane": "Plišane",
    "pamucne": "Pamučne"
  },
  "testimonials": [
    {
      "name": "Jelena M.",
      "text": "Naručila sam set scrunchies...",
      "location": "Pančevo"
    }
  ],
  "settings": {
    "lowStockThreshold": 5,
    "criticalStockThreshold": 2,
    "instagram": "_purple_star_13"
  }
}
```

**Logic:**
1. Read all rows from Proizvodi where `Aktivno=TRUE`
2. Map each row to a product object (including stock count)
3. Read Kategorije tab into a key→name map
4. Read Utisci tab where `Aktivno=TRUE`
5. Read Podešavanja tab for thresholds
6. Return everything as one JSON response

Products with stock=0 **are** included (so the site can show "Rasprodato") but marked with `stock: 0`.

### `doPost(e)` — Handle orders and inquiries

**Order request:**
```json
{
  "action": "order",
  "name": "Ana Petrović",
  "email": "ana@example.com",
  "phone": "065 123 4567",
  "pickup": "BEX kurirska služba",
  "address": "Knez Mihailova 10, Beograd",
  "note": "Poklon pakovanje",
  "items": [
    { "id": "sat-01", "qty": 2 },
    { "id": "pli-03", "qty": 1 }
  ]
}
```

**Order processing logic:**
1. Parse `e.postData.contents` as JSON
2. Validate required fields: `name`, `email`, `phone`, `pickup`, `items` (non-empty array)
3. Validate email format, phone not empty, items have valid IDs
4. **Acquire script lock** (`LockService.getScriptLock().waitLock(10000)`) to prevent race conditions
5. For each item: look up product in Proizvodi sheet, check `stock >= qty`
6. If any item has insufficient stock → release lock, return error with details
7. Decrement stock for each item (write new value to column E)
8. Release lock
9. Generate order ID: `PS-YYYYMMDD-NNN` (NNN = sequential within the day, based on existing orders)
10. Append order row to Narudžbine sheet (columns A–K, Status = "Nova")
11. Send HTML email to owner (from Podešavanja `email_vlasnika`)
12. Send confirmation email to customer
13. Return `{ success: true, orderId: "PS-20260401-001", message: "Narudžbina uspešno primljena!" }`

**Order error response:**
```json
{
  "success": false,
  "error": "stock",
  "message": "Nažalost, Satenski scrunchie — Klasik nema dovoljno na stanju (traženo: 5, dostupno: 3)"
}
```

**Inquiry request:**
```json
{
  "action": "inquiry",
  "name": "Marko",
  "email": "marko@example.com",
  "message": "Da li imate leopard print scrunchies?"
}
```

**Inquiry logic:**
1. Validate fields
2. Email the message to owner
3. Return `{ success: true }`

### Security measures

- **Input validation** — all fields sanitized server-side (length limits, format checks)
- **Script lock** — prevents two simultaneous orders from overselling last item
- **No sensitive data** — no passwords, no payment info stored anywhere
- **Rate limiting** — Apps Script has built-in limits (30 simultaneous executions)
- **Honeypot** — frontend still includes a hidden field; Apps Script can optionally check it
- **Reserved parameter names** — `c` and `sid` are reserved by Google and must not be used as field names in POST body

---

## 7. Website Code Changes

### script.js — Major changes

**Remove:**
- `config.products` array (~80 lines of hardcoded product data)
- `config.categories` object
- `config.testimonials` array
- FormSubmit.co URL construction in `setupFormValidation()`
- FormSubmit.co handling in contact form

**Add:**
- `APPS_SCRIPT_URL` constant at top of file
- `fetchSiteData()` — async function that GETs products/categories/testimonials/settings from Apps Script
- `sessionStorage` caching with 60-second TTL (see [Section 11](#11-caching--fallback-strategy))
- Loading state management (show skeleton while fetching)
- Error state with Instagram DM fallback
- Stock badge rendering in `renderProducts()` (based on thresholds from settings)
- Stock validation in `addToCart()` — can't add more than available stock
- Stock cap in `updateCartQty()` — quantity capped at current stock level
- Updated `setupFormValidation()` — POSTs to Apps Script URL with correct CORS headers (see [Section 12](#12-cors--fetch--critical-technical-notes))
- Updated confirmation step — shows server-returned order ID
- Contact form AJAX submission to Apps Script (`action: "inquiry"`)

### index.html — Moderate changes

**Remove:**
- All FormSubmit.co hidden fields from checkout form (`_subject`, `_autoresponse`, `_template`, `_next`, `_honey`, `_captcha`)
- `action="https://formsubmit.co/..."` from both forms
- FormSubmit.co hidden fields from contact/inquiry form

**Add:**
- Loading skeleton placeholder in product grid area
- API error banner container
- Stock badge markup handled by JS in product card template (no HTML changes needed — JS builds cards dynamically already)

**Keep:**
- Step 3 confirmation container (already built)
- Toast container (already built)
- Cart drawer structure (already built)
- Form fields (name, email, phone, pickup, address, note) — same fields, just different submission target

### styles.css — Additions only

**Add:**
- `.stock-badge` — base badge style (small pill below price)
- `.stock-badge.stock-low` — amber/warning color (`var(--warning)`)
- `.stock-badge.stock-critical` — red/danger color (`var(--danger)`)
- `.product-card.out-of-stock` — semi-transparent overlay on the product image
- `.product-card.out-of-stock .btn-add-cart` — disabled/gray button showing "Rasprodato"
- `.product-grid-loading` — skeleton loader (pulsing placeholder cards)
- `.api-error-banner` — error message bar with Instagram DM link

---

## 8. Stock Badges & Out-of-Stock Design

### Badge rules (thresholds from Podešavanja sheet)

| Stock Level | Visual | Badge Text | Button |
|---|---|---|---|
| > `prag_niska_zaliha` (default 5) | No badge | — | Normal "Dodaj u korpu" |
| `prag_kriticna_zaliha` < stock ≤ `prag_niska_zaliha` (3–5) | Amber badge | `⚠️ Još samo X!` | Normal |
| 1 ≤ stock ≤ `prag_kriticna_zaliha` (1–2) | Red badge | `🔴 Poslednji komadi!` | Normal |
| 0 | Image overlay | — | Disabled, shows "Rasprodato" |

### Visual examples

**Normal product card (stock > 5):**
```
┌──────────────────────┐
│   [product image]     │
│                       │
│  Satenski — Klasik    │
│  Satenske    500 din. │
│  Mekan satenski...    │
│  [Dodaj u korpu]      │
└──────────────────────┘
```

**Low stock card (stock 3–5):**
```
┌──────────────────────┐
│   [product image]     │
│                       │
│  Satenski — Klasik    │
│  Satenske    500 din. │
│  ⚠️ Još samo 3!       │  ← amber pill badge
│  Mekan satenski...    │
│  [Dodaj u korpu]      │
└──────────────────────┘
```

**Critical stock card (stock 1–2):**
```
┌──────────────────────┐
│   [product image]     │
│                       │
│  Satenski — Klasik    │
│  Satenske    500 din. │
│  🔴 Poslednji komadi! │  ← red pill badge
│  Mekan satenski...    │
│  [Dodaj u korpu]      │
└──────────────────────┘
```

**Out of stock (stock = 0):**
```
┌──────────────────────┐
│   [product image]     │
│   ░░░░░░░░░░░░░░░░   │  ← semi-transparent overlay
│   ░░ RASPRODATO ░░   │
│   ░░░░░░░░░░░░░░░░   │
│  Satenski — Klasik    │
│  Satenske    500 din. │
│  Mekan satenski...    │
│  [Rasprodato]         │  ← disabled gray button
└──────────────────────┘
```

---

## 9. Cart Flow (3-Step)

This flow is **already built** from Phase 1. The only changes are:
- Step 3 now shows a server-returned order ID
- Form submission target changes from FormSubmit.co to Apps Script
- Stock validation happens server-side on submit

```
Step 1: Cart Items                    Step 2: Checkout Form              Step 3: Confirmation
──────────────────                    ──────────────────                 ──────────────────

┌─────────────────────┐              ┌─────────────────────┐           ┌─────────────────────┐
│ 🛒 Tvoja korpa    × │              │ 📋 Narudžbina     × │           │ ✅ Potvrda         × │
│                     │              │                     │           │                     │
│ [Satenski × 2]      │              │ ← Nazad na korpu    │           │       ✅             │
│ [Plišani  × 1]      │              │                     │           │ Narudžbina je       │
│                     │              │ ┌Tvoja narudžbina──┐ │           │ poslata!            │
│                     │              │ │Satenski×2 = 1000 │ │           │                     │
│                     │              │ │Plišani ×1 =  500 │ │           │ Broj: PS-20260401-001│
│                     │              │ │Ukupno     = 1500 │ │           │                     │
│                     │              │ └──────────────────┘ │           │ Satenski ×2 = 1000  │
│                     │              │                     │           │ Plišani  ×1 = 500   │
│                     │              │ Ime: [________]      │           │ ─────────────────   │
│                     │              │ Email: [________]    │           │ UKUPNO: 1.500 din.  │
│                     │              │ Telefon: [________]  │           │                     │
│                     │              │ Preuzimanje: (•)(•)  │           │ Potvrda je poslata  │
│                     │              │ Adresa: [________]   │           │ na ana@example.com  │
│ ─────────────────── │              │ Napomena: [________] │           │                     │
│ Ukupno: 1.500 din.  │              │                     │           │ [Zatvori]           │
│ [Nastavi ▶]         │              │ [Pošalji narudžbinu] │           │                     │
└─────────────────────┘              └─────────────────────┘           └─────────────────────┘
```

**On desktop (≥768px):** drawer expands from 400px to 560px during Steps 2 and 3 (already implemented via `.checkout-mode` class).

---

## 10. Email Templates

### Email to owner (on new order)

**From:** Friend's Gmail (the account that deployed the script)  
**To:** `email_vlasnika` from Podešavanja sheet  
**Subject:** `Nova narudžbina PS-20260401-001 — Purple Star`

**Body (HTML):**
```
Nova narudžbina sa sajta!

Broj narudžbine: PS-20260401-001
Datum: 01.04.2026. u 14:30

═══ KUPAC ═══
Ime: Ana Petrović
Email: ana@example.com
Telefon: 065 123 4567

═══ DOSTAVA ═══
Način: BEX kurirska služba
Adresa: Knez Mihailova 10, Beograd

═══ NARUDŽBINA ═══
┌──────────────────────────────┬─────┬──────────┐
│ Proizvod                     │ Kom │ Cena     │
├──────────────────────────────┼─────┼──────────┤
│ Satenski scrunchie — Klasik  │  2  │ 1.000din │
│ Plišani scrunchie — Soft     │  1  │   500din │
├──────────────────────────────┼─────┼──────────┤
│ UKUPNO                       │  3  │ 1.500din │
└──────────────────────────────┴─────┴──────────┘

Napomena: Poklon pakovanje

═══ STANJE POSLE NARUDŽBINE ═══
Satenski scrunchie — Klasik: 6 preostalo
Plišani scrunchie — Soft: 4 preostalo
```

### Confirmation email to customer

**From:** Friend's Gmail  
**To:** Customer's email  
**Subject:** `Tvoja narudžbina PS-20260401-001 — Purple Star ⭐`

**Body:**
```
Zdravo Ana,

Hvala na narudžbini! Primili smo tvoj zahtev i javićemo ti se u najkraćem roku.

Broj narudžbine: PS-20260401-001

Tvoja narudžbina:
  - Satenski scrunchie — Klasik × 2 = 1.000 din.
  - Plišani scrunchie — Soft × 1 = 500 din.
  UKUPNO: 1.500 din.

Način preuzimanja: BEX kurirska služba
Adresa: Knez Mihailova 10, Beograd

Sve narudžbine se šalju ponedeljkom. Ako imaš pitanja,
javi nam se na Instagram (@_purple_star_13) ili
odgovori na ovaj email.

Hvala što podržavaš ručni rad! 💜

— Purple Star
```

### Contact inquiry email to owner

**Subject:** `Nova poruka sa sajta — Purple Star`

**Body:**
```
Nova poruka sa kontakt forme:

Ime: Marko
Email: marko@example.com

Poruka:
Da li imate leopard print scrunchies?
```

---

## 11. Caching & Fallback Strategy

### Product data caching

```
Page load
  │
  ├── Check sessionStorage for cached data
  │     └── If exists AND less than 60 seconds old → use cached data
  │
  ├── If no cache or expired → fetch from Apps Script
  │     ├── Success → render products, save to sessionStorage with timestamp
  │     └── Failure → check sessionStorage for ANY cached data (even expired)
  │           ├── Has cache → render from cache + show warning banner
  │           └── No cache → show error state
  │
  └── Error state message:
        "Trenutno ne možemo učitati proizvode.
         Pogledaj naše proizvode na Instagram (@_purple_star_13)
         ili nam piši u DM za narudžbinu."
```

### Why sessionStorage (not localStorage)

- `sessionStorage` clears when the browser tab closes — ensures fresh data on each visit
- `localStorage` would persist stale product/stock data across visits
- Cart stays in `localStorage` because it's user state, not shop data

---

## 12. CORS & Fetch — Critical Technical Notes

Google Apps Script web apps have specific CORS behavior that differs from typical APIs. Getting this wrong causes silent failures.

### Rules for browser → Apps Script requests

| Setting | Correct value | Why |
|---------|--------------|-----|
| **Content-Type** | `text/plain;charset=utf-8` | `application/json` triggers a CORS preflight OPTIONS request. Apps Script cannot respond to OPTIONS, so the request fails silently. Using `text/plain` makes it a "simple request" — no preflight. |
| **redirect** | `"follow"` | Apps Script's `/exec` URL returns a 302 redirect to a one-time URL. `fetch()` must follow this redirect. Without `redirect: "follow"`, some browsers block it. |
| **Request body** | `JSON.stringify(data)` | Even though Content-Type says `text/plain`, the body is JSON. Apps Script reads it from `e.postData.contents` and we `JSON.parse()` it server-side. |
| **URL** | Must be the `/exec` URL | The `/dev` URL is private and does NOT set `Access-Control-Allow-Origin` headers. Always deploy and use `/exec`. |
| **New versions** | Must deploy new version | The `/exec` URL is frozen to the deployed version. Code changes don't take effect until a new version is deployed. |

### Correct fetch call (website side)

```javascript
fetch(APPS_SCRIPT_URL, {
    method: "POST",
    redirect: "follow",
    headers: {
        "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
        action: "order",
        name: "Ana Petrović",
        // ... other fields
    })
})
.then(function(response) { return response.json(); })
.then(function(result) {
    if (result.success) {
        // Show confirmation with result.orderId
    } else {
        // Show error: result.message
    }
});
```

### Correct response (Apps Script side)

```javascript
function doPost(e) {
    var data = JSON.parse(e.postData.contents);
    // ... process order ...

    return ContentService
        .createTextOutput(JSON.stringify({ success: true, orderId: orderId }))
        .setMimeType(ContentService.MimeType.JSON);
}
```

### Common CORS pitfalls to avoid

1. **Never use `Content-Type: application/json`** — causes preflight → 405 error
2. **Never use the `/dev` URL in production** — no CORS headers
3. **If you get a CORS error after changing code** — you probably forgot to deploy a new version
4. **If the script has a runtime error**, Google returns an HTML error page instead of JSON — this also triggers a CORS error in the browser. Debug using the `/dev` URL in the Apps Script editor's "Run" button first.

---

## 13. Quotas & Limitations

### Google Apps Script quotas (free Gmail account)

| Resource | Daily limit | Purple Star usage |
|----------|-------------|-------------------|
| Emails sent | 100 recipients/day | ~50 orders/day max (each order = 2 emails: owner + customer) |
| Script runtime | 6 min per execution | Orders process in <5 seconds |
| Simultaneous executions | 30 per user | Far more than needed |
| Spreadsheet read/write | 50,000/day | Each page load = 1 read, each order = ~3 writes. Well within limits. |
| URL fetch calls | 20,000/day | Website → Apps Script calls count here |

**Bottom line:** These limits support roughly 50 orders/day and thousands of product page views. Far beyond what a small handmade scrunchie business needs.

### Concurrency / race conditions

If two customers both have the last item in their cart and click "Pošalji" at the exact same moment:
1. First request acquires the script lock
2. Second request waits (up to 10 seconds)
3. First request decrements stock → success
4. Second request checks stock → finds 0 → returns error: "Nema dovoljno na stanju"

This is handled by `LockService.getScriptLock()` in the Apps Script. At Purple Star's volume, this scenario is extremely unlikely.

### Other limitations

- **Not instant inventory sync** — if someone adds an item to their cart, then waits 30 minutes, then checks out, the stock may have changed. Server-side validation catches this.
- **No payment processing** — cash only (on pickup or COD). This is intentional, not a limitation to fix now.
- **Single point of failure** — if Google is down, ordering doesn't work. Google's uptime is 99.9%+. The caching + Instagram DM fallback covers this edge case.
- **No auto-refresh** — if stock changes while a user is browsing, they see the cached version. Stock is re-checked on order submission (server-side), so overselling can't happen.

---

## 14. Testing Checklist

### Before going live, verify all of these:

| # | Test | Expected result | Status |
|---|------|----------------|--------|
| T1 | Open site fresh | Products load from Sheet (check Network tab: GET to script.google.com) | ☐ |
| T2 | Change a product price in Sheet, refresh site | New price shows | ☐ |
| T3 | Set product stock to 4 in Sheet, refresh | Amber "Još samo 4!" badge appears | ☐ |
| T4 | Set product stock to 1, refresh | Red "Poslednji komadi!" badge | ☐ |
| T5 | Set product stock to 0, refresh | "Rasprodato" overlay + disabled button | ☐ |
| T6 | Try adding out-of-stock product to cart | Button disabled, can't add | ☐ |
| T7 | Add 5 units when stock=3 | Capped at 3 in cart | ☐ |
| T8 | Complete full order (fill all fields, submit) | Success confirmation with order ID shown | ☐ |
| T9 | Check Sheet → Narudžbine tab | New row with all order data, Status = "Nova" | ☐ |
| T10 | Check Sheet → Proizvodi tab | Stock decremented by ordered quantity | ☐ |
| T11 | Check owner's Gmail inbox | HTML order notification email received | ☐ |
| T12 | Check customer's email | Confirmation email with order ID received | ☐ |
| T13 | Submit order for item with stock=0 | Error message: "nema dovoljno na stanju" | ☐ |
| T14 | Disconnect internet, open site | Cached products show (if visited before) or error with DM link | ☐ |
| T15 | Open on mobile (phone) | Stock badges, checkout flow, confirmation all work | ☐ |
| T16 | Set `Aktivno=FALSE` on a product, refresh | Product disappears from site | ☐ |
| T17 | Add a new product row in Sheet, refresh | New product appears on site | ☐ |
| T18 | Add a new testimonial row, refresh | New review appears | ☐ |
| T19 | Submit contact form inquiry | Owner gets email with the message | ☐ |
| T20 | Place two orders quickly for last item | First succeeds, second gets stock error | ☐ |

---

## 15. How to Update the Apps Script

When we need to change the Apps Script code (bug fix, new feature), here's what the owner does:

1. Open the Google Sheet
2. Go to **Extensions → Apps Script**
3. Replace the code with the new version we provide
4. Click **Save** (💾)
5. Click **Deploy → Manage deployments**
6. Click the **pencil icon** (✏️) next to the active deployment
7. In the **"Version"** dropdown, select **"New version"**
8. Click **Deploy**
9. Done — the `/exec` URL now runs the new code

**⚠️ If you skip step 7 (new version), the old code keeps running.** This is Google's most confusing behavior — the URL is frozen to the version you deployed.

---

## 16. Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Testimonials source | Fetch from Sheet | Owner can add/edit reviews without developer |
| API failure fallback | Cached products + Instagram DM link | Users can still see products and reach the business |
| Contact form backend | Apps Script (not FormSubmit.co) | Centralized — one backend for everything |
| FormSubmit.co | Removed entirely | No longer needed for any form |
| Cart storage | Still localStorage | Cart is user state; doesn't need server sync at this scale |
| Product data cache | sessionStorage (60s TTL) | Clears on tab close for freshness; short TTL for stock accuracy |
| Stock concurrency | LockService.getScriptLock() | Prevents overselling last item |
| Payment processing | None (cash only) | Intentional — requires registered business for payment processing in Serbia |
| Phase 1 cart work | Preserved and adapted | AJAX form, Step 3 confirmation, toast, drawer expansion all reused |

---

## Files Summary

| File | Action | Scope of change |
|------|--------|----------------|
| `Code.gs` | **New** — pasted into Google Sheet's Apps Script editor | ~200 lines, full backend: GET products, POST orders, POST inquiries, email functions |
| `script.js` | **Major rewrite** | Remove hardcoded data (~80 lines), add API fetch + caching, stock validation, update form submission, contact form AJAX |
| `index.html` | **Moderate** | Remove FormSubmit.co fields, add loading skeleton container, update contact form |
| `styles.css` | **Additions** | Stock badge styles, out-of-stock overlay, loading skeleton, error banner |
| Google Sheet | **Created manually** | 5 tabs with product data, categories, testimonials, settings, order headers |
