(function () {
    window.startPlayer = function (sourceUrl) {
        var video = document.getElementById("moviePlayer");
        var overlay = document.getElementById("playOverlay");
        var button = document.getElementById("playButton");
        if (!video || !sourceUrl) {
            return;
        }

        var attached = false;
        function attach() {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = sourceUrl;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(sourceUrl);
                hls.attachMedia(video);
                return;
            }
            video.src = sourceUrl;
        }

        function play() {
            attach();
            video.controls = true;
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            var action = video.play();
            if (action && typeof action.catch === "function") {
                action.catch(function () {
                    if (overlay) {
                        overlay.classList.remove("is-hidden");
                    }
                });
            }
        }

        attach();
        if (button) {
            button.addEventListener("click", function (event) {
                event.stopPropagation();
                play();
            });
        }
        if (overlay) {
            overlay.addEventListener("click", play);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
    };
})();
