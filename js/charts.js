export function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}


export const chartList = [
    {
        x: "sleep",
        y: "mood",
        title: "Mood vs Sleep"
    },
    {
        x: "anxiety",
        y: "mood",
        title: "Mood vs Anxiety"
    },
    {
        x: "energy",
        y: "mood",
        title: "Mood vs Energy"
    },
    {
        x: "anxiety",
        y: "sleep",
        title: "Sleep vs Anxiety"
    },
    {
        x: "energy",
        y: "sleep",
        title: "Sleep vs Energy"
    },
    {
        x: "energy",
        y: "anxiety",
        title: "Anxiety vs Energy"
    }
];


export function createMoodOverTimeChart(
    entries,
    moodChartCanvas,
    chartTitle
) {

    const dates = entries.map(entry =>
        entry.date.toLocaleDateString()
    );

    const moods = entries.map(entry =>
        entry.mood
    );

    chartTitle.textContent = "Mood Over Time";

    return new Chart(moodChartCanvas, {
        type: "line",

        data: {
            labels: dates,

            datasets: [{
                label: "Mood",
                data: moods,
                borderColor: "#6b003b",
                tension: 0.3
            }]
        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {
                y: {
                    min: 1,
                    max: 10
                }
            }
        }
    });
}


export function createScatterChart(
    entries,
    moodChartCanvas,
    chartTitle,
    xProperty,
    yProperty,
    title
) {

    const data = entries.map(entry => ({
        x: entry[xProperty],
        y: entry[yProperty],
        date: entry.date
    }));

    chartTitle.textContent = title;

    return new Chart(moodChartCanvas, {
        type: "scatter",

        data: {
            datasets: [{
                label: title,
                data: data,
                backgroundColor: "#6b003b",
                pointStyle: "circle"
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
        
            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {

                            const date =
                                context.raw.date.toLocaleDateString();

                            return `${date}: ${yProperty} ${context.raw.y}, ${xProperty} ${context.raw.x}`;
                        }
                    }
                }
            },

            scales: {
                x: {
                    title: {
                        display: true,
                        text: capitalize(xProperty)
                    },

                    min: 1,
                    max: 10
                },

                y: {
                    title: {
                        display: true,
                        text: capitalize(yProperty)
                    },

                    min: 1,
                    max: 10
                }
            }
        }
    });
}


export function showChart(
    entries,
    moodChartCanvas,
    chartTitle,
    currentChart,
    existingChart,
    moodOverTime
) {

    if (existingChart) {
        existingChart.destroy();
    }

    if (currentChart === moodOverTime) {

        return createMoodOverTimeChart(
            entries,
            moodChartCanvas,
            chartTitle
        );
    }

    const selectedChart = chartList[currentChart - 1];

    return createScatterChart(
        entries,
        moodChartCanvas,
        chartTitle,
        selectedChart.x,
        selectedChart.y,
        selectedChart.title
    );
}