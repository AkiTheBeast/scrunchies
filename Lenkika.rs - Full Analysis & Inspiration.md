# Lenkika.rs — Full Analysis & Inspiration for Our Project

> **Analysis date:** 2026-04-06
> **Website:** https://lenkika.rs/
> **Platform:** WordPress + WooCommerce (built by SAJTshop/SajtMajstor web agency)
> **Brand:** LenKika — mother-daughter team (Lenče + Kristina), est. 2021
> **Product range:** Scrunchies, bow scrunchies, pearl scrunchies, lala scrunchies, mini scrunchies, fluffy turban trake
> **Price range:** 200–990 RSD
> **Market:** Serbia (Serbian language, RSD pricing, Post Express delivery, pouzeće payment)

---

## Executive Summary

Lenkika.rs is a Serbian handmade hair accessories e-commerce store that is a **direct competitor** in our niche — same country, same language, same product type, same price range, same handmade positioning. The site runs on WooCommerce via a web agency template (SAJTshop), which gives it functional e-commerce out of the box but at the cost of a generic, template-heavy feel with several embarrassing oversights.

**What they do well:** They have a real, working e-commerce flow (cart → checkout → order), a large product catalog (~100+ products across 7 categories), functional sidebar filtering by category/price/material, wishlist functionality, sale badges with strikethrough pricing, and a mobile-responsive layout with a persistent bottom navigation bar. Their "About" page tells a genuine mother-daughter brand story that builds emotional connection, and they have full legal compliance pages (privacy, returns, terms).

**What they do poorly:** The site is riddled with template mistakes — their delivery page **literally contains the web agency's disclaimer** saying "This is just an example page with generic text" (they forgot to customize it). Their return policy page has the same issue with a **typo** ("primaer" instead of "primer"). Product descriptions are generic boilerplate copy-pasted across all items. Product photos are raw phone shots with inconsistent quality. There's no hero section, no testimonials, no FAQ, no social proof, no urgency elements, no brand visual identity beyond a simple logo. The checkout flow is heavyweight WooCommerce for items costing 250 RSD (~€2.15) — massive friction for impulse-price products.

**Overall inspiration score: 5/10.** Useful as a functional reference for what e-commerce features exist in this market, but NOT a design or UX role model. We should aim significantly higher in every category while learning from both their good decisions and their mistakes.

---

## 1. Design & Visual Identity

### Color Palette

| Element | Observation |
|---------|-------------|
| **Primary brand color** | None clearly defined — the site is predominantly white/grey with no strong accent color |
| **Background** | Plain white (`#ffffff`) |
| **Text** | Standard dark grey/black |
| **Sale badges** | Generic WooCommerce red/orange for discount percentages |
| **Links/buttons** | Default WooCommerce styling — no custom brand colors visible |
| **Footer** | White background, same as body — no visual separation |

**Verdict:** There is **no intentional color system**. The site has no brand color palette at all — it relies entirely on the WooCommerce template defaults. This is a missed opportunity for a handmade brand where visual identity should convey warmth, femininity, and craft.

**For our project:** Our current site uses a warm, earthy palette (caramel brand `#c9a087`, warm neutrals, rose and sage accents) — which is a **deliberate, cohesive color system** with proper custom properties and semantic tokens. While not purple-based (despite the "Purple Star" brand name — something worth revisiting with the client), the fact that we have ANY intentional color system already differentiates us from Lenkika's zero-effort approach. However, this gap also means Lenkika's lack of color identity is less of a benchmark and more of a bare minimum we've already cleared. The real question for us is whether our warm/earthy palette is the *right* identity for a scrunchie brand — something to discuss with the client.

### Typography

| Element | Observation |
|---------|-------------|
| **Headings** | Appear to use default WooCommerce/theme sans-serif fonts |
| **Body text** | Standard sans-serif, no distinctive character |
| **Product names** | Same font as body text, no typographic hierarchy |
| **Price display** | Standard weight, strikethrough for original prices |

**Verdict:** No custom typography. The site uses whatever the SAJTshop template provides. Zero personality or brand differentiation through fonts.

**For our project:** Our current fonts (DM Serif Display for headings + DM Sans for body) provide a clean, modern serif/sans pairing that has more personality than Lenkika's defaults. However, it's worth noting that our typography has evolved through multiple iterations (Fraunces → Playfair Display + Lora → DM Serif Display + DM Sans) — the current pairing is functional but we should evaluate whether it truly conveys the handmade/artisan feel the brand needs, or if it leans too modern/corporate.

### Imagery Style

| Aspect | Details |
|--------|---------|
| **Product photos** | Real phone photos — filenames reveal this: `IMG_20260204_101109_955.webp`, `20250510_153051.jpg`, `20250823_190122.jpg` |
| **Backgrounds** | Inconsistent — some products on fabric backgrounds, some on flat surfaces, some in-hand |
| **Lighting** | Variable natural light, some photos slightly dark or warm-tinted |
| **Aspect ratios** | Portrait orientation on product pages (~700×936), square thumbnails (150×150) |
| **Image count per product** | 1–4 images depending on the product |
| **Lifestyle imagery** | None visible — no "in use" photos, no flat-lays, no styled shots |
| **Hero/banner imagery** | None — no hero section exists |

**Verdict:** The photos are **authentic but amateurish**. They feel "real" (which has value for handmade authenticity) but lack consistency, proper lighting, and compositional standards. The inconsistency undermines trust — it looks like an Instagram seller, not a proper store.

**For our project:** When our client provides real photos, we should ensure a **standardized photo setup** (consistent background, lighting, framing) while keeping the handmade warmth. Even phone photos can look professional with a consistent setup. The gap between their photos and professional-looking ones is an easy win.

### Branding & Identity

- **Logo:** Simple text-based "Lenkika logo" — appears to be a plain wordmark with no icon or symbol
- **Brand name origin:** Len(če) + Kika = LenKika — explained on the About page, not on the homepage
- **Brand voice:** Formal Serbian, somewhat generic e-commerce language
- **Tagline:** None visible
- **Brand story:** Only on the dedicated "O nama" page — never surfaces on the homepage or product pages

**Verdict:** Minimal branding effort. The name is clever (mother-daughter portmanteau) but it's buried. No visual identity system beyond the logo. No tagline, no brand promise visible on the main shopping experience.

---

## 2. Layout & Page Structure

### Homepage (= Shop Page)

The homepage **IS** the product listing page. There is no traditional homepage with hero → sections → footer. Visitors land directly on the full product catalog.

```
┌─────────────────────────────────────────────────┐
│  HEADER                                         │
│  Hamburger — Logo (center) — Search — Cart icon │
├─────────────────────────────────────────────────┤
│  Main Navigation (drawer/dropdown)              │
│  Prodavnica | Kategorije | Nova kolekcija |     │
│  Dostava i plaćanje | O nama | Kontakt          │
├───────────────┬─────────────────────────────────┤
│  SIDEBAR      │  PRODUCT GRID                   │
│               │                                 │
│  Categories   │  [Card] [Card] [Card]           │
│  (7 items)    │  [Card] [Card] [Card]           │
│               │  [Card] [Card] [Card]           │
│  Price filter │  [Card] [Card] [Card]           │
│  (min/max)    │  ...                            │
│               │  Pagination: 1 2 3 ... 10 →     │
│  Material     │                                 │
│  filter       │                                 │
│  (checkboxes) │                                 │
│               │                                 │
│  Newest       │                                 │
│  products     │                                 │
│  (5 items)    │                                 │
├───────────────┴─────────────────────────────────┤
│  FOOTER                                         │
│  Logo — Social (FB, IG) — Legal links           │
└─────────────────────────────────────────────────┘
```

**Critical observation:** There is **no hero section, no value proposition, no "why buy from us."** A first-time visitor sees a wall of product thumbnails with zero context about what makes Lenkika special. This contradicts all e-commerce research — Baymard Institute, NNGroup, and HubSpot all emphasize that a homepage needs at minimum: brand promise → value proposition → product showcase.

### Product Grid

- **Columns:** Appears to be 3 columns on desktop (based on layout patterns)
- **Products per page:** ~12 per page, with 10 pages of pagination
- **Sort options:** Via sidebar — price filter (min/max slider), category filter, material filter
- **No** sort dropdown (newest, price low→high, price high→low) visible
- **Pagination:** Numbered pages (1, 2, 3... 8, 9, 10) — not infinite scroll

### Product Card Structure

```
┌────────────────────────┐
│  [Product Image]       │  ← Portrait ratio
│  [Wishlist heart icon] │  ← "Dodaj u Listu Želja" overlay
├────────────────────────┤
│  Product Name          │  ← Linked heading
│                        │
│  ̶2̶9̶0̶,̶0̶0̶ ̶R̶S̶D̶           │  ← Strikethrough original price
│  250,00 RSD            │  ← Current sale price
│                        │
│  [-] [qty] [+]         │  ← Quantity selector IN the card
│  [DODAJ U KORPU]       │  ← Add to cart button
└────────────────────────┘
```

**Notable:** The quantity selector (+/-) is **on the product card in the listing page**, not just on the product detail page. This is unusual — most stores show only the "add to cart" button on listings and offer quantity selection on the product page or in the cart. Having it on the card reduces clicks for repeat customers who know what they want, but adds visual clutter.

### Category Pages

- Use the **same layout** as the homepage but filtered to a single category
- Breadcrumbs: Početna → [Category name]
- Same sidebar (categories, price, material, newest)
- Pagination per category (e.g., Lala Scrunchie has 2 pages, Pearls Scrunchie has 2 pages)

### Footer

```
┌─────────────────────────────────────────────────┐
│  [Lenkika logo]                                 │
│  "Posetite nas i na društvenim mrežama:"        │
│  [Facebook icon] [Instagram icon]               │
│                                                 │
│  Kontakt                                        │
│  Dostava i plaćanje                             │
│  Politika povraćaja i vraćanja novca            │
│  Opšti uslovi korišćenja                        │
│  O nama                                         │
│                                                 │
│  © 2026 Lenkika. Sva prava zadržana |           │
│  SAJTshop internet prodavnica                   │
└─────────────────────────────────────────────────┘
```

**Issues:**
- Footer is visually flat — same white background as the rest of the page, no color contrast
- Only 2 social channels linked (Facebook, Instagram)
- The "SAJTshop internet prodavnica" credit link in the footer screams "template website" — this is a trust-damaging detail for a handmade brand

**For our project:** Our current 3-column footer (Brand/logo + location | Nav links | Social) is already better structured and fully implemented. We should NEVER include a "built by" credit in the visible footer — if credit is desired, it can go in an HTML comment or a tiny, separate attribution page.

---

## 3. Navigation & User Flows

### Main Navigation

On desktop, the navigation appears as a top-level menu with dropdown behavior for categories:

| Menu Item | Links to |
|-----------|----------|
| PRODAVNICA | Homepage (shop page) |
| KATEGORIJE PROIZVODA | Dropdown with 7 categories |
| NOVA KOLEKCIJA | Links to "Nova kolekcija" category |
| DOSTAVA I PLAĆANJE | Delivery/payment info page |
| O NAMA | About page |
| KONTAKT | Contact page |

Additionally:
- **LISTA ŽELJA** (Wishlist) — in utility nav
- **PRIJAVA / REGISTRACIJA** (Login/Register) — user account page
- **Search** — search icon in header
- **Cart** — cart icon with item count badge

### Mobile Navigation

- **Hamburger menu** top left for main nav
- **Bottom fixed bar** with 4 items: Shop | Filteri | Lista Želja (with count) | Korpa (with count)
- Logo centered in header
- Search icon
- Cart icon with count

**The mobile bottom bar is notable.** It provides persistent access to: the shop, filters (opens sidebar), wishlist, and cart. This is a **good mobile pattern** — keeping the key shopping actions always reachable without scrolling.

### User Flow: Browse → Buy

```
Homepage (all products)
  │
  ├── Filter by category (sidebar) ──→ Category page
  ├── Filter by price (min/max slider)
  ├── Filter by material (checkboxes)
  │
  ├── Click product image/name ──→ Product detail page
  │     ├── View image gallery (zoom)
  │     ├── Read description
  │     ├── See similar products
  │     ├── Add to wishlist
  │     └── Set qty → DODAJ U KORPU
  │
  ├── Add to cart directly from listing
  │     └── Quantity +/- → DODAJ U KORPU
  │
  └── Side-panel cart opens
        ├── View items
        ├── "POVRATAK U PRODAVNICU" (back to shop)
        └── Go to Korpa page
              │
              └── KORPA → UNOS PODATAKA → GOTOVA NARUDŽBINA
                  (Cart → Checkout form → Order confirmation)
```

### Wishlist Flow

- "Dodaj u Listu Želja" link appears on every product card and product detail page
- Wishlist page (`/wishlist/`) shows saved items or "Lista želja je prazna" with "POVRATAK U PRODAVNICU" button
- Counter updates in nav: "0 Lista Želja"
- Uses YITH WooCommerce Wishlist plugin (standard WooCommerce addon)

### Cart Flow

- **Slide-out cart panel:** Clicking the cart icon opens a right-side panel that shows cart contents or "Nema proizvoda u korpi." (No products in cart)
- **Cart page** (`/korpa/`): Full page cart view with a 3-step progress indicator: `KORPA → UNOS PODATAKA → GOTOVA NARUDŽBINA`
- **Checkout page** (`/placanje/`): Standard WooCommerce checkout form
- Empty cart message: "Vaša korpa je trenutno prazna…" with "Vratite se u prodavnicu i dodajte nešto u kopru." — **Note: "kopru" is a TYPO** (should be "korpu") — embarrassing for a live store

**Verdict on user flows:** Functional but generic. The WooCommerce standard flows work, but there's nothing tailored to the handmade/artisan experience. No personal touch, no WhatsApp alternative, no "quick order" shortcut. For items priced at 250 RSD (~€2.15), the full checkout process (registration, address, payment selection) is **disproportionately heavy**.

---

## 4. Product Experience

### Product Detail Page Structure

```
┌─────────────────────────────────────────────────┐
│  Breadcrumb: Početna > [Category] > [Product]   │
├───────────────────┬─────────────────────────────┤
│                   │                             │
│  Image Gallery    │  Product Name (H1)          │
│  ┌─────────────┐  │                             │
│  │             │  │  Price:                     │
│  │  Main Image │  │  ̶2̶9̶0̶,̶0̶0̶ ̶R̶S̶D̶               │
│  │  [zoom icon]│  │  250,00 RSD                 │
│  │             │  │                             │
│  └─────────────┘  │  Short description          │
│  [thumb] [thumb]  │  (1-2 sentences)            │
│                   │                             │
│  Sale badge:      │  [-] [qty] [+]              │
│  "-14%" or "-34%" │  [DODAJ U KORPU]            │
│                   │                             │
│                   │  Kategorija: [link]          │
│                   │  Oznaka: gimca za kosu       │
│                   │                             │
│                   │  [Dodaj u Listu Želja]       │
├───────────────────┴─────────────────────────────┤
│  Long Description (expandable/tabbed?)          │
│  Full product description paragraph             │
├─────────────────────────────────────────────────┤
│  Slični proizvodi (Similar products)            │
│  [Card] [Card] [Card] [Card] [Card]             │
└─────────────────────────────────────────────────┘
```

### Photo Analysis (Per Product)

| Product | Images | Quality | Notes |
|---------|--------|---------|-------|
| **Barbie** (Standard Scrunchie) | 2 images | Phone photo, warm lighting, fabric background | Filenames: `IMG_20260204_101109_955.webp`, `20250823_190122.jpg` — mixed formats |
| **Bela Turban traka** | 1 image | Phone photo, decent exposure | Single image for a 990 RSD product — insufficient |
| **Unicorn Dream Mint** (Nova kolekcija) | 4 images | Better quality, multiple angles | Best presentation on the site — this is the ideal they should aim for everywhere |
| **Bow Scrunchie products** | 1-2 images each | Varies | Some have only 1 photo |

**Key issue:** Image count and quality are **inconsistent across products**. Some have 4 well-shot images, others have a single mediocre phone photo. For items where the visual appeal IS the product (fashion accessories), this inconsistency directly hurts conversion.

### Image Zoom

- "Uvećaj sliku" (Zoom image) icon visible on product images
- Likely lightbox/zoom functionality via WooCommerce default or theme plugin
- Good feature — lets customers inspect fabric texture and details

### Product Descriptions

**Short description (above the fold):**
For "Barbie" (Standard Scrunchie):
> "Scrunchie gumica ručno rađena od pažljivo biranih materijala, nežna prema kosi i savršena za svaki dan – bez kidanja i lomljenja."

**Long description (below the fold):**
> "LenKika Scrunchie gumice su ručno rađeni modni detalji koji spajaju estetiku, udobnost i funkcionalnost. Izrađene od kvalitetnih i nežnih materijala, ne zatežu kosu, ne ostavljaju tragove i pomažu u sprečavanju lomljenja vlasi. Zahvaljujući pažljivoj izradi i modernim dezenima, savršene su kako za svakodnevne frizure, tako i kao suptilan modni akcenat. Idealne su za rep, punđu ili nošenje kao narukvica kada nisu u kosi."

**CRITICAL PROBLEMS:**
1. **Hair damage claims** — "nežna prema kosi... bez kidanja i lomljenja" / "ne zatežu kosu, ne ostavljaju tragove i pomažu u sprečavanju lomljenja vlasi" — These are exactly the **performance promises we identified as liability risks** in our own project (see Work Log #12). If a customer's hair breaks, these claims could be used against them.
2. **Generic/identical descriptions** — The long description appears to be the **same boilerplate text** across all Standard Scrunchie products. Every "Barbie," "Black Diamond," "Blue Sky" etc. likely has the same description paragraph. This is bad for SEO (duplicate content) and useless for the customer trying to understand differences between products.
3. **No material specifics per product** — Materials are only listed as sidebar filter options (85% micro polyester/15% polyamid, Likra sa premazom, Pliš, Silk saten) but NOT on individual product pages. A customer viewing "Barbie" has no idea what material it's made of.
4. **Some products have NO description at all** — "Unicorn Dream Mint" (350 RSD, Nova kolekcija) has **zero description text** — just a price and an "add to cart" button.

### Pricing Display

| Price Pattern | Example | Notes |
|---------------|---------|-------|
| **Sale price** | ~~290,00 RSD~~ → 250,00 RSD | Strikethrough original + bold current price |
| **Regular price** | 350,00 RSD | Plain display, no context |
| **Percentage badge** | "-14%", "-34%" | On product image, top-left corner |
| **Currency format** | `XXX,XX RSD` | Serbian format with comma decimal separator |

**Observation:** Almost every Standard Scrunchie shows as "on sale" (290 → 250 RSD). When **everything** is on sale, **nothing** feels on sale. This is a classic psychological pricing trap — permanent discounts lose their urgency effect and just become the real price with a crossed-out fake original. The Turban Trake discount (1,490 → 990 RSD, -34%) is more believable as a genuine markdown.

### Product Categories

| Category | Emoji | Approx. Products | Price Range |
|----------|-------|-------------------|-------------|
| Bow Scrunchie | 🎀 | ~9+ | 250 RSD (sale from 290) |
| Fluffy Turban Trake | — | ~6+ | 990 RSD (sale from 1,490) |
| Lala Scrunchie | 🌷 | 12+ (2 pages) | 450–460 RSD |
| Mini Scrunchie | — | Unknown | Unknown |
| Nova kolekcija | — | ~5+ | 350–450 RSD |
| Pearls Scrunchie | — | 12+ (2 pages) | 300–350 RSD |
| Standard Scrunchie | — | 20+ (2+ pages) | 200–250 RSD (sale from 250–290) |

**Issue with emoji in categories:** Using 🎀 and 🌷 in category names means these emoji appear in URLs: `/kategorija-proizvoda/bow-scrunchie-%f0%9f%8e%80/`. This is **terrible for SEO** — encoded emoji in URLs are ugly, unmemorable, and potentially problematic for some systems. Category names should be clean text.

### Product Naming

Products use English color/style names for a Serbian-language site:
- "Barbie", "Black Diamond", "Blue sky", "Cherry Lady", "Midnight Barbie", "Monroe Moment", "Paris Chic", "Pink Rebel", "Rose Romance", "Sweet Blush", "Velvet Wine", "Unicorn Dream Mint"

**Analysis:** This is a deliberate style choice — English names feel "fashionable" and international to Serbian consumers. It works for a fashion/beauty brand. However, some names are **repeated across categories** (e.g., "Bery bery" appears as a Pearls Scrunchie, a Standard Scrunchie, AND a Lala Scrunchie, with different URLs: `/bery-bery/`, `/bery-bery-2/`, `/bery-bery-3/`). This is **confusing** — a customer can't tell which "Bery bery" is which without clicking each one.

### Similar Products Section

- Shows 5 "Slični proizvodi" (Similar products) at the bottom of every product page
- Appears to show products from the same category
- Each card has image, name, price, quantity selector, add-to-cart button, and wishlist link
- **Good feature** — encourages continued browsing and cross-selling

---

## 5. Conversion & Trust Elements

### Calls to Action (CTAs)

| CTA | Location | Style | Notes |
|-----|----------|-------|-------|
| **DODAJ U KORPU** | Product cards, product pages | Button, all-caps | Primary CTA — standard WooCommerce |
| **Dodaj u Listu Želja** | Product cards, product pages | Text link with heart icon | Secondary CTA |
| **POVRATAK U PRODAVNICU** | Empty cart, empty wishlist | Button/link | Redirects back to shop |
| **POŠALJI** | Contact form | Button | Submit contact form |
| **FILTER** | Price filter sidebar | Button | Apply price filter |

**Missing CTAs:**
- No "Buy now" / express checkout button
- No "Message us on WhatsApp/Instagram/Viber" quick contact CTA
- No "Order via DM" alternative for social-media-native customers
- No floating contact button (WhatsApp, Viber, etc.)

### Urgency & Scarcity Elements

- **Sale badges** with percentage discounts (-14%, -34%) — but overused (nearly everything is "on sale")
- **NO stock indicators** — no "Only 3 left!", no "Low stock" badge, no stock count
- **NO time-limited offers** — no countdown timers, no "sale ends" dates
- **NO "new arrival" badges** — despite having a "Nova kolekcija" category, individual products don't show a "New" badge on the card

**Verdict:** Almost zero urgency/scarcity elements. The permanent sale prices actually **reduce** urgency because there's no reason to buy now vs. later — the "sale" will still be there tomorrow.

### Trust Signals

| Signal | Present? | Quality |
|--------|----------|---------|
| **Customer reviews/ratings** | ❌ No | No review system visible anywhere |
| **Testimonials** | ❌ No | No testimonials section |
| **Social proof** (order count, popularity) | ❌ No | No "X sold" or "popular" indicators |
| **Brand story** | ✅ Yes | On About page — genuine mother-daughter story |
| **Real product photos** | ✅ Yes | Authentic but inconsistent quality |
| **Legal compliance pages** | ✅ Yes | Privacy policy, returns, terms — BUT template text! |
| **SSL** | ✅ Yes | HTTPS enabled |
| **Cookie consent** | ✅ Yes | Banner with "PRIHVATI" and link to privacy policy |
| **Payment trust badges** | ❌ No | No Visa/Mastercard/secure payment icons |
| **Delivery guarantees** | ⚠️ Partial | "2–7 radnih dana" mentioned but TEMPLATE TEXT disclaimer visible |
| **Social media links** | ✅ Yes | Facebook + Instagram in footer |

**CRITICAL TRUST FAILURE:** The delivery page (`/dostava-i-placanje/`) contains:
> "VAŽNA NAPOMENA: Ovo je samo primer stranice sa opštim tekstom vezanim za dostavu i plaćanje. Možete koristiti ovaj tekst na svom sajtu ALI SajtMajstor ni u kom slučaju ne snosi odgovornost ukoliko odlučite da koristite ovaj tekst."
>
> (IMPORTANT NOTE: This is just an example page with generic text related to delivery and payment. You can use this text on your site BUT SajtMajstor is in no way responsible if you decide to use this text.)

They **left the web agency's template disclaimer** visible on a live, customer-facing page. The return policy page has the same issue, plus a typo ("primaer" instead of "primer"). This is a **devastating trust signal** — it tells customers the store owner didn't bother reading or customizing their own policies, and it exposes the behind-the-scenes template nature of the site.

### Cart Behavior

- **Slide-out cart panel** opens from the right when items are added or cart icon is clicked
- Shows items or "Nema proizvoda u korpi." (No products in cart)
- "POVRATAK U PRODAVNICU" button to continue shopping
- Separate full cart page at `/korpa/` with 3-step checkout breadcrumb
- **Cart typo:** "dodajte nešto u kopru" — "kopru" should be "korpu" (cart)
- No mini-cart with quantity editing — needs to go to full cart page
- No "continue shopping" suggestions when cart is empty
- No estimated delivery or order total preview in the slide-out panel

### Checkout Flow

3-step process displayed visually:
1. **KORPA** (Cart) — review items, quantities, subtotal
2. **UNOS PODATAKA** (Enter details) — shipping address, payment method, account creation
3. **GOTOVA NARUDŽBINA** (Completed order) — confirmation

**Standard WooCommerce checkout.** Functional but heavy for low-value items. A customer buying a 250 RSD scrunchie is asked to create an account, enter full shipping details, select payment method, agree to terms — the same process as buying a laptop. This is a **conversion killer** for impulse purchases.

---

## 6. Technical & Performance Notes

### Tech Stack

| Component | Technology |
|-----------|-----------|
| **CMS** | WordPress |
| **E-commerce** | WooCommerce |
| **Theme/Builder** | SAJTshop custom theme (by sajtmajstor.com) |
| **Wishlist** | YITH WooCommerce Wishlist (or similar) |
| **Image formats** | Mix of `.webp` and `.jpg` — some optimization, not consistent |
| **SSL** | Yes (HTTPS) |
| **Cookie consent** | JavaScript banner with "PRIHVATI" button |
| **Hosting** | Not identifiable from crawl |

### Image Optimization

- Product images served in multiple sizes: 150×150 (thumbnails), 700×936 (full), and original sizes
- Some images use `.webp` format (modern, compressed) while others are `.jpg` — **inconsistent optimization**
- Image filenames are raw camera filenames (`IMG_20260204_101109_955.webp`, `20250510_153051.jpg`) — **zero SEO value** from filenames
- Alt text: Present but generic ("Barbie", "Unicorn Dream Mint" — just the product name, not descriptive)

### Responsiveness

- **Mobile layout:** Single-column product grid, hamburger nav, bottom fixed bar
- **Tablet:** Likely 2-column grid (inferred from "tablet" reference in footer bar)
- **Desktop:** 3-column grid with sidebar
- Bottom bar labels: "Shop | Filteri | Lista Želja | Korpa" — persistent mobile navigation

### Performance Observations

- WordPress/WooCommerce is inherently heavier than our static HTML/CSS/JS approach
- Multiple plugins likely loaded (WooCommerce, wishlist, cookie consent, contact form, etc.)
- Pagination (10 pages) means no infinite scroll performance concerns, but requires separate requests for each page
- No visible lazy loading indicators (images may or may not lazy load)
- Cart uses AJAX (slide-out panel updates without full page reload) — good

### SEO Observations

- URL structure: `/proizvod/[product-slug]/` for products, `/kategorija-proizvoda/[category-slug]/` for categories
- Breadcrumbs present on product and category pages
- Category tags and product tags visible (e.g., "gimca za kosu")
- **Major SEO issues:**
  - Duplicate product descriptions across products (copy-pasted)
  - Emoji in category URLs
  - Generic image alt text (just product name)
  - Raw camera filenames for images
  - Same-named products across categories ("Bery bery" ×3, "Blue sky" ×3)
  - No blog/content section for organic traffic

---

## 7. Standout Features Worth Stealing

Despite the many weaknesses, there are several features and patterns worth adapting for our project:

### 7.1 Mobile Bottom Navigation Bar ⭐⭐⭐
**What:** A fixed bottom bar on mobile with 4 key actions: Shop, Filters, Wishlist, Cart — always visible as the user scrolls.

**Why it works:** On mobile, the header can scroll away, but the bottom bar keeps the most important shopping actions within thumb reach at all times. This is a proven mobile e-commerce pattern (used by Amazon, AliExpress, etc.).

**How to adapt:** We could implement a simpler version: `Proizvodi | Korpa | Kontakt` (or `Naruči`) — keeping it aligned with our direct-order flow. We currently don't have a mobile bottom bar or a floating contact button, so this is a genuine gap we should consider filling.

### 7.2 Sidebar Filtering (Categories + Price + Material) ⭐⭐
**What:** Left sidebar with category links, price range slider (min/max), material checkboxes, and "newest products" list.

**Why it works:** Multi-faceted filtering helps customers with a specific need ("I want a silk satin scrunchie under 400 RSD") find products quickly. Material filtering is especially relevant for hair accessories where texture and fabric matter to customers.

**How to adapt:** Our current implementation uses category filter pills, which is lighter and arguably better for a smaller catalog. But as the catalog grows, adding material/price filtering could be valuable. The **material filter in particular** is worth considering — it directly addresses how customers think about scrunchies ("I want satin" vs. "I want plush").

### 7.3 Wishlist Functionality ⭐⭐
**What:** Heart icon on every product card and detail page, dedicated wishlist page, counter in navigation.

**Why it works:** For products that are aesthetic/fashion-driven, wishlists let customers save items they like without committing to purchase. Useful for: returning later, comparing options, sharing preferences.

**How to adapt:** For our scale (small catalog, direct-order model), a full wishlist might be overengineered. But a simpler "save for later" feature using localStorage — or even just a "share this product" link — could serve a similar purpose without WooCommerce complexity.

### 7.4 Quantity Selector on Product Cards ⭐
**What:** The `[-] [1] [+]` quantity selector appears directly on product cards in the listing view, not just on the product detail page.

**Why it works:** For repeat customers who know what they want, this saves a click. They can add 3 of the same scrunchie directly from the browsing view.

**How to adapt:** Our cart system will have quantity selection. Whether to put it on the card or only in the cart/product view depends on our card design. For our clean, minimalist card design, adding a quantity selector might make cards feel cluttered. **Recommendation:** Keep the card clean with a single "Dodaj u korpu" button (adds 1), and allow quantity editing in the cart.

### 7.5 "Similar Products" Section ⭐⭐⭐
**What:** Every product page shows 5 "Slični proizvodi" at the bottom — other products from the same category.

**Why it works:** This is a **critical cross-selling and engagement tool**. If a customer doesn't like the exact scrunchie they clicked on, they immediately see alternatives without going back to the grid. It reduces bounce and increases average time on site.

**How to adapt:** We should absolutely implement this. When showing a product detail view (if we add one), include 3-4 related products below it. Could also work as "Ti bi mogla voleti i..." ("You might also like...") to make it feel more personal.

### 7.6 Sale Badge with Percentage ⭐
**What:** A small badge on the product image corner showing the discount percentage ("-14%", "-34%").

**Why it works:** Precise percentages feel more credible than vague "SALE" labels. Shows the customer exactly how much they're saving at a glance.

**How to adapt:** When we do run genuine promotions (e.g., launch discount, holiday sale), we should show percentage badges. But **only for genuine, time-limited sales** — not permanent "fake" markdowns like Lenkika does.

### 7.7 Breadcrumbs on Product Pages ⭐
**What:** Navigation trail showing `Početna > [Category] > [Product Name]`.

**Why it works:** Helps users understand where they are in the site hierarchy and navigate back to category views. Also provides SEO-friendly internal links.

**How to adapt:** Since our current site is a single page, breadcrumbs don't apply yet. But if/when we add individual product pages or category views (growth step), breadcrumbs should be included.

---

## 8. Weaknesses & Things to Avoid

### 8.1 Template Text Left on Live Pages 🚨🚨🚨
**Severity: CRITICAL**

The delivery page and return policy page contain **the web agency's template disclaimers** in plain view:
> "VAŽNA NAPOMENA: Ovo je samo primer stranice sa opštim tekstom..."

**Plus a typo on the return policy page**: "primaer" instead of "primer."

**Lesson for us:** Every single word on our site must be intentional, proofread, and customized. No placeholder text should ever reach production. Our existing process of using placeholder markers (e.g., `info@example.com` for FormSubmit.co) that are clearly marked in the work log is acceptable during development, but we must have a rigorous checklist before launch to replace ALL placeholders.

### 8.2 Cart Page Typo 🚨
**Severity: HIGH**

"Vratite se u prodavnicu i dodajte nešto u **kopru**" — should be "korpu." This is a visible customer-facing typo on a critical page (the cart). It undermines professionalism.

**Lesson for us:** Proofread all Serbian text carefully. Have a native speaker review before launch.

### 8.3 No Homepage — Just a Product Dump 🚨🚨
**Severity: HIGH**

Landing directly on 100+ products with zero context is **hostile to new visitors.** NNGroup research shows 57% of viewing time is above the fold, and users decide within seconds whether a site is worth engaging with. A wall of product thumbnails with no headline, no value proposition, and no brand identity fails this test.

**Lesson for us:** Our current structure (Hero → Marquee strip → Products → Testimonials → How to Order → Delivery → About → FAQ → Contact) is already significantly better. We introduce the brand with a hero section and show key selling points before presenting the catalog, giving visitors context and emotional connection before asking them to shop.

### 8.4 Generic/Identical Product Descriptions 🚨🚨
**Severity: HIGH**

The same description paragraph is copy-pasted across all Standard Scrunchie products. Some products (like Unicorn Dream Mint) have **no description at all**.

**Lesson for us:** Every product should have a unique, specific description mentioning its color, material, and unique characteristics. Even if descriptions are short (2-3 sentences), they must be product-specific. Our current placeholder descriptions follow this principle — each product has unique text.

### 8.5 Hair Damage Claims (Liability Risk) 🚨🚨
**Severity: HIGH**

Descriptions say: "ne zatežu kosu, ne ostavljaju tragove i pomažu u sprečavanju lomljenja vlasi" (don't pull hair, don't leave marks, help prevent breakage). These are **performance promises** that could become liability issues.

**Lesson for us:** We already identified and fixed this in Work Log #12. Describe what the product IS (materials, construction), not what it WON'T do. This confirms our approach was correct.

### 8.6 Permanent Fake Sales 🚨
**Severity: MEDIUM**

Nearly every Standard Scrunchie is "on sale" from 290 to 250 RSD. When everything is always on sale, the credibility of the discount evaporates. Customers quickly learn the "original" price was never real.

**Lesson for us:** Only show sale prices for genuine, time-limited promotions. Our everyday prices should be the real prices — no fake markdowns. When we do run a sale (e.g., holiday, launch special), it will feel genuine because it's the exception, not the rule.

### 8.7 Duplicate Product Names Across Categories 🚨
**Severity: MEDIUM**

"Bery bery" exists as a Pearls Scrunchie (350 RSD), a Standard Scrunchie (250 RSD), AND a Lala Scrunchie (450 RSD) — with URLs `/bery-bery/`, `/bery-bery-2/`, `/bery-bery-3/`. Same for "Flamingo," "Blue sky," "Gold," "Marlena" — all appear multiple times.

**Lesson for us:** Product names should be **unique across the entire catalog.** If the same color/name appears in multiple categories, suffix it clearly: "Bery Bery — Satenski," "Bery Bery — Perlice," etc. Unique names are essential for SEO, customer clarity, and order-processing accuracy.

### 8.8 Emoji in Category Names/URLs ⚠️
**Severity: MEDIUM**

"Bow Scrunchie 🎀" becomes `/kategorija-proizvoda/bow-scrunchie-%f0%9f%8e%80/` in the URL. Ugly, unmemorable, and potentially problematic in some email clients or CRM systems.

**Lesson for us:** Keep category names clean. If emojis are desired for visual flair, add them in the UI display layer only — never in the URL slug.

### 8.9 Heavyweight Checkout for Low-Value Items ⚠️
**Severity: MEDIUM**

Full WooCommerce checkout (account creation, address, payment selection) for a 250 RSD (~€2.15) scrunchie. The checkout friction is disproportionate to the purchase value.

**Lesson for us:** Our direct-order approach (browse → add to cart → submit order with name/phone/email/delivery choice) is already lighter. We should keep our order form as simple as possible — name, phone, email, delivery preference, optional note. No account creation requirement.

### 8.10 No Social Proof / No Reviews ⚠️
**Severity: MEDIUM**

Zero customer reviews, zero testimonials, zero social proof indicators anywhere on the site. For a handmade product where quality can't be verified before purchase, this is a significant trust gap.

**Lesson for us:** Our testimonials section (even with placeholder data) already addresses this. When we launch with real testimonials, we'll have a clear advantage.

### 8.11 No WhatsApp / Direct Contact for Orders ⚠️
**Severity: MEDIUM (for their model)**

The only contact method is a generic form on the `/kontakt/` page. No WhatsApp, no Instagram DM link, no Viber — despite these being the primary communication channels for Serbian online shoppers, especially for handmade products.

**Lesson for us:** Our current contact channels (Email + Instagram) are more visible than Lenkika's hidden contact page, but we're still missing the most powerful channel for Serbian e-commerce: WhatsApp/Viber. Adding a floating WhatsApp button and direct-message ordering option is a clear opportunity to improve our conversion flow and create a genuine competitive advantage.

### 8.12 English Product Names in Serbian Site ⚠️
**Severity: LOW**

All product names are in English ("Cherry Lady," "Rose Romance," "Paris Chic") on a Serbian-language site. While this works as a fashion brand choice, it limits SEO reach — Serbian customers might search for "roze gumice za kosu" not "Pink Rebel scrunchie."

**Lesson for us:** Consider a hybrid approach — Serbian product names with optional English color/style subtitles. Or at minimum, include Serbian keywords in product descriptions for SEO purposes.

---

## 9. Specific Recommendations for Our Store

### Elements We Should Directly Adapt

| Feature | From Lenkika | Our Adaptation |
|---------|-------------|----------------|
| **Mobile bottom nav** | Fixed bar: Shop, Filters, Wishlist, Cart | Fixed bar: `Proizvodi`, `Korpa`, `Naruči` — simpler, aligned with our direct-order model |
| **Similar products** | 5 related products on product detail pages | Show 3-4 related items when a product is selected or in a quick-view modal |
| **Sale badges** | Percentage badge on product image | Use sparingly for genuine promotions only |
| **Breadcrumbs** | Path navigation on product/category pages | Add when we introduce individual product views (future) |
| **Material labeling** | Sidebar filter by material | Add material badge/tag on product cards (e.g., "Saten", "Pliš") — helps customers filter mentally |
| **Image gallery with zoom** | Multiple product images, zoom on click | Support 2-4 images per product with lightbox/zoom when we have real photos |
| **Category navigation** | Sidebar list + filtering | Enhance our filter pills to include material type as additional filter dimension |

### Elements We Should Improve Upon

| Their Weakness | Our Improvement |
|----------------|-----------------|
| **No hero/value proposition** | Keep our Hero section with emotional headline, benefit-focused subheadline, and 2 clear CTAs |
| **No brand story on homepage** | Keep About section integrated into the main page flow (currently between Delivery and FAQ sections) |
| **Template/placeholder text on legal pages** | Write all content bespoke or at minimum fully customize template text; proofread with native speaker |
| **Generic product descriptions** | Each product gets unique, specific description (color, material, unique characteristics) |
| **Hair damage claims** | Describe materials and construction only — no performance promises |
| **Permanent fake sales** | Honest everyday pricing; genuine sales only for special occasions |
| **No testimonials** | Our testimonials section with real reviews (to be collected from client) |
| **No FAQ** | Our accordion FAQ answering real customer questions |
| **No WhatsApp/direct contact** | Currently Email + Instagram only — adding WhatsApp/Viber floating button is a priority improvement to match Serbian consumer expectations |
| **Heavyweight checkout** | Our lightweight cart-drawer order flow: browse → add to cart → fill short form (name, phone, email, delivery, note) → submit via FormSubmit.co. Google Sheets backend is planned but not yet implemented |
| **Inconsistent product photos** | Help client set up standardized photo setup (consistent background, lighting, framing) |
| **Emoji in URLs** | Clean URL slugs; emoji/icons in display layer only |
| **Duplicate product names** | Unique names across entire catalog |

### New Hybrid Ideas (Combining Their Strengths with Our Best Practices)

**1. Material Badges on Product Cards**
Combine their material filtering concept with our clean card design. Instead of a sidebar filter, add a small colored badge on each product card: `Saten` (peach/gold tint), `Pliš` (warm purple), `Pamuk` (natural beige). This gives customers instant material identification while scrolling.

**2. Smart Similar Products**
Take their "Slični proizvodi" concept but make it smarter: instead of just same-category products, show complementary items. If someone views a satin scrunchie, show a satin scrunchie in a different color (same material, different look) AND a product from a different category (cross-sell). Label it "Pogledaj i ove" ("Check these out too").

**3. Mobile Bottom Bar + Direct Contact Integration**
Implement a mobile bottom bar combining navigation with our ordering flow:
```
┌──────────┬──────────┬──────────┐
│ Proizvodi│  Korpa   │  Naruči  │
│   🛍️    │  🛒 (2)  │   📋     │
└──────────┴──────────┴──────────┘
```
"Naruči" could open the cart drawer directly, or — if we add WhatsApp integration in the future — open WhatsApp with a pre-filled cart summary. Either way, this keeps the most important shopping actions within thumb reach on mobile.

**4. "Nova" Badge on Recent Products**
They have a "Nova kolekcija" category but no visual badge on individual product cards. We should add a subtle "NOVO" badge (purple accent) on products added within the last 2 weeks (based on a date field in the Google Sheet). This creates gentle urgency without fake sales.

**5. Quick-View Product Modal**
Their product detail pages require a full page load. We could implement a quick-view modal that opens when clicking a product card — showing the image gallery, description, and order button — without leaving the catalog view. This reduces friction for browsing and is a pattern they completely lack.

**6. Price-per-Piece on Multi-Packs**
If our client offers sets/multi-packs (like their sets), show both the total price AND the per-piece price: "Set od 3 gumice — 1.200 din (400 din/kom)". This helps customers understand the value proposition of buying sets vs. individual items.

---

## Final Verdict

### Should We Use Lenkika.rs as a Strong Reference?

**Partially, but not as a design/UX role model.** Lenkika.rs is useful as a **functional baseline** — it shows what basic e-commerce features exist in the Serbian scrunchie market (cart, categories, filtering, wishlist). But their execution is mediocre at best and embarrassingly sloppy at worst (template disclaimers on legal pages, typos, identical product descriptions, no social proof).

Our project has stronger foundations in several areas: content strategy (unique product descriptions, no liability claims), conversion flow (lightweight cart-drawer ordering via FormSubmit.co), and trust signals (testimonials section, 6-item FAQ, integrated about section). Our brand identity (warm earthy palette with `#c9a087` brand color, DM Serif Display/DM Sans typography) is more intentional than theirs. However, we should honestly note that we currently lack WhatsApp/Viber integration (a key channel for Serbian e-commerce), individual product detail pages, image gallery/zoom, a mobile bottom navigation bar, and wishlist functionality — all features Lenkika does have.

### Top 5 Most Valuable Takeaways

| # | Takeaway | Action for Us |
|---|----------|---------------|
| **1** | **Mobile bottom navigation bar** — Proven mobile UX pattern that keeps key actions within thumb reach | Implement a 3-button mobile bottom bar: Proizvodi, Korpa, Naruči — we currently lack this entirely |
| **2** | **Material filtering/labeling** — Customers think about scrunchies by material (satin vs. plush vs. cotton), not just category | Add material badges to product cards; consider material as a filter dimension alongside category |
| **3** | **Similar/related products** — Cross-selling section on product views boosts engagement and average order value | Implement a "Pogledaj i ove" section showing 3-4 related products in any product detail/modal view |
| **4** | **Avoid their mistakes** — Template text on live pages, typos, fake permanent sales, liability claims, duplicate names | Create a rigorous pre-launch checklist covering: content review, proofreading, unique descriptions, no performance claims |
| **5** | **Market positioning opportunity** — Their generic WooCommerce template leaves a wide-open gap for a handmade brand with genuine personality, proper visual identity, and a frictionless ordering experience | Lean into everything that makes our site feel handmade, personal, and curated — the exact opposite of their template-driven approach |

### Final Score Breakdown

| Category | Lenkika Score (1-10) | Notes |
|----------|---------------------|-------|
| Design & Visual Identity | 3/10 | No color system, no typography, no brand visual language |
| Layout & Structure | 5/10 | Functional WooCommerce layout, but no homepage distinction |
| Navigation & UX | 6/10 | Working filters, categories, mobile nav — solid basics |
| Product Experience | 4/10 | Inconsistent photos, generic descriptions, missing info |
| Conversion & Trust | 3/10 | Template legal pages, no reviews, no social proof, no urgency |
| Technical & Performance | 5/10 | WordPress/WooCommerce works but is heavy; SEO issues |
| **Overall Inspiration** | **5/10** | Useful as a functional reference; not a design or UX role model |

**Bottom line:** Lenkika.rs proves there's a market for handmade hair accessories in Serbia with an online store. Their execution quality is low, which creates opportunity — but we shouldn't be complacent. Beating a weak competitor is easy; building a genuinely great store requires honestly evaluating our own gaps too. Our current site has stronger foundations (intentional color system, quality typography, unique product descriptions, lighter cart-drawer checkout, testimonials, FAQ) and we already match or exceed them in cart functionality and category filtering. However, we should honestly acknowledge what Lenkika has that we still lack: wishlist functionality, mobile bottom navigation bar, image gallery/zoom on products, individual product detail pages with similar-products sections, breadcrumbs, search, and WhatsApp/Viber integration. Prioritizing the highest-impact gaps (mobile bottom bar, WhatsApp, product detail views) should be our next focus.
