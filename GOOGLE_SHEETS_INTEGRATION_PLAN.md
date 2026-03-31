# Google Sheets Integration Plan — Purple Star

> Saved for future implementation. Requires discussion with friend (the client).
> This replaces the current hardcoded product data + FormSubmit.co email system
> with a Google Sheets backend that handles inventory, orders, and emails — all free.

---

## Why Google Sheets?

| Criteria | Current (Hardcoded) | Google Sheets + Apps Script | Firebase/Supabase |
|---|---|---|---|
| **Cost** | Free | Free | Free tier (limited) |
| **Owner updates stock** | Needs developer every time | Edits a spreadsheet cell | Needs custom admin panel |
| **Stock auto-decrements** | No | Yes, on order submit | Yes |
| **Email to owner on order** | FormSubmit.co | Built into Apps Script | Needs separate service |
| **Customer confirmation email** | FormSubmit.co autoresponse | Built into Apps Script (customizable) | Needs separate service |
| **Complexity to build** | Zero | Moderate (one-time setup) | High |
| **Friend's skill required** | None — calls developer | Open spreadsheet, change a number | Learn a dashboard UI |
| **Offline editing** | No | Google Sheets mobile app | Usually no |
| **Data export** | Manual | Already a spreadsheet | Export needed |

**Google Sheets wins** because the "admin panel" is literally a spreadsheet — your friend already knows how to use it.

---

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────────┐
│                  │  GET    │                      │
│   Purple Star    │────────▶│  Google Apps Script   │
│   Website        │         │  (Web App endpoint)  │
│   (HTML/CSS/JS)  │◀────────│                      │
│                  │  JSON   │  Reads from:         │
│                  │         │  📊 Products Sheet   │
│                  │  POST   │  📊 Orders Sheet     │
│                  │────────▶│                      │
│                  │         │  On order:           │
│                  │◀────────│  1. Validate stock   │
│                  │ Success │  2. Decrement stock  │
│                  │ or Fail │  3. Log to Orders    │
│                  │         │  4. Email owner      │
└─────────────────┘         │  5. Email customer   │
                            └──────────────────────┘
                                      │
                            ┌─────────┴─────────┐
                            │                   │
                         📊 Products         📊 Orders
                         Google Sheet        Google Sheet
```

---

## Google Sheet Structure

### Sheet 1: "Proizvodi" (Products)

| Column | Name | Type | Example | Notes |
|--------|------|------|---------|-------|
| A | ID | Text | `sat-01` | Unique, never changes |
| B | Naziv | Text | `Satenski scrunchie — Klasik` | Product name shown on site |
| C | Kategorija | Text | `satenske` | Must match category keys |
| D | Cena | Number | `500` | In RSD (dinars) |
| E | Stanje | Number | `8` | Current stock. **This is what friend edits.** |
| F | Slika | URL | `https://...` | Full image URL |
| G | Alt tekst | Text | `Satenski scrunchie u klasičnoj boji` | Image alt text |
| H | Opis | Text | `Mekan satenski scrunchie...` | Product description |
| I | Istaknuto | TRUE/FALSE | `TRUE` | Featured product (sorted first) |
| J | Aktivno | TRUE/FALSE | `TRUE` | Set FALSE to hide without deleting |

**Friend's workflow to update stock:**
1. Open Google Sheets app on phone (or computer)
2. Find the product row
3. Change the number in column E (Stanje)
4. Done — site shows new stock within seconds

**Friend's workflow to add a new product:**
1. Add a new row at the bottom
2. Fill in all columns (copy format from existing row)
3. Done — appears on site immediately

### Sheet 2: "Kategorije" (Categories)

| Column | Name | Example |
|--------|------|---------|
| A | Ključ | `satenske` |
| B | Naziv | `Satenske` |

Simple lookup table. If friend adds a new category of products (e.g., trake za kosu), they add a row here.

### Sheet 3: "Narudžbine" (Orders)

Auto-populated by Apps Script when order is submitted. Friend never edits this — just reads it.

| Column | Name | Example |
|--------|------|---------|
| A | Datum | `2026-03-31 14:30` |
| B | ID narudžbine | `PS-20260331-001` |
| C | Ime | `Ana Petrović` |
| D | Email | `ana@example.com` |
| E | Telefon | `065 123 4567` |
| F | Preuzimanje | `BEX kurirska služba` |
| G | Adresa | `Knez Mihailova 10, Beograd` |
| H | Napomena | `Poklon pakovanje` |
| I | Stavke | `Satenski scrunchie — Klasik ×2, Plišani scrunchie — Soft ×1` |
| J | Ukupno | `1500` |
| K | Status | `Nova` |

The "Status" column is for friend to manually track: Nova → U pripremi → Poslato → Završeno.

### Sheet 4: "Utisci" (Testimonials) — optional

| Column | Name | Example |
|--------|------|---------|
| A | Ime | `Jelena M.` |
| B | Tekst | `Naručila sam set scrunchies...` |
| C | Lokacija | `Pančevo` |
| D | Aktivno | `TRUE` |

Friend can add/remove testimonials without developer.

### Sheet 5: "Podešavanja" (Settings) — optional

| Column | Name | Value |
|--------|------|-------|
| A/B | Email za notifikacije | `purplestar@gmail.com` |
| A/B | Niska zaliha - prag | `5` |
| A/B | Kritična zaliha - prag | `2` |
| A/B | Nedeljni rok (dan) | `0` (0=Sunday) |
| A/B | Nedeljni rok (sat) | `12` |

---

## Google Apps Script — What It Does

The script is a free Google Apps Script (runs on Google's servers, attached to the spreadsheet).
It's deployed as a **Web App** with a public URL that the site calls.

### Endpoint 1: GET — Fetch Products

```
GET https://script.google.com/macros/s/{SCRIPT_ID}/exec?action=products
```

**Returns JSON:**
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
  "testimonials": [...]
}
```

- Only returns products where Aktivno=TRUE and Stanje > 0 (or all with stock info, site decides display)
- Cached for 60 seconds to avoid hitting Google's rate limits on busy days
- Products with stock=0 are returned but marked, so the site can show "Rasprodato"

### Endpoint 2: POST — Submit Order

```
POST https://script.google.com/macros/s/{SCRIPT_ID}/exec
Content-Type: application/json

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

**What the script does on POST:**
1. **Validates** all required fields (name, email, phone, pickup, items)
2. **Checks stock** for each item — if any item has insufficient stock, returns error with details
3. **Decrements stock** in the Products sheet (atomic — checks and writes in one operation)
4. **Generates order ID** (e.g., `PS-20260331-001`)
5. **Logs order** to the Orders sheet
6. **Sends email to owner** with full order details (formatted HTML table)
7. **Sends confirmation email to customer** ("Hvala na narudžbini! Tvoj broj narudžbine je PS-20260331-001...")
8. **Returns success** with order ID

**Returns JSON:**
```json
{
  "success": true,
  "orderId": "PS-20260331-001",
  "message": "Narudžbina uspešno primljena!"
}
```

Or on error:
```json
{
  "success": false,
  "error": "stock",
  "message": "Nažalost, Satenski scrunchie — Klasik nema dovoljno na stanju (traženo: 5, dostupno: 3)"
}
```

### Rate Limiting & Security

- Apps Script has built-in rate limiting (~30 requests/sec for free accounts, more than enough)
- POST requests validate all input server-side (length, format, required fields)
- Honeypot field still used on the frontend
- Google's reCAPTCHA can optionally be added
- No sensitive data stored — no passwords, no payment info
- CORS headers set to allow only the production domain

---

## Website Changes Required

### script.js — Major Rewrite

**What changes:**
- `config.products` array → **removed**. Products fetched from Google Sheets API on page load
- `config.categories` → **removed**. Fetched from API
- `config.testimonials` → **removed**. Fetched from API (optional)
- New `fetchProducts()` async function with loading state and error handling
- `renderProducts()` now shows stock badges and handles out-of-stock
- `addToCart()` now validates against live stock (can't add more than available)
- `updateCartQty()` caps quantity at stock level
- Cart checkout flow → 3 steps: Items → Shipping Info → Confirmation
- Form submit → `fetch()` POST to Apps Script instead of FormSubmit.co
- New confirmation step (Step 3) shown after successful POST
- Loading spinners during API calls
- Error handling for network failures with retry option

**New cart flow (3 steps in drawer):**

```
Step 1: Cart Items                    Step 2: Shipping Info              Step 3: Confirmation
──────────────────                    ──────────────────                 ──────────────────
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

### index.html — Moderate Changes

- Remove `<form>` from cart drawer (JS builds it dynamically per step)
- Add Step 3 confirmation container
- Remove FormSubmit.co hidden fields (no longer needed)
- Contact section stays as general inquiry (already done)

### styles.css — Additions

- Stock badge styles (`.stock-badge`, `.stock-low`, `.stock-critical`, `.stock-out`)
- "Rasprodato" overlay on product cards
- Confirmation step styles
- Loading spinner
- Toast/notification for "Dodato u korpu" feedback

---

## Stock Urgency Badges — Design

On each product card, below the price:

| Stock Level | Badge | Color | Text |
|---|---|---|---|
| > 5 | None | — | — |
| 3–5 | Amber badge | `#d4a843` (--accent) | `Još samo X!` |
| 1–2 | Red badge | `#dc2626` | `Poslednji komadi!` |
| 0 | Card overlay | Gray | `Rasprodato` (button disabled) |

The thresholds (5 and 2) are configurable in the Settings sheet.

**Visual example on product card:**
```
┌──────────────────┐
│  [product image]  │
│                   │
│  Satenski — Klasik│
│  Satenske  500din │
│  ⚠️ Još samo 3!   │  ← amber badge
│  Mekan satenski...│
│  [Dodaj u korpu]  │
└──────────────────┘
```

```
┌──────────────────┐
│  [product image]  │
│  ── RASPRODATO ── │  ← semi-transparent overlay
│  Plišani — Zimska │
│  Plišane   500din │
│  Mekan plišani... │
│  [Rasprodato]     │  ← disabled, gray button
└──────────────────┘
```

---

## Email Templates

### Email to Owner (on new order)

**Subject:** `Nova narudžbina PS-20260331-001 — Purple Star`

**Body (HTML table):**
```
Nova narudžbina sa sajta!

Broj narudžbine: PS-20260331-001
Datum: 31.03.2026. u 14:30

Kupac:
  Ime: Ana Petrović
  Email: ana@example.com
  Telefon: 065 123 4567

Dostava:
  Način: BEX kurirska služba
  Adresa: Knez Mihailova 10, Beograd

Narudžbina:
  ┌─────────────────────────────┬─────┬──────────┐
  │ Proizvod                    │ Kom │ Cena     │
  ├─────────────────────────────┼─────┼──────────┤
  │ Satenski scrunchie — Klasik │  2  │ 1.000din │
  │ Plišani scrunchie — Soft    │  1  │   500din │
  ├─────────────────────────────┼─────┼──────────┤
  │ UKUPNO                      │  3  │ 1.500din │
  └─────────────────────────────┴─────┴──────────┘

Napomena: Poklon pakovanje

---
Stanje posle narudžbine:
  Satenski scrunchie — Klasik: 6 preostalo
  Plišani scrunchie — Soft: 4 preostalo
```

### Confirmation Email to Customer

**Subject:** `Tvoja narudžbina PS-20260331-001 — Purple Star ⭐`

**Body:**
```
Zdravo Ana,

Hvala na narudžbini! Primili smo tvoj zahtev i javićemo ti se u najkraćem roku.

Broj narudžbine: PS-20260331-001

Tvoja narudžbina:
  - Satenski scrunchie — Klasik × 2 = 1.000 din.
  - Plišani scrunchie — Soft × 1 = 500 din.
  UKUPNO: 1.500 din.

Način preuzimanja: BEX kurirska služba
Adresa: Knez Mihailova 10, Beograd

Sve narudžbine se šalju ponedeljkom. Ako imaš pitanja, javi nam se na Instagram (@_purple_star_13) ili odgovori na ovaj email.

Hvala što podržavaš ručni rad! 💜

— Purple Star
```

---

## Setup Steps (When Ready to Implement)

### Prerequisites
- [ ] Friend has a Gmail account (or creates one for the business)
- [ ] Friend's email confirmed for receiving order notifications
- [ ] Product list finalized (IDs, names, prices, stock counts, images)

### Step 1: Create Google Sheet
- [ ] Create new Google Sheet in friend's account
- [ ] Set up Products sheet with columns A–J
- [ ] Set up Categories sheet
- [ ] Set up Orders sheet (headers only — auto-populated)
- [ ] Enter all product data
- [ ] Share sheet with developer (edit access) for initial setup

### Step 2: Create Google Apps Script
- [ ] Open Sheet → Extensions → Apps Script
- [ ] Paste the Apps Script code (handles GET/POST)
- [ ] Configure email addresses in script settings
- [ ] Deploy as Web App (access: Anyone)
- [ ] Copy the deployment URL

### Step 3: Update Website
- [ ] Replace hardcoded product data with fetch() calls
- [ ] Implement 3-step cart flow in drawer
- [ ] Add stock badges and "Rasprodato" overlay
- [ ] Add loading states and error handling
- [ ] Remove FormSubmit.co from order form (keep for contact inquiry form)
- [ ] Test full flow: browse → add to cart → checkout → confirmation

### Step 4: Testing
- [ ] Test with real sheet data
- [ ] Test stock decrement on order
- [ ] Test out-of-stock handling
- [ ] Test email delivery to owner
- [ ] Test confirmation email to customer
- [ ] Test on mobile
- [ ] Test with slow connection (API loading states)
- [ ] Test error cases (network down, stock changed between cart and checkout)

### Step 5: Go Live
- [ ] Friend sets initial stock levels
- [ ] Deploy site with production Apps Script URL
- [ ] Friend tests placing a test order
- [ ] Verify emails arrive correctly

---

## Cost Summary

| Item | Cost |
|---|---|
| Google Sheets | Free |
| Google Apps Script | Free |
| Gmail (for sending emails) | Free |
| Website hosting (GitHub Pages / Netlify) | Free |
| Domain (optional, `.rs`) | ~1,000–1,500 din/year |
| **Total** | **Free** (or ~1,000 din/year with domain) |

---

## Limitations & Things to Know

1. **Google Apps Script quotas (free account):**
   - 100 emails/day (more than enough for this scale)
   - 20,000 URL fetch calls/day
   - 6 min max execution time per call (orders process in <5 seconds)

2. **Not real-time inventory:** If two people add the last item to their cart at the same moment, the first to submit gets it. The second gets a "stock insufficient" error. This is standard for small shops and extremely unlikely at this volume.

3. **No payment processing:** Customer still pays cash on pickup or cash-on-delivery (pouzeće). This is intentional — payment processing requires registrirana firma, POS agreement, monthly fees.

4. **Downtime:** Google's uptime is 99.9%+. If Google goes down, the site shows products from a cached version and displays "Naručivanje trenutno nije dostupno" with a fallback to Instagram DM.

5. **Migration path:** If the business outgrows this setup, the data is already in a structured spreadsheet — easy to export to any platform (Shopify, WooCommerce, etc.).

---

## Questions to Ask Friend Before Building

1. **Do you have a Gmail account?** (or are you willing to create one like purplestar13@gmail.com?)
2. **Are you comfortable editing a Google Sheet?** (show them what it looks like)
3. **How often do you make new scrunchies?** (determines how often stock updates happen)
4. **Do you want to get an email AND a notification for every order?** (Apps Script can also send to a Telegram bot or push notification)
5. **What should the "low stock" threshold be?** (Suggested: show warning at 5 or fewer, critical at 2 or fewer)
