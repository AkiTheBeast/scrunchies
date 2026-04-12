/* ===========================================
   Purple Star — Site Logic
   ===========================================
   Products, categories, testimonials, and
   settings are fetched from Google Sheets
   via Apps Script API.
   =========================================== */

var config = {
    name: "Purple Star",
    email: "pa.purple.star@gmail.com",
    instagram: "https://instagram.com/_purple_star_13",

    // IMPORTANT: Replace this URL after deploying Apps Script
    APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwca6js3xBbZ-8Vl91l6eRk1n8Ge_mYhpXM-f_8udbeQxncIVHCUJZM0l6lQFZPzeWg/exec"
};

/* -------------------------------------------
   Site Data (fetched from Google Sheets)
   ------------------------------------------- */

var siteData = {
    products: [],
    categories: {},
    testimonials: [],
    settings: {
        lowStockThreshold: 5,
        criticalStockThreshold: 2,
        instagram: "_purple_star_13"
    }
};

var CACHE_KEY = "purplestar_data";
var CACHE_TTL = 60000; // 60 seconds

function fetchSiteData() {
    return new Promise(function(resolve, reject) {
        // Check sessionStorage cache
        try {
            var cached = sessionStorage.getItem(CACHE_KEY);
            if (cached) {
                var parsed = JSON.parse(cached);
                if (parsed.timestamp && (Date.now() - parsed.timestamp < CACHE_TTL)) {
                    siteData = parsed.data;
                    resolve(siteData);
                    return;
                }
            }
        } catch (e) { /* ignore cache errors */ }

        // Fetch from Apps Script
        if (config.APPS_SCRIPT_URL === "YOUR_APPS_SCRIPT_URL_HERE") {
            // Dev mode: no URL set yet, reject so fallback kicks in
            reject(new Error("Apps Script URL not configured"));
            return;
        }

        // Use script injection (JSONP-style) to bypass CORS.
        // Google Apps Script redirects cause CORS failures with fetch().
        var callbackName = "_psCallback_" + Date.now();
        var timeoutId = setTimeout(function() {
            cleanup();
            console.warn("[PurpleStar] API request timed out");
            reject(new Error("API request timed out"));
        }, 10000);

        function cleanup() {
            clearTimeout(timeoutId);
            delete window[callbackName];
            var s = document.getElementById(callbackName);
            if (s) s.parentNode.removeChild(s);
        }

        window[callbackName] = function(data) {
            cleanup();
            console.log("[PurpleStar] API data received:", data);

            if (data.error) {
                reject(new Error(data.message || "API error"));
                return;
            }

            // Coerce stock to Number (Sheets may return strings)
            var products = data.products || [];
            products.forEach(function(p) {
                p.stock = (p.stock != null && p.stock !== "") ? Number(p.stock) : 0;
                p.price = Number(p.price) || 0;
                if (p.oldPrice) p.oldPrice = Number(p.oldPrice) || 0;
            });

            siteData.products = products;
            siteData.categories = data.categories || {};
            siteData.testimonials = data.testimonials || [];
            siteData.settings = data.settings || siteData.settings;

            // Cache in sessionStorage
            try {
                sessionStorage.setItem(CACHE_KEY, JSON.stringify({
                    timestamp: Date.now(),
                    data: siteData
                }));
            } catch (e) { /* ignore storage errors */ }

            resolve(siteData);
        };

        var script = document.createElement("script");
        script.id = callbackName;
        script.src = config.APPS_SCRIPT_URL + "?action=products&callback=" + callbackName;
        script.onerror = function() {
            cleanup();
            // Try expired cache as fallback
            try {
                var cached = sessionStorage.getItem(CACHE_KEY);
                if (cached) {
                    var parsed = JSON.parse(cached);
                    siteData = parsed.data;
                    resolve(siteData);
                    return;
                }
            } catch (e) { /* no cache available */ }

            console.warn("[PurpleStar] API script load failed");
            reject(new Error("API script load failed"));
        };
        document.head.appendChild(script);
    });
}

/* -------------------------------------------
   Fallback Data (used when API is not yet
   configured — remove after going live)
   ------------------------------------------- */

var fallbackData = {
    products: [
        {
            id: "sat-01",
            name: "Satenski scrunchie — Klasik",
            category: "satenske",
            price: 500,
            stock: 10,
            material: "Saten",
            image: "https://images.pexels.com/photos/6044139/pexels-photo-6044139.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            alt: "Satenski scrunchie u klasičnoj boji",
            desc: "Mekan satenski scrunchie sa svilenkastim sjajem. Nežan prema kosi, elegantan za svaki dan.",
            featured: true
        },
        {
            id: "sat-02",
            name: "Satenski scrunchie — Pastel",
            category: "satenske",
            price: 500,
            stock: 10,
            material: "Saten",
            image: "https://images.pexels.com/photos/6044135/pexels-photo-6044135.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            alt: "Satenski scrunchie u pastelnoj boji",
            desc: "Nežne pastelne nijanse u satenskoj tkanini. Savršen za romantičan look.",
            featured: false
        },
        {
            id: "sat-03",
            name: "Satenski scrunchie sa mašnom",
            category: "satenske",
            price: 500,
            stock: 10,
            material: "Saten",
            image: "https://images.pexels.com/photos/6983530/pexels-photo-6983530.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            alt: "Satenski scrunchie sa dekorativnom mašnom",
            desc: "Elegantan model sa mašnom — idealan za izlaske i posebne prilike.",
            featured: true
        },
        {
            id: "sat-04",
            name: "Satenski mini scrunchie",
            category: "satenske",
            price: 500,
            stock: 10,
            material: "Saten",
            image: "https://images.pexels.com/photos/6044135/pexels-photo-6044135.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=right",
            alt: "Mali satenski scrunchie",
            desc: "Manji model, idealan za tanje repove i polupodignute frizure.",
            featured: false
        },
        {
            id: "pli-01",
            name: "Plišani scrunchie — Klasik",
            category: "plisane",
            price: 500,
            stock: 10,
            material: "Pliš",
            image: "https://images.pexels.com/photos/7446420/pexels-photo-7446420.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            alt: "Plišani scrunchie u toploj boji",
            desc: "Mekan plišani scrunchie, savršen za hladnije dane i udobno držanje kose.",
            featured: true
        },
        {
            id: "pli-02",
            name: "Plišani scrunchie — Zimska kolekcija",
            category: "plisane",
            price: 500,
            stock: 10,
            material: "Pliš",
            image: "https://images.pexels.com/photos/7446425/pexels-photo-7446425.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            alt: "Plišani scrunchie iz zimske kolekcije",
            desc: "Tople boje i meka pliš tkanina za cozy zimski look.",
            featured: false
        },
        {
            id: "pli-03",
            name: "Plišani scrunchie — Soft",
            category: "plisane",
            price: 500,
            stock: 10,
            material: "Pliš",
            image: "https://images.pexels.com/photos/6983530/pexels-photo-6983530.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=bottom",
            alt: "Mekani plišani scrunchie",
            desc: "Ultra-mekan pliš za maksimalnu udobnost. Bez tragova na kosi.",
            featured: false
        },
        {
            id: "pam-01",
            name: "Pamučni scrunchie — Everyday",
            category: "pamucne",
            price: 500,
            stock: 10,
            material: "Pamuk",
            image: "https://images.pexels.com/photos/6044144/pexels-photo-6044144.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
            alt: "Pamučni scrunchie za svaki dan",
            desc: "Od 100% pamuka — idealan za svakodnevnu upotrebu i sportske aktivnosti.",
            featured: true
        },
        {
            id: "pam-02",
            name: "Pamučni scrunchie — Šareni",
            category: "pamucne",
            price: 500,
            stock: 10,
            material: "Pamuk",
            image: "https://images.pexels.com/photos/6044135/pexels-photo-6044135.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=left",
            alt: "Šareni pamučni scrunchie",
            desc: "Vesele boje i pamučna tkanina za razigran svakodnevni stil.",
            featured: false
        },
        {
            id: "pam-03",
            name: "Pamučni scrunchie — Prugice",
            category: "pamucne",
            price: 500,
            stock: 10,
            material: "Pamuk",
            image: "https://images.pexels.com/photos/6044144/pexels-photo-6044144.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=top",
            alt: "Pamučni scrunchie sa prugastim dizajnom",
            desc: "Klasične prugice u mekom pamuku. Uvek u trendu, uvek udoban.",
            featured: false
        }
    ],
    categories: {
        "satenske": "Satenske",
        "plisane": "Plišane",
        "pamucne": "Pamučne"
    },
    testimonials: [
        {
            name: "Jelena M.",
            text: "Naručila sam set scrunchies za poklon i prijateljica je bila oduševljena! Kvalitet materijala je sjajan, a boje su baš onakve kao na slikama.",
            location: "Pančevo"
        },
        {
            name: "Milica S.",
            text: "Odličan kvalitet i prelepe boje! Nosim ih svaki dan i već sam naručila još dva. Isporuka bila brza i uredna.",
            location: "Beograd"
        },
        {
            name: "Ana T.",
            text: "Kupila sam poklon za sestru za rođendan. Pakovanje prelepo, scrunchies mekani i kvalitetni. Svaka preporuka!",
            location: "Novi Sad"
        }
    ],
    settings: {
        lowStockThreshold: 5,
        criticalStockThreshold: 2,
        instagram: "_purple_star_13"
    }
};

var activeFilter = "all";
var activeSort = "default";

/* -------------------------------------------
   Cart (localStorage)
   ------------------------------------------- */

var CART_KEY = "purplestar_cart";

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId) {
    var cart = getCart();
    var product = findProduct(productId);
    var maxStock = product && product.stock != null ? Number(product.stock) : 999;

    if (maxStock <= 0) return cart;

    var existing = null;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) { existing = cart[i]; break; }
    }
    if (existing) {
        if (existing.qty < maxStock) {
            existing.qty += 1;
        }
    } else {
        cart.push({ id: productId, qty: 1 });
    }
    saveCart(cart);
    return cart;
}

function removeFromCart(productId) {
    var cart = getCart().filter(function(item) { return item.id !== productId; });
    saveCart(cart);
    return cart;
}

function updateCartQty(productId, delta) {
    var cart = getCart();
    var product = findProduct(productId);
    var maxStock = product && product.stock != null ? Number(product.stock) : 999;

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            var newQty = cart[i].qty + delta;
            if (newQty < 1) {
                cart.splice(i, 1); // Remove item when qty drops below 1
            } else {
                cart[i].qty = Math.min(maxStock, newQty);
            }
            break;
        }
    }
    saveCart(cart);
    return cart;
}

function getCartTotal() {
    var cart = getCart();
    var total = 0;
    cart.forEach(function(item) {
        var product = findProduct(item.id);
        if (product) total += product.price * item.qty;
    });
    return total;
}

function getCartCount() {
    var cart = getCart();
    var count = 0;
    cart.forEach(function(item) {
        if (findProduct(item.id)) count += item.qty;
    });
    return count;
}

function cleanCart() {
    var cart = getCart();
    var cleaned = cart.filter(function(item) { return findProduct(item.id) !== null; });
    if (cleaned.length !== cart.length) saveCart(cleaned);
    return cleaned;
}

function findProduct(id) {
    for (var i = 0; i < siteData.products.length; i++) {
        if (siteData.products[i].id === id) return siteData.products[i];
    }
    return null;
}

/* -------------------------------------------
   DOM References
   ------------------------------------------- */

function getElements() {
    return {
        grid: document.getElementById("product-grid"),
        productsLoading: document.getElementById("products-loading"),
        errorBanner: document.getElementById("error-banner"),
        filterPills: document.getElementById("filter-pills"),
        sortSelect: document.getElementById("sort-select"),
        sortControl: document.getElementById("sort-control"),
        sortToggle: document.getElementById("sort-toggle"),
        sortMenu: document.getElementById("sort-menu"),
        sortValue: document.getElementById("sort-value"),
        form: document.getElementById("order-form"),
        inquiryForm: document.getElementById("inquiry-form"),
        navToggle: document.getElementById("nav-toggle"),
        navMenu: document.getElementById("nav-menu"),
        contactChannels: document.getElementById("contact-channels"),
        socialLinks: document.getElementById("social-links"),
        testimonialsGrid: document.getElementById("testimonials-grid"),
        sundayNotice: document.getElementById("sunday-notice"),
        addressField: document.getElementById("address-field"),
        cityField: document.getElementById("city-field"),
        cartToggle: document.getElementById("cart-toggle"),
        cartCount: document.getElementById("cart-count"),
        cartOverlay: document.getElementById("cart-overlay"),
        cartDrawer: document.getElementById("cart-drawer"),
        cartDrawerTitle: document.getElementById("cart-drawer-title"),
        cartClose: document.getElementById("cart-close"),
        cartBody: document.getElementById("cart-drawer-body"),
        cartFooter: document.getElementById("cart-drawer-footer"),
        cartTotalPrice: document.getElementById("cart-total-price"),
        cartCheckoutBtn: document.getElementById("cart-checkout-btn"),
        cartBackBtn: document.getElementById("cart-back-btn"),
        cartStepItems: document.getElementById("cart-step-items"),
        cartStepCheckout: document.getElementById("cart-step-checkout"),
        cartStepConfirmation: document.getElementById("cart-step-confirmation"),
        checkoutOrderSummary: document.getElementById("checkout-order-summary"),
        confirmationSummary: document.getElementById("confirmation-summary"),
        confirmationCloseBtn: document.getElementById("confirmation-close-btn"),
        checkoutSubmitBtn: document.getElementById("checkout-submit-btn"),
        toastContainer: document.getElementById("toast-container"),
        siteHeader: document.querySelector(".site-header"),
        productModal: document.getElementById("product-modal"),
        productModalOverlay: document.getElementById("product-modal-overlay"),
        productModalContent: document.getElementById("product-modal-content"),
        productModalClose: document.getElementById("product-modal-close"),
        mobileBottomBar: document.getElementById("mobile-bottom-bar"),
        bottomBarCartCount: document.getElementById("bottom-bar-cart-count")
    };
}

/* -------------------------------------------
   Helpers
   ------------------------------------------- */

function formatPrice(amount) {
    return amount.toLocaleString("sr-RS") + " din.";
}

function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

/* -------------------------------------------
   Sunday Noon Check (Serbian timezone)
   ------------------------------------------- */

function isSundayAfterNoon() {
    var now = new Date();
    var serbianTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Belgrade" }));
    return serbianTime.getDay() === 0 && serbianTime.getHours() >= 12;
}

function checkSundayNotice(els) {
    if (els.sundayNotice && isSundayAfterNoon()) {
        els.sundayNotice.hidden = false;
    }
}

/* -------------------------------------------
   Sort Products
   ------------------------------------------- */

function sortProducts(products, sortKey) {
    var sorted = products.slice();
    if (sortKey === "price-asc") {
        sorted.sort(function(a, b) { return a.price - b.price; });
    } else if (sortKey === "price-desc") {
        sorted.sort(function(a, b) { return b.price - a.price; });
    } else if (sortKey === "name-asc") {
        sorted.sort(function(a, b) { return a.name.localeCompare(b.name, "sr"); });
    } else if (sortKey === "newest") {
        sorted.sort(function(a, b) {
            var da = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
            var db = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
            return db - da;
        });
    } else {
        sorted.sort(function(a, b) {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
        });
    }
    return sorted;
}

/* -------------------------------------------
   Stock Badge
   ------------------------------------------- */

function renderStockBadge(stock, settings) {
    if (stock == null || isNaN(stock)) return "";
    stock = Number(stock);
    var low = settings.lowStockThreshold || 5;
    var critical = settings.criticalStockThreshold || 2;

    if (stock <= 0) {
        return '<span class="stock-badge stock-out">Rasprodato</span>';
    } else if (stock <= critical) {
        return '<span class="stock-badge stock-critical">Poslednji komadi!</span>';
    } else if (stock <= low) {
        return '<span class="stock-badge stock-low">Još samo ' + stock + '!</span>';
    }
    return "";
}

/* -------------------------------------------
   Render Products
   ------------------------------------------- */

function renderProducts(els) {
    var products = activeFilter === "all"
        ? siteData.products
        : siteData.products.filter(function(p) { return p.category === activeFilter; });

    // Hide out-of-stock products
    products = products.filter(function(p) { return !(p.stock != null && Number(p.stock) <= 0); });

    products = sortProducts(products, activeSort);

    // Hide loading skeleton
    if (els.productsLoading) els.productsLoading.hidden = true;

    els.grid.innerHTML = "";

    if (!products.length) {
        els.grid.innerHTML = '<p class="status-msg">Nema proizvoda u ovoj kategoriji.</p>';
        return;
    }

    products.forEach(function(product) {
        var card = document.createElement("article");
        card.className = "product-card reveal";
        card.setAttribute("data-product-id", product.id);

        var categoryLabel = siteData.categories[product.category] || product.category;
        var stockBadge = renderStockBadge(product.stock, siteData.settings);

        // Material text (subtle label under product name)
        var materialText = "";
        if (product.material) {
            materialText = '<span class="product-material">' + escapeHtml(product.material) + '</span>';
        }

        // NOVO badge (added within last 14 days)
        var novoBadge = "";
        if (product.dateAdded) {
            var twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
            if (new Date(product.dateAdded) >= twoWeeksAgo) {
                novoBadge = '<span class="badge badge-new">NOVO</span>';
            }
        }

        // Sale badge
        var saleBadge = "";
        var priceHtml = '<span class="price">' + formatPrice(product.price) + '</span>';
        if (product.oldPrice && product.oldPrice > product.price) {
            var pct = Math.round((1 - product.price / product.oldPrice) * 100);
            saleBadge = '<span class="badge badge-sale">-' + pct + '%</span>';
            priceHtml = '<del class="price-old">' + formatPrice(product.oldPrice) + '</del> <span class="price price-sale">' + formatPrice(product.price) + '</span>';
        }

        var buttonHtml = '<button class="btn btn-primary btn-small btn-add-cart" data-id="' + escapeHtml(product.id) + '">Dodaj u korpu</button>';

        card.innerHTML =
            '<div class="product-image-wrap">' +
                '<img src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(product.alt) + '" loading="lazy" width="400" height="400">' +
                novoBadge +
                saleBadge +
            '</div>' +
            '<div class="product-body">' +
                '<h3>' + escapeHtml(product.name) + '</h3>' +
                materialText +
                '<div class="product-meta">' +
                    priceHtml +
                    stockBadge +
                '</div>' +
                '<p class="product-desc">' + escapeHtml(product.desc) + '</p>' +
                buttonHtml +
            '</div>';

        els.grid.appendChild(card);
    });

    // Attach add-to-cart listeners
    els.grid.querySelectorAll(".btn-add-cart:not([disabled])").forEach(function(btn) {
        btn.addEventListener("click", function() {
            var id = btn.getAttribute("data-id");
            var product = findProduct(id);
            addToCart(id);
            renderCartUI(els);
            // Brief button feedback instead of toast
            btn.textContent = "✓ Dodato";
            btn.classList.add("btn-added");
            setTimeout(function() {
                btn.textContent = "Dodaj u korpu";
                btn.classList.remove("btn-added");
            }, 1200);
            // Bounce the cart badge
            if (els.cartCount) {
                els.cartCount.classList.remove("cart-bounce");
                void els.cartCount.offsetWidth;
                els.cartCount.classList.add("cart-bounce");
            }
        });
    });

    // Open product modal on image or name click
    els.grid.querySelectorAll(".product-image-wrap, .product-card h3").forEach(function(el) {
        el.style.cursor = "pointer";
        el.addEventListener("click", function() {
            var card = el.closest(".product-card");
            var id = card ? card.getAttribute("data-product-id") : null;
            if (id) openProductModal(els, id);
        });
    });

    observeRevealElements();
}

/* -------------------------------------------
   Product Modal
   ------------------------------------------- */

var _modalTrigger = null;

function getProductImages(product) {
    var imgs = [product.image];
    if (product.images) {
        product.images.split(",").forEach(function(url) {
            var trimmed = url.trim();
            if (trimmed && trimmed !== product.image) imgs.push(trimmed);
        });
    }
    return imgs;
}

function buildModalContent(product, els) {
    var images = getProductImages(product);
    var categoryLabel = siteData.categories[product.category] || product.category;
    var stockBadge = renderStockBadge(product.stock, siteData.settings);

    // Gallery
    var galleryHtml = '<div class="gallery">';
    galleryHtml += '<div class="gallery-main"><img src="' + escapeHtml(images[0]) + '" alt="' + escapeHtml(product.alt) + '" id="gallery-main-img"></div>';
    if (images.length > 1) {
        galleryHtml += '<div class="gallery-thumbs">';
        images.forEach(function(img, idx) {
            galleryHtml += '<img src="' + escapeHtml(img) + '" alt="" class="gallery-thumb' + (idx === 0 ? ' active' : '') + '" data-idx="' + idx + '">';
        });
        galleryHtml += '</div>';
    }
    galleryHtml += '</div>';

    // Material text (subtle, under name)
    var materialText = product.material
        ? '<span class="product-material">' + escapeHtml(product.material) + '</span>'
        : '';

    // Price (with sale)
    var priceHtml = '<span class="price">' + formatPrice(product.price) + '</span>';
    if (product.oldPrice && product.oldPrice > product.price) {
        var pct = Math.round((1 - product.price / product.oldPrice) * 100);
        priceHtml = '<del class="price-old">' + formatPrice(product.oldPrice) + '</del> <span class="price price-sale">' + formatPrice(product.price) + '</span> <span class="badge badge-sale">-' + pct + '%</span>';
    }

    // Info panel
    var infoHtml = '<div class="modal-info">';
    infoHtml += '<h2>' + escapeHtml(product.name) + '</h2>';
    infoHtml += materialText;
    infoHtml += '<div class="product-meta">' + priceHtml + stockBadge + '</div>';
    infoHtml += '<p class="product-desc">' + escapeHtml(product.desc) + '</p>';
    infoHtml += '<button class="btn btn-primary btn-add-cart" data-id="' + escapeHtml(product.id) + '">Dodaj u korpu</button>';
    infoHtml += '</div>';

    // Similar products
    var similar = siteData.products.filter(function(p) {
        return p.category === product.category && p.id !== product.id && !(p.stock != null && Number(p.stock) <= 0);
    });
    if (similar.length < 2) {
        var others = siteData.products.filter(function(p) {
            return p.id !== product.id && !(p.stock != null && Number(p.stock) <= 0);
        });
        similar = others;
    }
    // Shuffle and pick up to 4
    similar = similar.sort(function() { return 0.5 - Math.random(); }).slice(0, 4);

    var similarHtml = '';
    if (similar.length) {
        similarHtml = '<div class="modal-similar"><h3>Pogledaj i ove</h3><div class="similar-grid">';
        similar.forEach(function(sp) {
            similarHtml += '<div class="product-card-mini" data-product-id="' + escapeHtml(sp.id) + '">' +
                '<img src="' + escapeHtml(sp.image) + '" alt="' + escapeHtml(sp.alt) + '" width="64" height="64">' +
                '<div><span class="mini-name">' + escapeHtml(sp.name) + '</span><span class="price">' + formatPrice(sp.price) + '</span></div>' +
                '</div>';
        });
        similarHtml += '</div></div>';
    }

    return '<div class="modal-product-grid">' + galleryHtml + infoHtml + '</div>' + similarHtml;
}

/* -------------------------------------------
   Focus Trap (accessibility)
   ------------------------------------------- */

function trapFocus(container) {
    var focusable = container.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input:not([type="hidden"]), select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return function() {};
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    function handler(e) {
        if (e.key !== "Tab") return;
        if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
            if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    }
    container.addEventListener("keydown", handler);
    return function() { container.removeEventListener("keydown", handler); };
}

var _modalFocusTrapRelease = null;

function openProductModal(els, productId) {
    var product = findProduct(productId);
    if (!product) return;

    _modalTrigger = document.activeElement;
    els.productModalContent.innerHTML = buildModalContent(product, els);
    els.productModal.classList.add("is-open");
    els.productModalOverlay.classList.add("is-open");
    document.body.style.overflow = "hidden";

    // Trap focus inside modal
    if (_modalFocusTrapRelease) _modalFocusTrapRelease();
    _modalFocusTrapRelease = trapFocus(els.productModal);

    // Gallery thumbnail click
    els.productModalContent.querySelectorAll(".gallery-thumb").forEach(function(thumb) {
        thumb.addEventListener("click", function() {
            var mainImg = document.getElementById("gallery-main-img");
            if (mainImg) mainImg.src = thumb.src;
            els.productModalContent.querySelectorAll(".gallery-thumb").forEach(function(t) { t.classList.remove("active"); });
            thumb.classList.add("active");
        });
    });

    // Gallery main image click → lightbox
    var mainImg = document.getElementById("gallery-main-img");
    if (mainImg) {
        mainImg.style.cursor = "zoom-in";
        mainImg.addEventListener("click", function() {
            openLightbox(mainImg.src);
        });
    }

    // Add-to-cart button in modal
    var addBtn = els.productModalContent.querySelector(".btn-add-cart");
    if (addBtn) {
        addBtn.addEventListener("click", function() {
            addToCart(productId);
            renderCartUI(els);
            addBtn.textContent = "✓ Dodato";
            addBtn.classList.add("btn-added");
            setTimeout(function() {
                addBtn.textContent = "Dodaj u korpu";
                addBtn.classList.remove("btn-added");
            }, 1200);
            if (els.cartCount) {
                els.cartCount.classList.remove("cart-bounce");
                void els.cartCount.offsetWidth;
                els.cartCount.classList.add("cart-bounce");
            }
        });
    }

    // Similar product clicks
    els.productModalContent.querySelectorAll(".product-card-mini").forEach(function(mini) {
        mini.addEventListener("click", function() {
            var id = mini.getAttribute("data-product-id");
            if (id) openProductModal(els, id);
        });
    });

    // Focus the close button
    if (els.productModalClose) els.productModalClose.focus();
}

function closeProductModal(els) {
    if (_modalFocusTrapRelease) { _modalFocusTrapRelease(); _modalFocusTrapRelease = null; }
    els.productModal.classList.remove("is-open");
    els.productModalOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
    if (_modalTrigger) {
        _modalTrigger.focus();
        _modalTrigger = null;
    }
}

function setupProductModal(els) {
    if (!els.productModal) return;

    if (els.productModalClose) {
        els.productModalClose.addEventListener("click", function() {
            closeProductModal(els);
        });
    }
    if (els.productModalOverlay) {
        els.productModalOverlay.addEventListener("click", function() {
            closeProductModal(els);
        });
    }
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && els.productModal.classList.contains("is-open")) {
            closeProductModal(els);
        }
    });
}

/* -------------------------------------------
   Lightbox
   ------------------------------------------- */

function openLightbox(src) {
    var overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Uvećana slika");
    overlay.innerHTML = '<img src="' + src + '" alt="Zoom">' +
        '<button class="lightbox-close" aria-label="Zatvori"><i class="ph ph-x"></i></button>';
    document.body.appendChild(overlay);
    requestAnimationFrame(function() { overlay.classList.add("is-open"); });

    // Focus the close button
    var closeBtn = overlay.querySelector(".lightbox-close");
    if (closeBtn) closeBtn.focus();

    function closeLightbox() {
        overlay.classList.remove("is-open");
        setTimeout(function() {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 300);
    }

    overlay.addEventListener("click", function(e) {
        if (e.target === overlay || e.target.closest(".lightbox-close")) closeLightbox();
    });
    document.addEventListener("keydown", function handler(e) {
        if (e.key === "Escape") {
            closeLightbox();
            document.removeEventListener("keydown", handler);
        }
    });
}

/* -------------------------------------------
   Cart UI
   ------------------------------------------- */

function renderCartUI(els) {
    var cart = cleanCart();
    var count = getCartCount();

    // Update header badge
    if (els.cartCount) {
        if (count > 0) {
            els.cartCount.textContent = count;
            els.cartCount.hidden = false;
        } else {
            els.cartCount.hidden = true;
        }
    }

    // Sync mobile bottom bar badge
    if (els.bottomBarCartCount) {
        if (count > 0) {
            els.bottomBarCartCount.textContent = count;
            els.bottomBarCartCount.hidden = false;
        } else {
            els.bottomBarCartCount.hidden = true;
        }
    }

    // Render drawer body
    if (els.cartBody) {
        if (!cart.length) {
            els.cartBody.innerHTML = '<p class="cart-empty-msg">Korpa je prazna.</p>';
            if (els.cartFooter) els.cartFooter.hidden = true;
        } else {
            els.cartBody.innerHTML = '<div class="cart-clear-wrap"><button class="cart-clear-btn" type="button">Isprazni korpu</button></div>';

            // Clear all handler
            els.cartBody.querySelector(".cart-clear-btn").addEventListener("click", function() {
                saveCart([]);
                renderCartUI(els);
            });

            cart.forEach(function(item) {
                var product = findProduct(item.id);
                if (!product) return;

                var row = document.createElement("div");
                row.className = "cart-item";
                row.innerHTML =
                    '<img src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(product.alt) + '" width="56" height="56">' +
                    '<div class="cart-item-info">' +
                        '<h4>' + escapeHtml(product.name) + '</h4>' +
                        '<span class="cart-item-price">' + formatPrice(product.price * item.qty) + '</span>' +
                    '</div>' +
                    '<div class="cart-item-actions">' +
                        '<div class="cart-qty">' +
                            '<button data-id="' + escapeHtml(item.id) + '" data-delta="-1" aria-label="Smanji količinu">−</button>' +
                            '<span>' + item.qty + '</span>' +
                            '<button data-id="' + escapeHtml(item.id) + '" data-delta="1" aria-label="Povećaj količinu">+</button>' +
                        '</div>' +
                        '<button class="cart-item-remove" data-remove="' + escapeHtml(item.id) + '">Ukloni</button>' +
                    '</div>';
                els.cartBody.appendChild(row);
            });

            // Quantity buttons
            els.cartBody.querySelectorAll(".cart-qty button").forEach(function(btn) {
                btn.addEventListener("click", function() {
                    updateCartQty(btn.getAttribute("data-id"), parseInt(btn.getAttribute("data-delta"), 10));
                    renderCartUI(els);
                });
            });

            // Remove buttons
            els.cartBody.querySelectorAll(".cart-item-remove").forEach(function(btn) {
                btn.addEventListener("click", function() {
                    removeFromCart(btn.getAttribute("data-remove"));
                    renderCartUI(els);
                });
            });

            if (els.cartFooter) els.cartFooter.hidden = false;
            if (els.cartTotalPrice) els.cartTotalPrice.textContent = formatPrice(getCartTotal());
        }
    }

    // Update form cart hidden field
    updateCartOrderData(els);
}

var _cartFocusTrapRelease = null;

function openCart(els) {
    if (els.cartDrawer) {
        // Re-render cart for fresh state, then open to items step
        renderCartUI(els);
        showCartStep(els, "items");
        els.cartDrawer.hidden = false;
        els.cartOverlay.hidden = false;
        // Trigger reflow before adding class for transition
        els.cartDrawer.offsetHeight;
        els.cartDrawer.classList.add("open");
        els.cartOverlay.classList.add("open");
        document.body.style.overflow = "hidden";

        // Focus trap
        if (_cartFocusTrapRelease) _cartFocusTrapRelease();
        _cartFocusTrapRelease = trapFocus(els.cartDrawer);

        // Focus close button
        if (els.cartClose) els.cartClose.focus();
    }
}

function closeCart(els) {
    if (els.cartDrawer) {
        if (_cartFocusTrapRelease) { _cartFocusTrapRelease(); _cartFocusTrapRelease = null; }
        els.cartDrawer.classList.remove("open");
        els.cartOverlay.classList.remove("open");
        document.body.style.overflow = "";
        setTimeout(function() {
            els.cartDrawer.hidden = true;
            els.cartOverlay.hidden = true;
        }, 300);
    }
}

function updateCartOrderData(els) {
    // No longer needed — order data is sent directly via Apps Script POST
}

/* -------------------------------------------
   Cart Step Switching
   ------------------------------------------- */

function showCartStep(els, step) {
    if (step === "checkout") {
        if (els.cartStepItems) els.cartStepItems.hidden = true;
        if (els.cartStepCheckout) els.cartStepCheckout.hidden = false;
        if (els.cartStepConfirmation) els.cartStepConfirmation.hidden = true;
        if (els.cartDrawerTitle) els.cartDrawerTitle.innerHTML = '<i class="ph ph-calendar-dots"></i> Narudžbina';
        if (els.cartDrawer) els.cartDrawer.classList.add("checkout-mode");
        renderCheckoutSummary(els);
        updateCartOrderData(els);
    } else if (step === "confirmation") {
        if (els.cartStepItems) els.cartStepItems.hidden = true;
        if (els.cartStepCheckout) els.cartStepCheckout.hidden = true;
        if (els.cartStepConfirmation) els.cartStepConfirmation.hidden = false;
        if (els.cartDrawerTitle) els.cartDrawerTitle.innerHTML = '<i class="ph ph-check-circle"></i> Potvrda';
        if (els.cartDrawer) els.cartDrawer.classList.remove("checkout-mode");
    } else {
        if (els.cartStepItems) els.cartStepItems.hidden = false;
        if (els.cartStepCheckout) els.cartStepCheckout.hidden = true;
        if (els.cartStepConfirmation) els.cartStepConfirmation.hidden = true;
        if (els.cartDrawerTitle) els.cartDrawerTitle.innerHTML = '<i class="ph ph-shopping-bag"></i> Tvoja korpa';
        if (els.cartDrawer) els.cartDrawer.classList.remove("checkout-mode");
    }
}

function renderCheckoutSummary(els) {
    if (!els.checkoutOrderSummary) return;

    var cart = cleanCart();
    var html = '<h4>Tvoja narudžbina</h4>';

    cart.forEach(function(item) {
        var product = findProduct(item.id);
        if (!product) return;
        html += '<div class="checkout-summary-line"><span>' + escapeHtml(product.name) + ' × ' + item.qty + '</span><span>' + formatPrice(product.price * item.qty) + '</span></div>';
    });

    html += '<div class="checkout-summary-line checkout-summary-total"><span>Ukupno</span><span>' + formatPrice(getCartTotal()) + '</span></div>';

    els.checkoutOrderSummary.innerHTML = html;
}

function renderConfirmationSummary(els, cart, orderId) {
    if (!els.confirmationSummary) return;

    var html = '';

    if (orderId) {
        html += '<div class="confirmation-order-id"><strong>Broj narudžbine:</strong> ' + escapeHtml(orderId) + '</div>';
    }

    cart.forEach(function(item) {
        var product = findProduct(item.id);
        if (!product) return;
        html += '<div class="checkout-summary-line"><span>' + escapeHtml(product.name) + ' × ' + item.qty + '</span><span>' + formatPrice(product.price * item.qty) + '</span></div>';
    });

    var total = 0;
    cart.forEach(function(item) {
        var product = findProduct(item.id);
        if (product) total += product.price * item.qty;
    });

    html += '<div class="checkout-summary-line checkout-summary-total"><span>Ukupno</span><span>' + formatPrice(total) + '</span></div>';

    els.confirmationSummary.innerHTML = html;
}

function showToast(els, message, actionText, actionFn) {
    if (!els.toastContainer) return;

    var toast = document.createElement("div");
    toast.className = "toast";

    var msgSpan = document.createElement("span");
    msgSpan.innerHTML = message;
    toast.appendChild(msgSpan);

    if (actionText && actionFn) {
        var btn = document.createElement("button");
        btn.className = "toast-action";
        btn.textContent = actionText;
        btn.addEventListener("click", function() {
            actionFn();
            dismissToast(toast);
        });
        toast.appendChild(btn);
    }

    els.toastContainer.appendChild(toast);

    setTimeout(function() {
        dismissToast(toast);
    }, 4000);
}

function dismissToast(toast) {
    if (!toast.parentNode) return;
    toast.classList.add("toast-out");
    setTimeout(function() {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 250);
}

/* -------------------------------------------
   Contact Channels & Social Links
   ------------------------------------------- */

function renderContactChannels(els) {
    var channels = [
        { label: "Email: " + config.email, href: "mailto:" + config.email, icon: '<i class="ph ph-envelope-simple"></i>' },
        { label: "Instagram: @_purple_star_13", href: config.instagram, icon: '<i class="ph ph-instagram-logo"></i>' }
    ];

    els.contactChannels.innerHTML = "";

    channels.forEach(function(ch) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = ch.href;
        a.target = "_blank";
        a.rel = "noopener";
        a.innerHTML = ch.icon + "  " + ch.label;
        li.appendChild(a);
        els.contactChannels.appendChild(li);
    });
}

function renderSocialLinks(els) {
    var links = [
        { label: "Instagram", href: config.instagram }
    ];

    els.socialLinks.innerHTML = "";

    links.forEach(function(link) {
        var a = document.createElement("a");
        a.href = link.href;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = link.label;
        els.socialLinks.appendChild(a);
    });
}

/* -------------------------------------------
   Testimonials
   ------------------------------------------- */

function renderTestimonials(els) {
    if (!els.testimonialsGrid || !siteData.testimonials) return;

    els.testimonialsGrid.innerHTML = "";

    siteData.testimonials.forEach(function(t) {
        var card = document.createElement("div");
        card.className = "testimonial-card reveal";
        card.innerHTML =
            '<div class="testimonial-stars">★★★★★</div>' +
            '<p class="testimonial-text">"' + escapeHtml(t.text) + '"</p>' +
            '<div class="testimonial-author">' + escapeHtml(t.name) + ' <span>— ' + escapeHtml(t.location) + '</span></div>';
        els.testimonialsGrid.appendChild(card);
    });

    observeRevealElements();
}

/* -------------------------------------------
   Filter Pills
   ------------------------------------------- */

function populateFilterPills(els) {
    // Remove existing dynamic pills (keep the "Sve" button)
    var existingPills = els.filterPills.querySelectorAll('.pill:not([data-filter="all"])');
    existingPills.forEach(function(p) { p.remove(); });

    Object.keys(siteData.categories).forEach(function(key) {
        var btn = document.createElement("button");
        btn.className = "pill";
        btn.setAttribute("data-filter", key);
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", "false");
        btn.textContent = siteData.categories[key];
        els.filterPills.appendChild(btn);
    });
}

function handleFilterClick(e, els) {
    var pill = e.target.closest(".pill");
    if (!pill) return;

    activeFilter = pill.getAttribute("data-filter");

    els.filterPills.querySelectorAll(".pill").forEach(function(p) {
        p.classList.remove("active");
        p.setAttribute("aria-selected", "false");
    });
    pill.classList.add("active");
    pill.setAttribute("aria-selected", "true");

    renderProducts(els);
}

/* -------------------------------------------
   Custom Sort Dropdown
   ------------------------------------------- */

function updateSortUI(els, value) {
    if (!els.sortMenu) return;
    var items = els.sortMenu.querySelectorAll("li");
    items.forEach(function(li) {
        var isSelected = li.getAttribute("data-value") === value;
        li.setAttribute("aria-selected", isSelected ? "true" : "false");
        if (isSelected && els.sortValue) {
            // Get text without the check icon
            var clone = li.cloneNode(true);
            var icon = clone.querySelector(".sort-check");
            if (icon) icon.remove();
            els.sortValue.textContent = clone.textContent.trim();
        }
    });
}

function setupSortDropdown(els) {
    if (!els.sortToggle || !els.sortMenu || !els.sortControl) return;

    function toggleMenu(open) {
        var isOpen = typeof open === "boolean" ? open : els.sortMenu.hidden;
        els.sortMenu.hidden = !isOpen;
        els.sortToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        if (isOpen) {
            els.sortControl.classList.add("open");
        } else {
            els.sortControl.classList.remove("open");
        }
    }

    els.sortToggle.addEventListener("click", function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    els.sortMenu.addEventListener("click", function(e) {
        var li = e.target.closest("li");
        if (!li) return;
        var val = li.getAttribute("data-value");
        activeSort = val;
        updateSortUI(els, val);
        toggleMenu(false);
        renderProducts(els);
    });

    // Close on outside click
    document.addEventListener("click", function(e) {
        if (!els.sortControl.contains(e.target)) {
            toggleMenu(false);
        }
    });

    // Close when clicking on the backdrop area (mobile bottom sheet)
    // The ::before pseudo-element is on .sort-control, so clicks on
    // the backdrop register as clicking .sort-control itself
    els.sortControl.addEventListener("click", function(e) {
        if (e.target === els.sortControl && !els.sortMenu.hidden) {
            toggleMenu(false);
        }
    });

    // Close on Escape
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && !els.sortMenu.hidden) {
            toggleMenu(false);
            els.sortToggle.focus();
        }
    });
}

/* -------------------------------------------
   Address Field Toggle
   ------------------------------------------- */

function setupDeliveryToggle(els) {
    if (!els.form || !els.addressField) return;

    var radios = els.form.querySelectorAll('input[name="Preuzimanje"]');
    var addressInput = els.addressField.querySelector("input");
    var cityInput = els.cityField ? els.cityField.querySelector("input") : null;

    radios.forEach(function(radio) {
        radio.addEventListener("change", function() {
            var needsAddress = radio.value !== "Lično u Pančevu";
            els.addressField.hidden = !needsAddress;
            if (els.cityField) els.cityField.hidden = !needsAddress;
            if (addressInput) addressInput.required = needsAddress;
            if (cityInput) cityInput.required = needsAddress;
        });
    });
}

/* -------------------------------------------
   Form Validation
   ------------------------------------------- */

function setupFormValidation(els) {
    if (!els.form) return;

    els.form.addEventListener("submit", function(e) {
        e.preventDefault();

        var cart = cleanCart();
        if (!cart.length) {
            alert("Korpa je prazna! Dodaj proizvode pre naručivanja.");
            return;
        }

        // Check honeypot
        var honey = els.form.querySelector('input[name="_honey"]');
        if (honey && honey.value) return;

        // Collect form data
        var formData = new FormData(els.form);

        // Concatenate address fields
        var street = (formData.get("Adresa") || "").trim();
        var city = (formData.get("Grad") || "").trim();
        var fullAddress = [street, city].filter(Boolean).join(", ");

        var orderData = {
            action: "order",
            name: formData.get("Ime") || "",
            email: formData.get("Email") || "",
            phone: formData.get("Telefon") || "",
            pickup: formData.get("Preuzimanje") || "",
            address: fullAddress,
            note: formData.get("Napomena") || "",
            items: cart.map(function(item) {
                return { id: item.id, qty: item.qty };
            })
        };

        // Disable submit button
        if (els.checkoutSubmitBtn) {
            els.checkoutSubmitBtn.disabled = true;
            els.checkoutSubmitBtn.textContent = "Šaljem...";
        }

        // Snapshot cart for confirmation before clearing
        var cartSnapshot = cart.slice();

        // Submit to Apps Script (or show confirmation in dev mode)
        if (config.APPS_SCRIPT_URL === "YOUR_APPS_SCRIPT_URL_HERE") {
            // Dev mode: simulate success
            setTimeout(function() {
                localStorage.removeItem(CART_KEY);
                renderConfirmationSummary(els, cartSnapshot, "PS-DEV-001");
                showCartStep(els, "confirmation");
                renderCartUI(els);
                els.form.reset();
                if (els.checkoutSubmitBtn) {
                    els.checkoutSubmitBtn.disabled = false;
                    els.checkoutSubmitBtn.textContent = "Pošalji narudžbinu";
                }
            }, 800);
            return;
        }

        fetch(config.APPS_SCRIPT_URL, {
            method: "POST",
            redirect: "follow",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(orderData)
        })
        .then(function(response) { return response.json(); })
        .then(function(result) {
            if (result.success) {
                localStorage.removeItem(CART_KEY);
                renderConfirmationSummary(els, cartSnapshot, result.orderId);
                showCartStep(els, "confirmation");
                renderCartUI(els);
                els.form.reset();
            } else {
                if (result.error === "stock") {
                    alert(result.message);
                } else {
                    alert(result.message || "Greška pri slanju narudžbine. Pokušaj ponovo.");
                }
            }
        })
        .catch(function() {
            alert("Greška pri slanju narudžbine. Proveri internet konekciju i pokušaj ponovo.");
        })
        .finally(function() {
            if (els.checkoutSubmitBtn) {
                els.checkoutSubmitBtn.disabled = false;
                els.checkoutSubmitBtn.textContent = "Pošalji narudžbinu";
            }
        });
    });
}

/* -------------------------------------------
   Inquiry Form (Contact)
   ------------------------------------------- */

function setupInquiryForm(els) {
    if (!els.inquiryForm) return;

    els.inquiryForm.addEventListener("submit", function(e) {
        e.preventDefault();

        // Check honeypot
        var honey = els.inquiryForm.querySelector('input[name="_honey"]');
        if (honey && honey.value) return;

        var formData = new FormData(els.inquiryForm);
        var submitBtn = els.inquiryForm.querySelector('button[type="submit"]');

        var inquiryData = {
            action: "inquiry",
            name: formData.get("Ime") || "",
            email: formData.get("Email") || "",
            message: formData.get("Poruka") || ""
        };

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Šaljem...";
        }

        if (config.APPS_SCRIPT_URL === "YOUR_APPS_SCRIPT_URL_HERE") {
            // Dev mode: simulate success
            setTimeout(function() {
                showToast(els, '<i class="ph ph-check"></i> Poruka poslata!');
                els.inquiryForm.reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Pošalji poruku";
                }
            }, 800);
            return;
        }

        fetch(config.APPS_SCRIPT_URL, {
            method: "POST",
            redirect: "follow",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(inquiryData)
        })
        .then(function(response) { return response.json(); })
        .then(function(result) {
            if (result.success) {
                showToast(els, '<i class="ph ph-check"></i> Poruka poslata!');
                els.inquiryForm.reset();
            } else {
                alert(result.message || "Greška pri slanju poruke.");
            }
        })
        .catch(function() {
            alert("Greška pri slanju poruke. Proveri internet konekciju.");
        })
        .finally(function() {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Pošalji poruku";
            }
        });
    });
}

/* -------------------------------------------
   Scrolled Header
   ------------------------------------------- */

/* -------------------------------------------
   Collapsible Section Toggle Text
   ------------------------------------------- */

function setupCollapsibleToggles() {
    document.querySelectorAll(".collapsible-section").forEach(function(details) {
        var toggle = details.querySelector(".collapsible-toggle");
        if (!toggle) return;

        function updateText() {
            var icon = toggle.querySelector(".collapsible-icon");
            toggle.textContent = details.open ? "Sakrij " : "Prikaži ";
            if (icon) toggle.appendChild(icon);
        }

        details.addEventListener("toggle", updateText);
        updateText();
    });
}

function setupScrolledHeader(els) {
    if (!els.siteHeader) return;

    var threshold = 60;

    function onScroll() {
        if (window.scrollY > threshold) {
            els.siteHeader.classList.add("scrolled");
        } else {
            els.siteHeader.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // check initial state
}

/* -------------------------------------------
   Mobile Menu
   ------------------------------------------- */

function toggleMenu(els) {
    var isOpen = els.navMenu.classList.toggle("open");
    els.navToggle.classList.toggle("active");
    els.navToggle.setAttribute("aria-expanded", String(isOpen));
}

function closeMenuOnClick(els) {
    if (!els.navMenu) return;

    els.navMenu.querySelectorAll("a").forEach(function(link) {
        link.addEventListener("click", function() {
            els.navMenu.classList.remove("open");
            els.navToggle.classList.remove("active");
            els.navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

/* -------------------------------------------
   Scroll Reveal (IntersectionObserver)
   ------------------------------------------- */

var revealObserver = null;

function setupReveal() {
    if (!("IntersectionObserver" in window)) return;

    revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    });

    observeRevealElements();
}

function observeRevealElements() {
    if (!revealObserver) return;

    document.querySelectorAll(".reveal:not(.visible)").forEach(function(el) {
        revealObserver.observe(el);
    });
}

function addRevealClasses() {
    var selectors = [
        ".section-header",
        ".journey-step",
        ".journey-note",
        ".about-content",
        ".about-image",
        ".contact-info",
        ".contact-form",
        ".hero-content",
        ".hero-image",
        ".faq-list"
    ];

    document.querySelectorAll(selectors.join(", ")).forEach(function(el) {
        el.classList.add("reveal");
    });
}

/* -------------------------------------------
   Init
   ------------------------------------------- */

function init() {
    var els = getElements();

    document.documentElement.classList.add("js");

    try {
        // Fetch site data from Google Sheets (or use fallback)
        fetchSiteData()
            .then(function() {
                renderSite(els);
            })
            .catch(function(err) {
                // Use fallback data when API is not configured or fails
                console.warn("[PurpleStar] Using fallback data.", err && err.message);
                siteData = fallbackData;
                renderSite(els);
            });

        // These don't depend on fetched data
        renderContactChannels(els);
        renderSocialLinks(els);
        checkSundayNotice(els);
        setupDeliveryToggle(els);
        setupFormValidation(els);
        setupInquiryForm(els);
        setupScrolledHeader(els);
        setupProductModal(els);
        setupCollapsibleToggles();

        // Mobile bottom bar handlers
        if (els.mobileBottomBar) {
            els.mobileBottomBar.querySelectorAll(".bottom-bar-btn").forEach(function(btn) {
                btn.addEventListener("click", function() {
                    var target = btn.getAttribute("data-target");
                    if (target === "products") {
                        closeCart(els);
                        var productsSection = document.getElementById("products");
                        if (productsSection) productsSection.scrollIntoView({ behavior: "smooth" });
                    } else if (target === "cart") {
                        openCart(els);
                    } else if (target === "order") {
                        if (getCartCount() > 0) {
                            openCart(els);
                            showCartStep(els, "checkout");
                        } else {
                            var orderSection = document.getElementById("how-to-order");
                            if (orderSection) orderSection.scrollIntoView({ behavior: "smooth" });
                        }
                    }
                });
            });
        }

        // Clean stale cart items and restore from localStorage
        cleanCart();
        renderCartUI(els);

        // Cart drawer open/close
        if (els.cartToggle) {
            els.cartToggle.addEventListener("click", function() {
                openCart(els);
            });
        }
        if (els.cartClose) {
            els.cartClose.addEventListener("click", function() {
                closeCart(els);
            });
        }
        if (els.cartOverlay) {
            els.cartOverlay.addEventListener("click", function() {
                closeCart(els);
            });
        }

        // Cart drawer Escape key
        document.addEventListener("keydown", function(e) {
            if (e.key === "Escape" && els.cartDrawer && els.cartDrawer.classList.contains("open")) {
                closeCart(els);
            }
        });

        // Checkout step: show form inside drawer
        if (els.cartCheckoutBtn) {
            els.cartCheckoutBtn.addEventListener("click", function() {
                showCartStep(els, "checkout");
            });
        }

        // Back to cart items
        if (els.cartBackBtn) {
            els.cartBackBtn.addEventListener("click", function() {
                showCartStep(els, "items");
            });
        }

        // Confirmation close button
        if (els.confirmationCloseBtn) {
            els.confirmationCloseBtn.addEventListener("click", function() {
                closeCart(els);
            });
        }

        // Filter pills
        if (els.filterPills) {
            els.filterPills.addEventListener("click", function(e) {
                handleFilterClick(e, els);
            });
        }

        // Custom sort dropdown
        setupSortDropdown(els);

        // Mobile nav
        if (els.navToggle) {
            els.navToggle.addEventListener("click", function() {
                toggleMenu(els);
            });
        }

        closeMenuOnClick(els);

        addRevealClasses();
        setupReveal();

    } catch (err) {
        console.error("Greška pri inicijalizaciji:", err);
        if (els.grid) {
            els.grid.innerHTML = '<p class="status-msg">Došlo je do greške. Osveži stranicu.</p>';
        }
    }
}

/* -------------------------------------------
   Render Site (after data is loaded)
   ------------------------------------------- */

function renderSite(els) {
    // Hide loading skeleton
    if (els.productsLoading) els.productsLoading.hidden = true;

    populateFilterPills(els);
    renderProducts(els);
    renderTestimonials(els);
}

document.addEventListener("DOMContentLoaded", init);
