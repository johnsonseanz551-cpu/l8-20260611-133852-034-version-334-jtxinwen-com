(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    ready(function () {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (toggle && nav) {
            toggle.addEventListener("click", function () {
                nav.classList.toggle("is-open");
            });
        }

        document.querySelectorAll("[data-search-form]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input");
                var query = input ? input.value.trim() : "";
                if (query) {
                    window.location.href = "./search.html?q=" + encodeURIComponent(query);
                }
            });
        });

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
            var active = 0;
            function showSlide(index) {
                if (!slides.length) {
                    return;
                }
                active = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === active);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === active);
                });
            }
            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    showSlide(index);
                });
            });
            showSlide(0);
            window.setInterval(function () {
                showSlide(active + 1);
            }, 5200);
        }

        var pageSearch = document.querySelector("[data-page-search]");
        if (pageSearch) {
            var params = new URLSearchParams(window.location.search);
            var initialQuery = params.get("q") || "";
            pageSearch.value = initialQuery;
            filterCards(initialQuery);
            pageSearch.addEventListener("input", function () {
                filterCards(pageSearch.value);
            });
        }

        document.querySelectorAll("[data-filter-button]").forEach(function (button) {
            button.addEventListener("click", function () {
                var filter = button.getAttribute("data-filter-button");
                document.querySelectorAll("[data-filter-button]").forEach(function (item) {
                    item.classList.toggle("is-active", item === button);
                });
                document.querySelectorAll(".movie-card[data-type]").forEach(function (card) {
                    var shouldShow = filter === "all" || card.getAttribute("data-type") === filter;
                    card.style.display = shouldShow ? "flex" : "none";
                });
            });
        });

        function filterCards(value) {
            var query = String(value || "").toLowerCase();
            var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card[data-search]"));
            var visible = 0;
            cards.forEach(function (card) {
                var text = card.getAttribute("data-search") || "";
                var matched = !query || text.toLowerCase().indexOf(query) !== -1;
                card.style.display = matched ? "flex" : "none";
                if (matched) {
                    visible += 1;
                }
            });
            document.querySelectorAll("[data-empty]").forEach(function (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            });
        }
    });
})();
