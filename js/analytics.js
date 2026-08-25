export function calculateAverage(entries, property) {

    if (entries.length === 0) {
        return 0;
    }

    const total = entries.reduce((sum, entry) => {
        return sum + entry[property];
    }, 0);

    return total / entries.length;
}


export function displayAverages(
    entries,
    averageMood,
    averageSleep,
    averageAnxiety,
    averageEnergy
) {

    averageMood.textContent = calculateAverage(entries, "mood");
    averageSleep.textContent = calculateAverage(entries, "sleep");
    averageAnxiety.textContent = calculateAverage(entries, "anxiety");
    averageEnergy.textContent = calculateAverage(entries, "energy");
}