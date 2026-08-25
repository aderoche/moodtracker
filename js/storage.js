export function loadEntries() {
    const savedEntries = localStorage.getItem("moodEntries");

    if (!savedEntries || savedEntries === "undefined") {
        return [];
    }

    return JSON.parse(savedEntries);
}
export function saveEntries(entries) {
    localStorage.setItem("moodEntries", JSON.stringify(entries));
}