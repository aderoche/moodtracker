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