# Google Sheet — Vodič za održavanje

Ovaj fajl objašnjava strukturu Google Sheet-a koji pogoni Purple Star sajt, kako se svaki tab koristi, i šta smeš (a šta ne smeš) da menjaš.

---

## Tabovi u Sheet-u

Postoje **5 tabova** (sheet-ova). Imena su bitna — ne menjaj ih.

| Tab | Svrha |
|-----|-------|
| **Proizvodi** | Svi scrunchie proizvodi i njihove informacije |
| **Kategorije** | Mapiranje ID-a kategorija na prikazna imena |
| **Utisci** | Recenzije/utisci kupaca |
| **Podešavanja** | Globalna podešavanja sajta |
| **Narudžbine** | Sve primljene narudžbine (automatski se popunjava) |

---

## 1. Proizvodi

Ovo je glavni tab. Svaki red = jedan proizvod.

| Kolona | Naziv | Obavezno | Opis |
|--------|-------|----------|------|
| **A** | ID | ✅ | Jedinstven identifikator (npr. `sat-01`, `pli-02`). **Nikad ne menjaj ID postojećeg proizvoda.** |
| **B** | Naziv | ✅ | Ime koje se prikazuje na sajtu (npr. "Satenski scrunchie — Klasik") |
| **C** | Kategorija | ✅ | ID kategorije iz tab-a Kategorije (npr. `satenski`, `plisani`) |
| **D** | Cena | ✅ | Cena u dinarima, samo broj (npr. `500`) |
| **E** | Stanje | ✅ | Trenutna količina na stanju. **Automatski se smanjuje kad neko naruči.** |
| **F** | Slika | ✅ | URL slike proizvoda (Google Drive, Imgur, itd.) |
| **G** | Alt tekst | ✅ | Opis slike za pristupačnost (npr. "Rozi satenski scrunchie") |
| **H** | Opis | ✅ | Tekst opisa koji se prikazuje u modalu proizvoda |
| **I** | Istaknuto | ❌ | `TRUE` ili `FALSE`. Istaknuti proizvodi se prikazuju prvi |
| **J** | Aktivno | ✅ | `TRUE` = prikazuje se na sajtu, `FALSE` = sakriven |
| **K** | Materijal | ❌ | Tekst materijala (npr. "Pamuk", "Saten") |
| **L** | Datum dodavanja | ❌ | Datum u formatu `YYYY-MM-DD` (koristi se za sortiranje "Najnovije") |
| **M** | Stara cena | ❌ | Prethodna cena za prikaz popusta (precrtana cena) |
| **N** | Slike | ❌ | Više slika razdvojenih zarezom (za galeriju u modalu) |

### Česte operacije sa proizvodima

**Dodavanje novog proizvoda:**
1. Dodaj novi red na dno tabele
2. Popuni kolone A–J (obavezne)
3. Koristi jedinstven ID koji prati obrazac (npr. sledeći `sat-XX`)
4. Postavi Stanje (kolona E) na početnu količinu
5. Postavi Aktivno (kolona J) na `TRUE`

**Privremeno sakrivanje proizvoda:**
- Postavi kolonu J (Aktivno) na `FALSE`
- Proizvod neće biti vidljiv na sajtu ali podaci ostaju sačuvani

**Ažuriranje cene:**
- Promeni vrednost u koloni D (Cena)
- Ako želiš da se prikaže stara cena precrtana, staru cenu stavi u kolonu M (Stara cena)

**Dodavanje zaliha:**
- Jednostavno promeni broj u koloni E (Stanje)
- Sajt automatski prikazuje bedževe za stanje ("Poslednji komadi", "Malo na stanju")

**Brisanje proizvoda:**
- ⚠️ **Ne briši redove** ako je proizvod ikad naručen — to bi pokvarilo reference u Narudžbine tabu
- Umesto toga postavi Aktivno na `FALSE`

### ⚠️ Ne diraj

- **Ne menjaj ID** (kolona A) postojećih proizvoda
- **Ne menjaj redosled kolona** i **ne dodaj kolone između** postojećih
- **Ne menjaj naziv taba** "Proizvodi"
- Kolona E (Stanje) se **automatski smanjuje** nakon svake narudžbine — ne brini ako se menja "sama"

---

## 2. Kategorije

Jednostavna tabela sa 2 kolone.

| Kolona | Naziv | Opis |
|--------|-------|------|
| **A** | ID | Identifikator kategorije, koristi se u tabu Proizvodi (npr. `satenski`) |
| **B** | Naziv | Prikazno ime na sajtu (npr. "Satenski") |

### Česte operacije

**Dodavanje nove kategorije:**
1. Dodaj red sa jedinstvenim ID-om u kolonu A
2. Stavi prikazno ime u kolonu B
3. Koristi taj ID u koloni C taba Proizvodi za odgovarajuće proizvode

**Brisanje kategorije:**
- Obriši red, ali se prvo uveri da nijedan proizvod ne koristi taj ID u koloni C

---

## 3. Utisci

Recenzije kupaca koje se prikazuju na sajtu.

| Kolona | Naziv | Opis |
|--------|-------|------|
| **A** | Ime | Ime kupca |
| **B** | Tekst | Tekst recenzije |
| **C** | Lokacija | Grad ili lokacija (npr. "Pančevo") |
| **D** | Aktivno | `TRUE` = prikazuje se, `FALSE` = sakriveno |

### Česte operacije

- **Dodavanje:** Novi red sa imenom, tekstom, lokacijom, i `TRUE` u koloni D
- **Sakrivanje:** Postavi kolonu D na `FALSE`

---

## 4. Podešavanja

Globalna podešavanja u formatu ključ–vrednost.

| Red | Kolona A (Ključ) | Kolona B (Vrednost) | Opis |
|-----|-------------------|---------------------|------|
| 1 | `prag_niska_zaliha` | `5` | Ispod ove količine prikazuje bedž "Malo na stanju" |
| 2 | `prag_kriticna_zaliha` | `2` | Ispod ove količine prikazuje bedž "Poslednji komadi!" |
| 3 | `instagram` | `_purple_star_13` | Instagram handle (bez @) |
| 4 | `email_vlasnika` | `tvoj@email.com` | Email na koji stižu notifikacije o narudžbinama |

### ⚠️ Važno

- **Ne menjaj nazive ključeva** u koloni A
- Možeš slobodno menjati **vrednosti** u koloni B
- Ako `email_vlasnika` nije popunjen, nećeš dobijati email notifikacije o narudžbinama!

---

## 5. Narudžbine

Ovaj tab se **automatski popunjava** kad kupac pošalje narudžbinu. **Ne dodaj ručno redove.**

| Kolona | Naziv | Automatski? | Opis |
|--------|-------|-------------|------|
| **A** | Datum | ✅ | Datum i vreme narudžbine |
| **B** | ID narudžbine | ✅ | Format: `PS-GGGGMMDD-NNN` (npr. `PS-20260412-001`) |
| **C** | Ime | ✅ | Ime kupca |
| **D** | Email | ✅ | Email kupca |
| **E** | Telefon | ✅ | Telefon kupca |
| **F** | Preuzimanje | ✅ | Način preuzimanja (Lično / BEX / AKS) |
| **G** | Adresa | ✅ | Adresa dostave (prazno za lično preuzimanje) |
| **H** | Napomena | ✅ | Napomena kupca |
| **I** | Stavke | ✅ | Lista proizvoda u formatu: `2× Naziv (id)` |
| **J** | Ukupno | ✅ | Ukupna cena u dinarima |
| **K** | Status | ✅ (početno "Nova") | Status narudžbine |

### Kolona K — Status narudžbine

Status je jedina kolona koju treba **ručno ažurirati**. Preporučeni statusi:

| Status | Značenje |
|--------|----------|
| `Nova` | Tek pristigla, nije obrađena |
| `U pripremi` | Pakuješ narudžbinu |
| `Poslato` | Paket je predat kuriru |
| `Završeno` | Kupac je preuzeo / plaćeno |
| `Otkazano` | Kupac otkazao |

💡 **Savet:** Koristi Data Validation na koloni K da napraviš dropdown listu sa ovim statusima:
1. Selektuj celu kolonu K (sem zaglavlja)
2. Data → Data validation → Criteria: Dropdown
3. Dodaj opcije: Nova, U pripremi, Poslato, Završeno, Otkazano

### ⚠️ Ne diraj

- **Ne briši redove** — to kvari generisanje sledećeg ID-a narudžbine
- **Ne menjaj kolone A–J** — automatski su popunjene
- Slobodno menjaj kolonu K (Status) — to je i predviđeno

---

## Apps Script (Code.gs)

Backend logika je u Extensions → Apps Script. Evo šta treba znati:

### Kada treba ponovo deploy-ovati?

Svaki put kad se promeni kod u Code.gs:
1. Otvori Extensions → Apps Script
2. Klikni "Deploy" → "Manage deployments"
3. Klikni olovku (edit) na aktivnom deploy-u
4. Promeni "Version" na "New version"
5. Klikni "Deploy"

**Samo menjanje podataka u sheet-u NE zahteva redeploy.**

### Email notifikacije

- **Email vlasniku:** Šalje se pri svakoj narudžbini na `email_vlasnika` iz Podešavanja
- **Email kupcu:** Šalje se automatski na email iz forme kupca
- Gmail ograničenje: ~100 emailova dnevno (besplatni nalog)

### Google Apps Script limiti

| Ograničenje | Vrednost |
|-------------|----------|
| Emailova dnevno | ~100 (besplatni) / ~1500 (Workspace) |
| Vreme izvršavanja po zahtevu | 30 sekundi |
| Dnevno vreme izvršavanja | 90 minuta |

---

## Česte greške i rešenja

| Problem | Uzrok | Rešenje |
|---------|-------|---------|
| Proizvod se ne prikazuje na sajtu | Kolona J (Aktivno) nije `TRUE` | Postavi na `TRUE` |
| Kupac dobija "nema na stanju" | Kolona E (Stanje) je 0 | Povećaj broj u koloni E |
| Email notifikacije ne stižu | `email_vlasnika` nije popunjen | Popuni u tabu Podešavanja |
| Novi kod ne radi | Zaboravljen redeploy | Uradi novi deploy (pogledaj gore) |
| Narudžbina se ne šalje | Apps Script URL nije ažuriran | Proveri URL u script.js (`APPS_SCRIPT_URL`) |
| Stanje se neočekivano menja | Automatski se smanjuje pri narudžbini | Normalno ponašanje |

---

## Bezbednosne napomene

- **Ne deli** URL Apps Script-a javno — neko bi mogao da šalje lažne narudžbine
- **Ne deli** Google Sheet sa "Anyone with the link can edit" — koristi view-only ako moraš
- Redovno proveravaj tab Narudžbine za sumnjive unose
- Backup: File → Download → .xlsx periodično (npr. jednom nedeljno)

---

## Redovno održavanje

### Nedeljno
- ✅ Proveri kolonu K (Status) u Narudžbine — ažuriraj statuse
- ✅ Proveri kolonu E (Stanje) u Proizvodi — dopuni zalihe po potrebi

### Mesečno
- ✅ Napravi backup Sheet-a (File → Download → .xlsx)
- ✅ Proveri da li svi proizvodi imaju ispravne slike (URL-ovi)
- ✅ Proveri da li `email_vlasnika` u Podešavanja prima emailove

### Kad dodaješ nove proizvode
- ✅ Koristi jedinstven ID (proveri da ne postoji već)
- ✅ Postavi Aktivno na `TRUE`
- ✅ Postavi početno Stanje
- ✅ Testiraj naručivanje novog proizvoda
