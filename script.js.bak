/* ===========================================
   Mašnica — Demo Site Logic
   ===========================================
   All placeholder data is in the config object.
   Replace with real data when going to production.
   =========================================== */

var config = {
    name: "Mašnica",
    phone: "+381 60 000 0000",
    whatsapp: "381600000000",
    email: "info@example.com",
    facebook: "https://facebook.com/masnica.pancevo",
    instagram: "https://instagram.com/masnica.pancevo",

    testimonials: [
        {
            name: "Jelena M.",
            text: "Naru\u010dila sam set scrunchie-ja za poklon i prijateljica je bila odu\u0161evljena! Kvalitet materijala je sjajan, a boje su ba\u0161 onakve kao na slikama.",
            location: "Pan\u010devo"
        },
        {
            name: "Milica S.",
            text: "Odli\u010dan kvalitet i prelepe boje! Nosim ih svaki dan i ve\u0107 sam naru\u010dila jo\u0161 dva seta. Isporuka bila brza i uredna.",
            location: "Beograd"
        },
        {
            name: "Ana T.",
            text: "Kupila sam poklon set za sestru za ro\u0111endan. Pakovanje prelepo, gumice mekane i kvalitetne. Svaka preporuka!",
            location: "Novi Sad"
        }
    ],

    categories: {
        "scrunchie": "Scrunchie",
        "hair-tie": "Gumice",
        "set": "Setovi"
    },

    products: [
        {
            id: "sc-01",
            name: "Satenski scrunchie — Klasik",
            category: "scrunchie",
            price: 550,
            image: "https://images.pexels.com/photos/6044139/pexels-photo-6044139.jpeg?auto=compress&cs=tinysrgb&w=400&h=400",
            alt: "Kolekcija svilenkastih scrunchie gumica u raznim bojama",
            desc: "Mekan satenski scrunchie od glatke tkanine, bez metalnih delova. Savr\u0161en za svaki dan.",
            leadTime: "2\u20133 dana"
        },
        {
            id: "sc-02",
            name: "Pamučni scrunchie",
            category: "scrunchie",
            price: 450,
            image: "https://images.pexels.com/photos/6044144/pexels-photo-6044144.jpeg?auto=compress&cs=tinysrgb&w=400&h=400",
            alt: "Pamučni scrunchie u toplim tonovima",
            desc: "Od 100% pamuka \u2014 idealan za svakodnevnu upotrebu i sportske aktivnosti.",
            leadTime: "2\u20133 dana"
        },
        {
            id: "sc-03",
            name: "Svečani scrunchie sa mašnom",
            category: "scrunchie",
            price: 700,
            image: "https://images.pexels.com/photos/6983530/pexels-photo-6983530.jpeg?auto=compress&cs=tinysrgb&w=400&h=400",
            alt: "Scrunchie gumice i modni aksesoari u flat lay prikazu",
            desc: "Elegantan model sa ma\u0161nom \u2014 idealan za izlaske, proslave i poklone.",
            leadTime: "3\u20134 dana"
        },
        {
            id: "ht-01",
            name: "Tanke gumice — set od 3",
            category: "hair-tie",
            price: 400,
            image: "https://images.pexels.com/photos/7446420/pexels-photo-7446420.jpeg?auto=compress&cs=tinysrgb&w=400&h=400",
            alt: "Set gumica i aksesoara za kosu na stolu",
            desc: "Diskretne gumice u neutralnim tonovima sa mekanom elasti\u010dnom trakom.",
            leadTime: "1\u20132 dana"
        },
        {
            id: "ht-02",
            name: "Pamučne gumice — set od 5",
            category: "hair-tie",
            price: 550,
            image: "https://images.pexels.com/photos/6044135/pexels-photo-6044135.jpeg?auto=compress&cs=tinysrgb&w=400&h=400",
            alt: "Set pamučnih gumica za kosu u raznim bojama",
            desc: "Mekane pamu\u010dne gumice u raznim bojama. Idealne za svaki tip kose.",
            leadTime: "1\u20132 dana"
        },
        {
            id: "set-01",
            name: "Poklon set — 4 komada",
            category: "set",
            price: 1200,
            image: "https://images.pexels.com/photos/7446425/pexels-photo-7446425.jpeg?auto=compress&cs=tinysrgb&w=400&h=400",
            alt: "Poklon set gumica i aksesoara za kosu",
            desc: "Kombinacija scrunchie-ja i gumica u poklon pakovanju. Savr\u0161en poklon za svaku priliku.",
            leadTime: "3\u20135 dana"
        }
    ]
};

var activeFilter = "all";

/* -------------------------------------------
   DOM References
   ------------------------------------------- */

function getElements() {
    return {
        grid: document.getElementById("product-grid"),
        filter: document.getElementById("category-filter"),
        form: document.getElementById("contact-form"),
        navToggle: document.getElementById("nav-toggle"),
        navMenu: document.getElementById("nav-menu"),
        contactChannels: document.getElementById("contact-channels"),
        socialLinks: document.getElementById("social-links"),
        testimonialsGrid: document.getElementById("testimonials-grid"),
        waFloat: document.getElementById("wa-float")
    };
}

/* -------------------------------------------
   Helpers
   ------------------------------------------- */

function formatPrice(amount) {
    return amount.toLocaleString("sr-RS") + " din.";
}

function waLink(text) {
    return "https://wa.me/" + config.whatsapp + "?text=" + encodeURIComponent(text);
}

function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function productMessage(product) {
    return [
        "Zdravo! Zanima me ovaj proizvod:",
        "",
        "\u2022 " + product.name,
        "\u2022 Cena: " + formatPrice(product.price),
        "\u2022 Šifra: " + product.id,
        "",
        "Da li je dostupan i kako mogu da naručim?"
    ].join("\n");
}

/* -------------------------------------------
   Render Products
   ------------------------------------------- */

function renderProducts(els) {
    var products = activeFilter === "all"
        ? config.products
        : config.products.filter(function(p) { return p.category === activeFilter; });

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
                (product.leadTime ? '<p class="lead-time">\u23F1 Izrada: ' + escapeHtml(product.leadTime) + '</p>' : '') +
                '<p class="product-desc">' + escapeHtml(product.desc) + '</p>' +
                '<a class="btn btn-primary btn-small" href="' + waLink(productMessage(product)) + '" target="_blank" rel="noopener">Naruči</a>' +
            '</div>';

        els.grid.appendChild(card);
    });

    observeRevealElements();
}

/* -------------------------------------------
   Contact Channels & Social Links
   ------------------------------------------- */

function renderContactChannels(els) {
    var channels = [
        { label: "WhatsApp", href: waLink("Zdravo! Imam pitanje u vezi gumica za kosu."), icon: "\uD83D\uDCAC" },
        { label: "Telefon: " + config.phone, href: "tel:" + config.phone.replace(/\s/g, ""), icon: "\uD83D\uDCDE" },
        { label: "Email: " + config.email, href: "mailto:" + config.email, icon: "\u2709\uFE0F" },
        { label: "Facebook", href: config.facebook, icon: "\uD83D\uDCD8" },
        { label: "Instagram", href: config.instagram, icon: "\uD83D\uDCF8" }
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
        { label: "Facebook", href: config.facebook },
        { label: "Instagram", href: config.instagram },
        { label: "WhatsApp", href: waLink("Zdravo!") }
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
            '<div class="testimonial-stars">\u2605\u2605\u2605\u2605\u2605</div>' +
            '<p class="testimonial-text">"' + escapeHtml(t.text) + '"</p>' +
            '<div class="testimonial-author">' + escapeHtml(t.name) + ' <span>\u2014 ' + escapeHtml(t.location) + '</span></div>';
        els.testimonialsGrid.appendChild(card);
    });

    observeRevealElements();
}

/* -------------------------------------------
   Category Filter
   ------------------------------------------- */

function populateFilter(els) {
    Object.keys(config.categories).forEach(function(key) {
        var option = document.createElement("option");
        option.value = key;
        option.textContent = config.categories[key];
        els.filter.appendChild(option);
    });
}

/* -------------------------------------------
   Form Submission
   ------------------------------------------- */

function handleFormSubmit(e, els) {
    e.preventDefault();

    var data = new FormData(els.form);
    var name = (data.get("name") || "").trim();
    var contact = (data.get("contact") || "").trim();
    var message = (data.get("message") || "").trim();

    if (!name || !contact || !message) {
        els.form.reportValidity();
        return;
    }

    var text = [
        "Zdravo! Upit sa sajta:",
        "",
        "Ime: " + name,
        "Kontakt: " + contact,
        "Poruka: " + message
    ].join("\n");

    window.open(waLink(text), "_blank", "noopener");
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
        ".payment-info"
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

    // Mark JS as available for CSS reveal
    document.documentElement.classList.add("js");

    try {
        populateFilter(els);
        renderProducts(els);
        renderContactChannels(els);
        renderSocialLinks(els);
        renderTestimonials(els);

        if (els.waFloat) {
            els.waFloat.href = waLink("Zdravo! Imam pitanje u vezi gumica za kosu.");
        }

        if (els.filter) {
            els.filter.addEventListener("change", function() {
                activeFilter = els.filter.value;
                renderProducts(els);
            });
        }

        if (els.navToggle) {
            els.navToggle.addEventListener("click", function() {
                toggleMenu(els);
            });
        }

        if (els.form) {
            els.form.addEventListener("submit", function(e) {
                handleFormSubmit(e, els);
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
