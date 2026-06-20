(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
            return;
        }
        callback();
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    ready(function () {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");

        if (toggle && panel) {
            toggle.addEventListener("click", function () {
                panel.classList.toggle("is-open");
            });
        }

        document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
            var current = 0;

            function show(index) {
                if (!slides.length) {
                    return;
                }

                current = (index + slides.length) % slides.length;

                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });

                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
                    dot.setAttribute("aria-pressed", dotIndex === current ? "true" : "false");
                });
            }

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    show(index);
                });
            });

            show(0);

            if (slides.length > 1) {
                window.setInterval(function () {
                    show(current + 1);
                }, 5200);
            }
        });

        document.querySelectorAll("[data-card-filter]").forEach(function (input) {
            var targetSelector = input.getAttribute("data-card-filter");
            var cards = Array.prototype.slice.call(document.querySelectorAll(targetSelector));

            input.addEventListener("input", function () {
                var keyword = normalize(input.value);

                cards.forEach(function (card) {
                    var text = normalize(card.getAttribute("data-filter-text") || card.textContent);
                    card.classList.toggle("is-hidden-card", Boolean(keyword) && text.indexOf(keyword) === -1);
                });
            });
        });

        var searchInput = document.querySelector("[data-search-input]");
        var results = document.querySelector("[data-search-results]");

        if (searchInput && results && Array.isArray(window.SearchIndex)) {
            var params = new URLSearchParams(window.location.search);
            var initialQuery = params.get("q") || "";

            searchInput.value = initialQuery;

            function render() {
                var query = normalize(searchInput.value);
                var source = window.SearchIndex;

                if (!query) {
                    results.innerHTML = '<div class="empty-state">输入关键词查找片名、类型、地区或年份。</div>';
                    return;
                }

                var terms = query.split(/\s+/).filter(Boolean);
                var matches = source.filter(function (item) {
                    var text = normalize([
                        item.title,
                        item.category,
                        item.region,
                        item.type,
                        item.year,
                        item.genre,
                        item.oneLine
                    ].join(" "));
                    return terms.every(function (term) {
                        return text.indexOf(term) !== -1;
                    });
                }).slice(0, 80);

                if (!matches.length) {
                    results.innerHTML = '<div class="empty-state">没有找到匹配影片。</div>';
                    return;
                }

                results.innerHTML = matches.map(function (item) {
                    return [
                        '<a class="search-result-card" href="' + item.url + '">',
                        '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
                        '<span>',
                        '<h2>' + escapeHtml(item.title) + '</h2>',
                        '<p>' + escapeHtml(item.oneLine) + '</p>',
                        '<span class="movie-meta"><span>' + escapeHtml(item.category) + '</span><span>' + escapeHtml(String(item.year)) + '</span><span>' + escapeHtml(item.region) + '</span></span>',
                        '</span>',
                        '</a>'
                    ].join("");
                }).join("");
            }

            function escapeHtml(value) {
                return String(value || "")
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
            }

            searchInput.addEventListener("input", render);
            render();
        }
    });
})();
