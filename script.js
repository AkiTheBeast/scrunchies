/* ===========================================
   Purple Star — Site Logic
   ===========================================
   Config contains all placeholder data.
   Replace email in FormSubmit action + config
   when going to production.
   =========================================== */

var config = {
    name: "Purple Star",
    email: "info@example.com",
    instagram: "https://instagram.com/_purple_star_13",

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

    categories: {
        "satenske": "Satenske",
        "plisane": "Plišane",
        "pamucne": "Pamučne"
    },

    products: [
        {
            id: "sat-01",
            name: "Satenski scrunchie — Klasik",
            category: "satenske",
            price: 500,
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
            image: "https://images.pexels.com/photos/6044144/pexels-photo-6044144.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=top",
            alt: "Pamučni scrunchie sa prugastim dizajnom",
            desc: "Klasične prugice u mekom pamuku. Uvek u trendu, uvek udoban.",
            featured: false
        }
    ]
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
    var existing = null;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) { existing = cart[i]; break; }
    }
    if (existing) {
        existing.qty += 1;
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
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].qty = Math.max(1, cart[i].qty + delta);
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
    for (var i = 0; i < config.products.length; i++) {
        if (config.products[i].id === id) return config.products[i];
    }
    return null;
}

/* -------------------------------------------
   DOM References
   ------------------------------------------- */

function getElements() {
    return {
        grid: document.getElementById("product-grid"),
        filterPills: document.getElementById("filter-pills"),
        sortSelect: document.getElementById("sort-select"),
        form: document.getElementById("order-form"),
        inquiryForm: document.getElementById("inquiry-form"),
        inquiryNextField: document.getElementById("inquiry-next"),
        navToggle: document.getElementById("nav-toggle"),
        navMenu: document.getElementById("nav-menu"),
        contactChannels: document.getElementById("contact-channels"),
        socialLinks: document.getElementById("social-links"),
        testimonialsGrid: document.getElementById("testimonials-grid"),
        sundayNotice: document.getElementById("sunday-notice"),
        addressField: document.getElementById("address-field"),
        formNextField: document.getElementById("formsubmit-next"),
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
        cartOrderData: document.getElementById("cart-order-data"),
        toastContainer: document.getElementById("toast-container"),
        siteHeader: document.querySelector(".site-header")
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
   Render Products
   ------------------------------------------- */

function renderProducts(els) {
    var products = activeFilter === "all"
        ? config.products
        : config.products.filter(function(p) { return p.category === activeFilter; });

    products = sortProducts(products, activeSort);

    els.grid.innerHTML = "";

    if (!products.length) {
        els.grid.innerHTML = '<p class="status-msg">Nema proizvoda u ovoj kategoriji.</p>';
        return;
    }

    products.forEach(function(product) {
        var card = document.createElement("article");
        card.className = "product-card reveal";

        var categoryLabel = config.categories[product.category] || product.category;

        card.innerHTML =
            '<img src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(product.alt) + '" loading="lazy" width="400" height="400">' +
            '<div class="product-body">' +
                '<h3>' + escapeHtml(product.name) + '</h3>' +
                '<div class="product-meta">' +
                    '<span class="badge">' + escapeHtml(categoryLabel) + '</span>' +
                    '<span class="price">' + formatPrice(product.price) + '</span>' +
                '</div>' +
                '<p class="product-desc">' + escapeHtml(product.desc) + '</p>' +
                '<button class="btn btn-primary btn-small btn-add-cart" data-id="' + escapeHtml(product.id) + '">Dodaj u korpu</button>' +
            '</div>';

        els.grid.appendChild(card);
    });

    // Attach add-to-cart listeners
    els.grid.querySelectorAll(".btn-add-cart").forEach(function(btn) {
        btn.addEventListener("click", function() {
            var id = btn.getAttribute("data-id");
            var product = findProduct(id);
            addToCart(id);
            renderCartUI(els);
            // Toast feedback
            var name = product ? product.name : "Proizvod";
            showToast(els, "✓ " + name + " dodat u korpu", "Pogledaj korpu", function() {
                openCart(els);
            });
        });
    });

    observeRevealElements();
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

    // Render drawer body
    if (els.cartBody) {
        if (!cart.length) {
            els.cartBody.innerHTML = '<p class="cart-empty-msg">Korpa je prazna.</p>';
            if (els.cartFooter) els.cartFooter.hidden = true;
        } else {
            els.cartBody.innerHTML = "";
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
    }
}

function closeCart(els) {
    if (els.cartDrawer) {
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
    var cart = cleanCart();

    if (!cart.length) {
        if (els.cartOrderData) els.cartOrderData.value = "";
        return;
    }

    var lines = [];

    cart.forEach(function(item) {
        var product = findProduct(item.id);
        if (!product) return;
        lines.push(product.name + " × " + item.qty + " = " + formatPrice(product.price * item.qty));
    });

    lines.push("---");
    lines.push("UKUPNO: " + formatPrice(getCartTotal()));

    if (els.cartOrderData) els.cartOrderData.value = lines.join("\n");
}

/* -------------------------------------------
   Cart Step Switching
   ------------------------------------------- */

function showCartStep(els, step) {
    if (step === "checkout") {
        if (els.cartStepItems) els.cartStepItems.hidden = true;
        if (els.cartStepCheckout) els.cartStepCheckout.hidden = false;
        if (els.cartStepConfirmation) els.cartStepConfirmation.hidden = true;
        if (els.cartDrawerTitle) els.cartDrawerTitle.textContent = "📋 Narudžbina";
        if (els.cartDrawer) els.cartDrawer.classList.add("checkout-mode");
        renderCheckoutSummary(els);
        updateCartOrderData(els);
    } else if (step === "confirmation") {
        if (els.cartStepItems) els.cartStepItems.hidden = true;
        if (els.cartStepCheckout) els.cartStepCheckout.hidden = true;
        if (els.cartStepConfirmation) els.cartStepConfirmation.hidden = false;
        if (els.cartDrawerTitle) els.cartDrawerTitle.textContent = "✅ Potvrda";
        if (els.cartDrawer) els.cartDrawer.classList.remove("checkout-mode");
    } else {
        if (els.cartStepItems) els.cartStepItems.hidden = false;
        if (els.cartStepCheckout) els.cartStepCheckout.hidden = true;
        if (els.cartStepConfirmation) els.cartStepConfirmation.hidden = true;
        if (els.cartDrawerTitle) els.cartDrawerTitle.textContent = "🛒 Tvoja korpa";
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

function renderConfirmationSummary(els, cart) {
    if (!els.confirmationSummary) return;

    var html = '';
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
    toast.textContent = message;

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
        { label: "Email: " + config.email, href: "mailto:" + config.email, icon: "✉️" },
        { label: "Instagram: @_purple_star_13", href: config.instagram, icon: "📸" }
    ];

    els.contactChannels.innerHTML = "";

    channels.forEach(function(ch) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = ch.href;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = ch.icon + "  " + ch.label;
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
    if (!els.testimonialsGrid || !config.testimonials) return;

    els.testimonialsGrid.innerHTML = "";

    config.testimonials.forEach(function(t) {
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
    Object.keys(config.categories).forEach(function(key) {
        var btn = document.createElement("button");
        btn.className = "pill";
        btn.setAttribute("data-filter", key);
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", "false");
        btn.textContent = config.categories[key];
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
   Address Field Toggle
   ------------------------------------------- */

function setupDeliveryToggle(els) {
    if (!els.form || !els.addressField) return;

    var radios = els.form.querySelectorAll('input[name="Preuzimanje"]');
    var addressInput = els.addressField.querySelector("input");

    radios.forEach(function(radio) {
        radio.addEventListener("change", function() {
            var needsAddress = radio.value !== "Lično u Pančevu";
            els.addressField.hidden = !needsAddress;
            if (addressInput) {
                addressInput.required = needsAddress;
            }
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

        // Collect form data
        var formData = new FormData(els.form);
        var data = {};
        formData.forEach(function(value, key) {
            data[key] = value;
        });

        // Disable submit button
        if (els.checkoutSubmitBtn) {
            els.checkoutSubmitBtn.disabled = true;
            els.checkoutSubmitBtn.textContent = "Šaljem...";
        }

        // Snapshot cart for confirmation before clearing
        var cartSnapshot = cart.slice();

        // AJAX submit to FormSubmit.co
        var formAction = els.form.getAttribute("action");
        var ajaxUrl = formAction.replace("https://formsubmit.co/", "https://formsubmit.co/ajax/");

        fetch(ajaxUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(data)
        })
        .then(function(response) { return response.json(); })
        .then(function(result) {
            if (result.success) {
                // Clear cart and show confirmation
                localStorage.removeItem(CART_KEY);
                renderConfirmationSummary(els, cartSnapshot);
                showCartStep(els, "confirmation");
                renderCartUI(els);
                els.form.reset();
            } else {
                alert("Greška pri slanju narudžbine. Pokušaj ponovo.");
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
   Scrolled Header
   ------------------------------------------- */

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
        ".step-card",
        ".delivery-card",
        ".about-content",
        ".about-image",
        ".contact-info",
        ".contact-form",
        ".hero-content",
        ".hero-image",
        ".faq-list",
        ".payment-info",
        ".order-schedule"
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
        // Set FormSubmit _next redirect to current page
        if (els.formNextField) {
            els.formNextField.value = window.location.href.split("#")[0];
        }
        if (els.inquiryNextField) {
            els.inquiryNextField.value = window.location.href.split("#")[0] + "#contact";
        }

        populateFilterPills(els);
        renderProducts(els);
        renderContactChannels(els);
        renderSocialLinks(els);
        renderTestimonials(els);
        checkSundayNotice(els);
        setupDeliveryToggle(els);
        setupFormValidation(els);
        setupScrolledHeader(els);

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

        // Sort
        if (els.sortSelect) {
            els.sortSelect.addEventListener("change", function() {
                activeSort = els.sortSelect.value;
                renderProducts(els);
            });
        }

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

document.addEventListener("DOMContentLoaded", init);
