(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
            return;
        }
        callback();
    }

    ready(function () {
        document.querySelectorAll(".player-shell").forEach(function (shell) {
            var video = shell.querySelector("video");
            var layer = shell.querySelector(".play-layer");
            var hlsUrl = shell.getAttribute("data-hls");
            var attached = false;
            var hls = null;

            if (!video || !hlsUrl) {
                return;
            }

            function attach() {
                if (attached) {
                    return;
                }

                attached = true;

                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = hlsUrl;
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        lowLatencyMode: true,
                        backBufferLength: 90
                    });
                    hls.loadSource(hlsUrl);
                    hls.attachMedia(video);
                    return;
                }

                video.src = hlsUrl;
            }

            function begin() {
                attach();

                if (layer) {
                    layer.classList.add("is-hidden");
                }

                video.setAttribute("controls", "controls");

                var promise = video.play();

                if (promise && typeof promise.catch === "function") {
                    promise.catch(function () {});
                }
            }

            if (layer) {
                layer.addEventListener("click", begin);
            }

            video.addEventListener("click", function () {
                if (video.paused) {
                    begin();
                }
            });

            video.addEventListener("play", function () {
                if (layer) {
                    layer.classList.add("is-hidden");
                }
            });

            window.addEventListener("beforeunload", function () {
                if (hls && typeof hls.destroy === "function") {
                    hls.destroy();
                }
            });
        });
    });
})();
