const CACHE_NAME = "mood-tracker-v1";

const FILES_TO_CACHE = [
    "./",
    "./mood-tracker.html",
    "./style.css",
    "./script.js"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    );
});