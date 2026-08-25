export function formatDate(date) {
    return date.toLocaleDateString();
}

export function formatTime(date) {
    return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    });
}

export function getEntryFromInputs(
    moodInput,
    sleepInput,
    energyInput,
    anxietyInput,
    otherDayCheckbox,
    entryDateInput
) {
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

export function clearEntryForm(
    moodInput,
    sleepInput,
    anxietyInput,
    energyInput,
    otherDayCheckbox,
    entryDateInput,
    dateContainer
) {
    moodInput.value = "";
    sleepInput.value = "";
    anxietyInput.value = "";
    energyInput.value = "";

    otherDayCheckbox.checked = false;
    entryDateInput.value = "";
    dateContainer.style.display = "none";
}

export function createEntryHTML(entry, index) {

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

export function displayEntries(entries, entriesContainer) {

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

export function createEditEntryHTML(entry, index) {
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
export function validateEntry(entry) {

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

export function editEntry(index, entries, entriesContainer) {

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

export function saveEditedEntry(index, card, entries){
    
    entries[index].mood = Number(card.querySelector(".edit-mood").value);
    entries[index].sleep = Number(card.querySelector(".edit-sleep").value);
    entries[index].anxiety = Number(card.querySelector(".edit-anxiety").value);
    entries[index].energy = Number(card.querySelector(".edit-energy").value);
}

