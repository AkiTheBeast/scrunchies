/* ===========================================
   Purple Star — Google Apps Script Backend
   ===========================================
   Paste this into Extensions → Apps Script in
   the Google Sheet. Deploy as Web App:
     Execute as: Me
     Who has access: Anyone
   =========================================== */

/* -------------------------------------------
   doGet — Return products, categories,
   testimonials, and settings as JSON
   ------------------------------------------- */

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    var products = getProducts(ss);
    var categories = getCategories(ss);
    var testimonials = getTestimonials(ss);
    var settings = getSettings(ss);

    var result = {
      products: products,
      categories: categories,
      testimonials: testimonials,
      settings: settings
    };

    var json = JSON.stringify(result);
    var callback = e && e.parameter && e.parameter.callback;

    // JSONP support: wrap in callback to bypass CORS
    if (callback && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(callback)) {
      return ContentService
        .createTextOutput(callback + "(" + json + ");")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return ContentService
      .createTextOutput(json)
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    var errorJson = JSON.stringify({ error: true, message: err.message });
    var cb = e && e.parameter && e.parameter.callback;

    if (cb && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(cb)) {
      return ContentService
        .createTextOutput(cb + "(" + errorJson + ");")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    return ContentService
      .createTextOutput(errorJson)
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* -------------------------------------------
   doPost — Handle orders and inquiries
   ------------------------------------------- */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    if (action === "order") {
      return handleOrder(data);
    } else if (action === "inquiry") {
      return handleInquiry(data);
    } else {
      return jsonResponse({ success: false, message: "Nepoznata akcija." });
    }

  } catch (err) {
    return jsonResponse({ success: false, message: "Greška na serveru: " + err.message });
  }
}

/* -------------------------------------------
   Read Sheet Data
   ------------------------------------------- */

function getProducts(ss) {
  var sheet = ss.getSheetByName("Proizvodi");
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var products = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var active = row[9]; // Column J: Aktivno

    if (active !== true && String(active).toUpperCase() !== "TRUE") continue;

    var product = {
      id: String(row[0]),        // A: ID
      name: String(row[1]),      // B: Naziv
      category: String(row[2]),  // C: Kategorija
      price: Number(row[3]),     // D: Cena
      stock: Number(row[4]),     // E: Stanje
      image: String(row[5]),     // F: Slika
      alt: String(row[6]),       // G: Alt tekst
      desc: String(row[7]),      // H: Opis
      featured: row[8] === true || String(row[8]).toUpperCase() === "TRUE"  // I: Istaknuto
    };

    // Phase 2 columns (K–N), optional
    if (row.length > 10 && row[10]) product.material = String(row[10]);      // K: Materijal
    if (row.length > 11 && row[11]) {                                         // L: Datum dodavanja
      var d = row[11];
      product.dateAdded = (d instanceof Date) ? d.toISOString().slice(0, 10) : String(d);
    }
    if (row.length > 12 && row[12]) product.oldPrice = Number(row[12]);       // M: Stara cena
    if (row.length > 13 && row[13]) product.images = String(row[13]);         // N: Slike (comma-separated)

    products.push(product);
  }

  return products;
}

function getCategories(ss) {
  var sheet = ss.getSheetByName("Kategorije");
  if (!sheet) return {};

  var data = sheet.getDataRange().getValues();
  var categories = {};

  for (var i = 1; i < data.length; i++) {
    var key = String(data[i][0]).trim();
    var name = String(data[i][1]).trim();
    if (key) categories[key] = name;
  }

  return categories;
}

function getTestimonials(ss) {
  var sheet = ss.getSheetByName("Utisci");
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  var testimonials = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var active = row[3]; // Column D: Aktivno

    if (active !== true && String(active).toUpperCase() !== "TRUE") continue;

    testimonials.push({
      name: String(row[0]),     // A: Ime
      text: String(row[1]),     // B: Tekst
      location: String(row[2])  // C: Lokacija
    });
  }

  return testimonials;
}

function getSettings(ss) {
  var sheet = ss.getSheetByName("Podešavanja");
  if (!sheet) return {};

  var data = sheet.getDataRange().getValues();
  var settings = {};

  for (var i = 0; i < data.length; i++) {
    var key = String(data[i][0]).trim();
    var value = data[i][1];
    if (key) settings[key] = value;
  }

  return {
    lowStockThreshold: Number(settings["prag_niska_zaliha"]) || 5,
    criticalStockThreshold: Number(settings["prag_kriticna_zaliha"]) || 2,
    instagram: String(settings["instagram"] || "_purple_star_13"),
    ownerEmail: String(settings["email_vlasnika"] || "")
  };
}

/* -------------------------------------------
   Handle Order
   ------------------------------------------- */

function handleOrder(data) {
  // Validate required fields
  if (!data.name || !data.email || !data.phone || !data.pickup || !data.items || !data.items.length) {
    return jsonResponse({ success: false, message: "Molimo popunite sva obavezna polja." });
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return jsonResponse({ success: false, message: "Unesite ispravnu email adresu." });
  }

  // Validate items array
  for (var v = 0; v < data.items.length; v++) {
    if (!data.items[v].id || !data.items[v].qty || data.items[v].qty < 1) {
      return jsonResponse({ success: false, message: "Neispravna stavka u korpi." });
    }
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var productsSheet = ss.getSheetByName("Proizvodi");
  var ordersSheet = ss.getSheetByName("Narudžbine");
  var settings = getSettings(ss);

  if (!productsSheet || !ordersSheet) {
    return jsonResponse({ success: false, message: "Greška u konfiguraciji. Kontaktirajte nas putem Instagram-a." });
  }

  // Acquire lock to prevent race conditions
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (lockErr) {
    return jsonResponse({ success: false, message: "Server je zauzet. Pokušajte ponovo za par sekundi." });
  }

  try {
    var productData = productsSheet.getDataRange().getValues();
    var productNames = {};
    var stockAfter = {};

    // Check stock for all items
    for (var i = 0; i < data.items.length; i++) {
      var item = data.items[i];
      var found = false;

      for (var r = 1; r < productData.length; r++) {
        if (String(productData[r][0]) === String(item.id)) {
          found = true;
          var currentStock = Number(productData[r][4]);
          var productName = String(productData[r][1]);
          productNames[item.id] = productName;

          if (currentStock < item.qty) {
            lock.releaseLock();
            return jsonResponse({
              success: false,
              error: "stock",
              message: "Nažalost, " + productName + " nema dovoljno na stanju (traženo: " + item.qty + ", dostupno: " + currentStock + ")"
            });
          }

          stockAfter[item.id] = { row: r, newStock: currentStock - item.qty, name: productName };
          break;
        }
      }

      if (!found) {
        lock.releaseLock();
        return jsonResponse({ success: false, message: "Proizvod " + item.id + " nije pronađen." });
      }
    }

    // Decrement stock
    for (var id in stockAfter) {
      var info = stockAfter[id];
      productsSheet.getRange(info.row + 1, 5).setValue(info.newStock); // Column E (1-indexed)
    }

    lock.releaseLock();

    // Generate order ID: PS-YYYYMMDD-NNN
    var orderId = generateOrderId(ordersSheet);
    var now = new Date();

    // Build order items JSON
    var itemsJson = JSON.stringify(data.items.map(function(item) {
      return {
        id: item.id,
        name: productNames[item.id] || item.id,
        qty: item.qty
      };
    }));

    // Calculate total
    var total = 0;
    data.items.forEach(function(item) {
      for (var r = 1; r < productData.length; r++) {
        if (String(productData[r][0]) === String(item.id)) {
          total += Number(productData[r][3]) * item.qty;
          break;
        }
      }
    });

    // Append order row
    ordersSheet.appendRow([
      now,                              // A: Datum
      orderId,                          // B: ID narudžbine
      sanitize(data.name),              // C: Ime
      sanitize(data.email),             // D: Email
      sanitize(data.phone),             // E: Telefon
      sanitize(data.pickup),            // F: Preuzimanje
      sanitize(data.address || ""),     // G: Adresa
      sanitize(data.note || ""),        // H: Napomena
      itemsJson,                        // I: Stavke
      total,                            // J: Ukupno
      "Nova"                            // K: Status
    ]);

    // Send emails
    sendOwnerEmail(settings, orderId, data, productNames, total, stockAfter, now);
    sendCustomerEmail(data, orderId, productNames, total, now);

    return jsonResponse({
      success: true,
      orderId: orderId,
      message: "Narudžbina uspešno primljena!"
    });

  } catch (err) {
    try { lock.releaseLock(); } catch (e) {}
    return jsonResponse({ success: false, message: "Greška pri obradi narudžbine: " + err.message });
  }
}

/* -------------------------------------------
   Handle Inquiry
   ------------------------------------------- */

function handleInquiry(data) {
  if (!data.name || !data.email || !data.message) {
    return jsonResponse({ success: false, message: "Molimo popunite sva polja." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return jsonResponse({ success: false, message: "Unesite ispravnu email adresu." });
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var settings = getSettings(ss);

  if (settings.ownerEmail) {
    MailApp.sendEmail({
      to: settings.ownerEmail,
      subject: "Nova poruka sa sajta — Purple Star",
      htmlBody: "<h2>Nova poruka sa kontakt forme</h2>" +
        "<p><strong>Ime:</strong> " + sanitizeHtml(data.name) + "</p>" +
        "<p><strong>Email:</strong> " + sanitizeHtml(data.email) + "</p>" +
        "<p><strong>Poruka:</strong></p>" +
        "<p>" + sanitizeHtml(data.message) + "</p>",
      replyTo: data.email
    });
  }

  return jsonResponse({ success: true, message: "Poruka je poslata!" });
}

/* -------------------------------------------
   Generate Order ID
   ------------------------------------------- */

function generateOrderId(ordersSheet) {
  var today = new Date();
  var dateStr = Utilities.formatDate(today, "Europe/Belgrade", "yyyyMMdd");
  var prefix = "PS-" + dateStr + "-";

  var data = ordersSheet.getDataRange().getValues();
  var maxSeq = 0;

  for (var i = 1; i < data.length; i++) {
    var existingId = String(data[i][1]);
    if (existingId.indexOf(prefix) === 0) {
      var seq = parseInt(existingId.substring(prefix.length), 10);
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    }
  }

  var nextSeq = String(maxSeq + 1);
  while (nextSeq.length < 3) nextSeq = "0" + nextSeq;

  return prefix + nextSeq;
}

/* -------------------------------------------
   Email Functions
   ------------------------------------------- */

function sendOwnerEmail(settings, orderId, data, productNames, total, stockAfter, now) {
  if (!settings.ownerEmail) return;

  var dateStr = Utilities.formatDate(now, "Europe/Belgrade", "dd.MM.yyyy. 'u' HH:mm");

  var itemsHtml = "";
  data.items.forEach(function(item) {
    var name = productNames[item.id] || item.id;
    var price = 0;
    // Look up price from product sheet data isn't directly available here,
    // so we calculate from total proportionally — or just show qty
    itemsHtml += "<tr><td style='padding:8px;border:1px solid #e8e4df'>" + sanitizeHtml(name) + "</td>" +
      "<td style='padding:8px;border:1px solid #e8e4df;text-align:center'>" + item.qty + "</td></tr>";
  });

  var stockHtml = "";
  for (var id in stockAfter) {
    var info = stockAfter[id];
    stockHtml += "<p>" + sanitizeHtml(info.name) + ": <strong>" + info.newStock + " preostalo</strong></p>";
  }

  var html =
    "<div style='font-family:system-ui,sans-serif;max-width:600px;margin:0 auto'>" +
    "<h2 style='color:#c9a087'>Nova narudžbina — " + sanitizeHtml(orderId) + "</h2>" +
    "<p><strong>Datum:</strong> " + sanitizeHtml(dateStr) + "</p>" +
    "<hr style='border:1px solid #e8e4df'>" +

    "<h3>Kupac</h3>" +
    "<p><strong>Ime:</strong> " + sanitizeHtml(data.name) + "</p>" +
    "<p><strong>Email:</strong> " + sanitizeHtml(data.email) + "</p>" +
    "<p><strong>Telefon:</strong> " + sanitizeHtml(data.phone) + "</p>" +

    "<h3>Dostava</h3>" +
    "<p><strong>Način:</strong> " + sanitizeHtml(data.pickup) + "</p>" +
    (data.address ? "<p><strong>Adresa:</strong> " + sanitizeHtml(data.address) + "</p>" : "") +

    "<h3>Narudžbina</h3>" +
    "<table style='border-collapse:collapse;width:100%'>" +
    "<tr style='background:#f3eeea'><th style='padding:8px;border:1px solid #e8e4df;text-align:left'>Proizvod</th>" +
    "<th style='padding:8px;border:1px solid #e8e4df;text-align:center'>Kom</th></tr>" +
    itemsHtml +
    "</table>" +
    "<p style='font-size:18px'><strong>UKUPNO: " + formatPriceGS(total) + "</strong></p>" +

    (data.note ? "<p><strong>Napomena:</strong> " + sanitizeHtml(data.note) + "</p>" : "") +

    "<hr style='border:1px solid #e8e4df'>" +
    "<h3>Stanje posle narudžbine</h3>" +
    stockHtml +

    "</div>";

  MailApp.sendEmail({
    to: settings.ownerEmail,
    subject: "Nova narudžbina " + orderId + " — Purple Star",
    htmlBody: html,
    replyTo: data.email
  });
}

function sendCustomerEmail(data, orderId, productNames, total, now) {
  var itemsList = "";
  data.items.forEach(function(item) {
    var name = productNames[item.id] || item.id;
    itemsList += "  • " + name + " × " + item.qty + "\n";
  });

  var body =
    "Zdravo " + data.name.split(" ")[0] + ",\n\n" +
    "Hvala na narudžbini! Primili smo tvoj zahtev i javićemo ti se u najkraćem roku.\n\n" +
    "Broj narudžbine: " + orderId + "\n\n" +
    "Tvoja narudžbina:\n" +
    itemsList +
    "\nUKUPNO: " + formatPriceGS(total) + "\n\n" +
    "Način preuzimanja: " + data.pickup + "\n" +
    (data.address ? "Adresa: " + data.address + "\n" : "") +
    "\nSve narudžbine se šalju ponedeljkom. Ako imaš pitanja,\n" +
    "javi nam se na Instagram (@_purple_star_13) ili\n" +
    "odgovori na ovaj email.\n\n" +
    "Hvala što podržavaš ručni rad! 💜\n\n" +
    "— Purple Star";

  MailApp.sendEmail({
    to: data.email,
    subject: "Tvoja narudžbina " + orderId + " — Purple Star ⭐",
    body: body,
    replyTo: data.email
  });
}

/* -------------------------------------------
   Helpers
   ------------------------------------------- */

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function sanitize(str) {
  if (typeof str !== "string") return String(str);
  return str.substring(0, 1000).trim();
}

function sanitizeHtml(str) {
  if (typeof str !== "string") str = String(str);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatPriceGS(amount) {
  return Number(amount).toLocaleString("sr-RS") + " din.";
}
