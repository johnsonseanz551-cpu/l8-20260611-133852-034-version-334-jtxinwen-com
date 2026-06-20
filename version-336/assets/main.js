(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    function initMenu() {
        var button = document.querySelector("[data-menu-button]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    function initHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        var prev = root.querySelector("[data-hero-prev]");
        var next = root.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;
        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }
        function play() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5600);
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                play();
            });
        });
        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                play();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                play();
            });
        }
        show(0);
        play();
    }

    function uniqueValues(cards, getter) {
        var values = [];
        cards.forEach(function (card) {
            var value = getter(card);
            if (value && values.indexOf(value) === -1) {
                values.push(value);
            }
        });
        return values;
    }

    function fillSelect(select, values) {
        if (!select) {
            return;
        }
        values.sort(function (a, b) {
            var na = parseInt(a, 10);
            var nb = parseInt(b, 10);
            if (!isNaN(na) && !isNaN(nb)) {
                return nb - na;
            }
            return String(a).localeCompare(String(b), "zh-Hans-CN");
        });
        values.forEach(function (value) {
            var option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    }

    function initFilters() {
        var scope = document.querySelector("[data-filter-scope]");
        if (!scope) {
            return;
        }
        var cards = Array.prototype.slice.call(scope.querySelectorAll(".js-movie-card"));
        var keyword = document.querySelector("[data-filter-keyword]");
        var year = document.querySelector("[data-filter-year]");
        var type = document.querySelector("[data-filter-type]");
        var category = document.querySelector("[data-filter-category]");
        fillSelect(year, uniqueValues(cards, function (card) { return card.getAttribute("data-year"); }));
        fillSelect(type, uniqueValues(cards, function (card) { return card.getAttribute("data-type"); }));
        function apply() {
            var q = keyword ? keyword.value.trim().toLowerCase() : "";
            var y = year ? year.value : "";
            var t = type ? type.value : "";
            var c = category ? category.value : "";
            cards.forEach(function (card) {
                var text = [
                    card.getAttribute("data-title") || "",
                    card.getAttribute("data-year") || "",
                    card.getAttribute("data-type") || "",
                    card.getAttribute("data-region") || "",
                    card.getAttribute("data-tags") || ""
                ].join(" ").toLowerCase();
                var ok = true;
                if (q && text.indexOf(q) === -1) {
                    ok = false;
                }
                if (y && card.getAttribute("data-year") !== y) {
                    ok = false;
                }
                if (t && card.getAttribute("data-type") !== t) {
                    ok = false;
                }
                if (c && text.indexOf(c.toLowerCase()) === -1) {
                    ok = false;
                }
                card.classList.toggle("is-hidden", !ok);
            });
        }
        [keyword, year, type, category].forEach(function (el) {
            if (el) {
                el.addEventListener("input", apply);
                el.addEventListener("change", apply);
            }
        });
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");
        if (q && keyword) {
            keyword.value = q;
        }
        apply();
    }

    function initPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll(".js-player"));
        players.forEach(function (player) {
            var video = player.querySelector("video");
            var button = player.querySelector(".js-play");
            var url = player.getAttribute("data-stream");
            var started = false;
            var hls = null;
            function start() {
                if (!video || !url) {
                    return;
                }
                if (!started) {
                    started = true;
                    if (button) {
                        button.classList.add("is-hidden");
                    }
                    if (video.canPlayType("application/vnd.apple.mpegurl")) {
                        video.src = url;
                        video.play().catch(function () {});
                    } else if (window.Hls && window.Hls.isSupported()) {
                        hls = new window.Hls();
                        hls.loadSource(url);
                        hls.attachMedia(video);
                        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                            video.play().catch(function () {});
                        });
                    } else {
                        video.src = url;
                        video.play().catch(function () {});
                    }
                } else {
                    video.play().catch(function () {});
                }
            }
            if (button) {
                button.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    start();
                });
            }
            player.addEventListener("click", function (event) {
                if (event.target === video && started) {
                    return;
                }
                if (!started) {
                    start();
                }
            });
            video.addEventListener("play", function () {
                if (button) {
                    button.classList.add("is-hidden");
                }
            });
            window.addEventListener("pagehide", function () {
                if (hls) {
                    hls.destroy();
                    hls = null;
                }
            });
        });
    }

    ready(function () {
        initMenu();
        initHero();
        initFilters();
        initPlayers();
    });
})();
