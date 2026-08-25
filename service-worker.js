const CACHE_NAME = "mood-tracker-v2";

const FILES_TO_CACHE = [
    "./",
    "./mood-tracker.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon.png",
    "./js/storage.js",
    "./js/entries.js",
    "./js/analytics.js",
    "./js/charts.js"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async cache => {
                for (const file of FILES_TO_CACHE) {
                    try {
                        await cache.add(file);
                        console.log("Cached:", file);
                    } catch (error) {
                        console.error("FAILED TO CACHE:", file, error);
                    }
                }
            })
    );

    self.skipWaiting();
});