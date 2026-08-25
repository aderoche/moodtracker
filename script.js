import { loadEntries, saveEntries } from "./js/storage.js";

import {
    getEntryFromInputs,
    clearEntryForm,
    displayEntries,
    validateEntry,
    editEntry,
    saveEditedEntry
} from "./js/entries.js";
import {
    displayAverages
} from "./js/analytics.js";
import {
    chartList,
    showChart
} from "./js/charts.js";


let entries = loadEntries();
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


otherDayCheckbox.addEventListener("change", function() {

    if (otherDayCheckbox.checked) {
        dateContainer.style.display = "block";
    } else {
        dateContainer.style.display = "none";
    }

});

function refreshApp() {
    saveEntries(entries);
    displayEntries(entries, entriesContainer);
    chart = showChart(
    entries,
    moodChartCanvas,
    chartTitle,
    currentChart,
    chart,
    MOOD_OVER_TIME
);
    displayAverages(
        entries,
        averageMood,
        averageSleep,
        averageAnxiety,
        averageEnergy
    );
}

saveButton.addEventListener("click", function() {

const entry = getEntryFromInputs(
    moodInput,
    sleepInput,
    energyInput,
    anxietyInput,
    otherDayCheckbox,
    entryDateInput
); 
    if (!validateEntry(entry)) {
        alert("Please enter valid values from 1 to 10.");
        return;
    }

    entries.push(entry);

    refreshApp();
    clearEntryForm(
        moodInput,
        sleepInput,
        anxietyInput,
        energyInput,
        otherDayCheckbox,
        entryDateInput,
        dateContainer
);
    saveMessage.textContent = "✓ Entry saved";
    setTimeout(function() {
    saveMessage.textContent = "";
}, 2000);
});


nextChartButton.addEventListener("click", function() {

    currentChart++;

    if (currentChart > chartList.length) {
        currentChart = 0;
    }

    chart = showChart(
        entries,
        moodChartCanvas,
        chartTitle,
        currentChart,
        chart,
        MOOD_OVER_TIME
    );
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js");
    });
}
entriesContainer.addEventListener("click", function(event) {
    
    const index = event.target.dataset.index;


    if (event.target.classList.contains("delete-button")){
        if (confirm("Delete this entry?")) {
            
        entries.splice(index, 1);
        refreshApp();
        }
    } else if ( event.target.classList.contains("edit-button")){
        editEntry(index, entries, entriesContainer);    
    } else if (event.target.classList.contains("save-edit-button")) {

    const index = event.target.dataset.index;

    const card = event.target.closest(".entry");


    saveEditedEntry(index, card, entries);   
    refreshApp();
    } else if (event.target.classList.contains("cancel-edit-button")) {

    displayEntries(entries, entriesContainer);

}
});
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