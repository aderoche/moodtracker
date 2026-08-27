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
    averageMood.textContent = calculateAverage("mood").toFixed(1);
    averageSleep.textContent = calculateAverage("sleep").toFixed(1);
    averageAnxiety.textContent = calculateAverage("anxiety").toFixed(1);
    averageEnergy.textContent = calculateAverage("energy").toFixed(1);
}