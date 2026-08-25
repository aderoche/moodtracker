let entries = JSON.parse(localStorage.getItem("moodEntries")) || [];
let currentChart = 0;
let chart;
entries.forEach(entry => {
    entry.date = new Date(entry.date);
});

const MOOD_OVER_TIME = 0;
const moodInput = document.querySelector("#mood");
const sleepInput = document.querySelector("#sleep");
const anxietyInput = document.querySelector("#anxiety");
const energyInput = document.querySelector("#energy");
const entriesContainer = document.querySelector("#entries");
const moodChartCanvas = document.querySelector("#moodChart");
const saveButton = document.querySelector("#save-button");
const nextChartButton = document.querySelector("#next-chart");
const chartTitle = document.querySelector("#chart-title");
const otherDayCheckbox = document.querySelector("#other-day");
const dateContainer = document.querySelector("#date-container");
const entryDateInput = document.querySelector("#entry-date");
const exportButton = document.querySelector("#export-button");
const importFile = document.querySelector("#import-file");
const averageMood = document.querySelector("#average-mood");
const averageSleep = document.querySelector("#average-sleep");
const averageAnxiety = document.querySelector("#average-anxiety");
const averageEnergy = document.querySelector("#average-energy");
const saveMessage = document.querySelector("#save-message");


function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function saveEntries() {
    localStorage.setItem("moodEntries", JSON.stringify(entries));
}

function refreshApp() {
    saveEntries();
    displayEntries();
    showChart();
    displayAverages();
}

function formatDate(date) {
    return date.toLocaleDateString();
}

function formatTime(date) {
    return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
});
}

function getEntryFromInputs() {

    const entry = {
        mood: Number(moodInput.value),
        sleep: Number(sleepInput.value),
        energy: Number(energyInput.value),
        anxiety: Number(anxietyInput.value),

        date: otherDayCheckbox.checked
            ? new Date(entryDateInput.value + "T12:00:00")
            : new Date()
    };
    return entry;
}

function clearEntryForm() {
    moodInput.value = "";
    sleepInput.value = "";
    anxietyInput.value = "";
    energyInput.value = "";

    otherDayCheckbox.checked = false;
    entryDateInput.value = "";
    dateContainer.style.display = "none";
}


function createEntryHTML(entry, index) {

    return `
        <div class="entry">

            <div class="entry-header">
                <p class="entry-date">
                    ${formatDate(entry.date)}
                </p>

                <div class="entry-actions">
                    <button class="edit-button" data-index="${index}">&#9999;</button>
                    <button class="delete-button" data-index="${index}">&#128465;</button>
                </div>
            </div>

            <p class="entry-time">
                ${formatTime(entry.date)}
            </p>

            <p>Mood: ${entry.mood}</p>
            <p>Sleep: ${entry.sleep}</p>
            <p>Anxiety: ${entry.anxiety}</p>
            <p>Energy: ${entry.energy}</p>

        </div>
    `;
}
        

function displayEntries() {

    const sortedEntries = entries
     .map((entry, index) => ({
            entry,
            index
        }))
        .sort((a, b) => b.entry.date - a.entry.date);

    entriesContainer.innerHTML = "";

    for (const { entry, index } of sortedEntries) {

        entriesContainer.innerHTML += createEntryHTML(entry, index);
    }
}

otherDayCheckbox.addEventListener("change", function() {

    if (otherDayCheckbox.checked) {
        dateContainer.style.display = "block";
    } else {
        dateContainer.style.display = "none";
    }

});

function createEditEntryHTML(entry, index) {
    const html = `
    
                <div class="entry entry-editing">

                    <div class="entry-header">
                        <p class="entry-date">
                            ${formatDate(entry.date)}
                        </p>

                        <div class="entry-actions">
                            <button class="save-edit-button" data-index="${index}">Save</button>
                            <button class="cancel-edit-button" data-index="${index}">Cancel</button>
                        </div>
                    </div>

                    <p class="entry-time">
                        ${formatTime(entry.date)}
                    </p>

                    <label>Mood</label>
                    <input class="edit-mood" type="number" min="1" max="10" step="0.5" value="${entry.mood}">

                    <label>Sleep</label>
                    <input class="edit-sleep" type="number" min="1" max="10" step="0.5" value="${entry.sleep}">

                    <label>Anxiety</label>
                    <input class="edit-anxiety" type="number" min="1" max="10" step="0.5" value="${entry.anxiety}">

                    <label>Energy</label>
                    <input class="edit-energy" type="number" min="1" max="10" step="0.5" value="${entry.energy}">

                </div>
    `;
    return html;
}

function validateEntry(entry) {

    return (
        entry.mood >= 1 &&
        entry.mood <= 10 &&
        entry.sleep >= 1 &&
        entry.sleep <= 10 &&
        entry.anxiety >= 1 &&
        entry.anxiety <= 10 &&
        entry.energy >= 1 &&
        entry.energy <= 10 &&
        !isNaN(entry.date.getTime())
    );
}

function editEntry(index) {

    index = Number(index);
    
    const entry = entries[index];

    entriesContainer.innerHTML = "";

    for (let i = 0; i < entries.length; i++) {

        if (i === index) {
            entriesContainer.innerHTML += createEditEntryHTML(entry, index);

        } else {

            const currentEntry = entries[i];

           entriesContainer.innerHTML += createEntryHTML(currentEntry, i);
        }
    }
    const editedCard = entriesContainer.querySelector(
    `.entry-editing`
);

editedCard.scrollIntoView({
    behavior: "smooth",
    block: "center"
});
}

function saveEditedEntry(index, card){
    
    entries[index].mood = Number(card.querySelector(".edit-mood").value);
    entries[index].sleep = Number(card.querySelector(".edit-sleep").value);
    entries[index].anxiety = Number(card.querySelector(".edit-anxiety").value);
    entries[index].energy = Number(card.querySelector(".edit-energy").value);
}

entriesContainer.addEventListener("click", function(event) {
    
    const index = event.target.dataset.index;


    if (event.target.classList.contains("delete-button")){
        if (confirm("Delete this entry?")) {
            
        entries.splice(index, 1);
        refreshApp();
        }
    } else if ( event.target.classList.contains("edit-button")){
        editEntry(index);
    } else if (event.target.classList.contains("save-edit-button")) {

    const index = event.target.dataset.index;

    const card = event.target.closest(".entry");

    saveEditedEntry(index, card);
    refreshApp();
} else if (event.target.classList.contains("cancel-edit-button")) {

    displayEntries();

}
});
function calculateAverage(property) {

    if (entries.length === 0) {
        return 0;
    }

    const total = entries.reduce((sum, entry) => {
        return sum + entry[property];
    }, 0);

    return total / entries.length;
}
function displayAverages() {

    averageMood.textContent = calculateAverage("mood");
    averageSleep.textContent = calculateAverage("sleep");
    averageAnxiety.textContent = calculateAverage("anxiety");
    averageEnergy.textContent = calculateAverage("energy");

}


saveButton.addEventListener("click", function() {

    const entry = getEntryFromInputs();

    if (!validateEntry(entry)) {
        alert("Please enter valid values from 1 to 10.");
        return;
    }

    entries.push(entry);

    refreshApp();
    clearEntryForm();

    saveMessage.textContent = "✓ Entry saved";
    setTimeout(function() {
    saveMessage.textContent = "";
}, 2000);
});

function createMoodOverTimeChart() {
    const dates = entries.map(entry =>
            entry.date.toLocaleDateString()
        );
        const moods = entries.map(entry =>
            entry.mood
        );
        chartTitle.textContent = "Mood Over Time";
        chart = new Chart(moodChartCanvas, {
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

function createScatterChart(xProperty, yProperty, title) {

  const data = entries.map(entry => ({
    x: entry[xProperty],
    y: entry[yProperty],
    date: entry.date
}));

    chartTitle.textContent = title;

    chart = new Chart(moodChartCanvas, {
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
    plugins: {
        legend: {
            display: false
        },

        tooltip: {
            callbacks: {
                label: function(context) {
                    const date = context.raw.date.toLocaleDateString();

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
const chartList = [
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
function showChart() {
    if (chart) {
        chart.destroy();
    }
    if (currentChart === MOOD_OVER_TIME) {
        createMoodOverTimeChart();
        return;

    }

        const selectedChart = chartList[currentChart - 1];
        createScatterChart(
            selectedChart.x,
            selectedChart.y,
            selectedChart.title
        );
    }

nextChartButton.addEventListener("click", function() {
    currentChart++;
    if (currentChart > chartList.length) {
        currentChart = 0;
    }
    showChart();
});
displayEntries();
showChart();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js");
    });
}

function exportData() {
    const data = JSON.stringify(entries);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");

    link.href = url;
    link.download = "mood-data.json";

    link.click();
    URL.revokeObjectURL(url);
}
exportButton.addEventListener("click", exportData);

importFile.addEventListener("change", function(event) {
    
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.onload = function() {
        
        try {
            

        const importedEntries = JSON.parse(reader.result);

        if (!Array.isArray(importedEntries)) {
            alert("Invalid mood data file.");
            return;
        }

        const valid = importedEntries.every(entry =>
            entry.mood !== undefined &&
            entry.sleep !== undefined &&
            entry.anxiety !== undefined &&
            entry.energy !== undefined &&
            entry.date !== undefined
        );

        if (!valid) {
            alert("Invalid mood data file.");
            return;
        }

        importedEntries.forEach(entry => {
            entry.date = new Date(entry.date);
        });

        entries = importedEntries;

        refreshApp();

} catch (error) {
    alert("Invalid mood data file.");
}
};
    reader.readAsText(file);

});

refreshApp();