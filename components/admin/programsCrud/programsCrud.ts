const table = document.getElementsByClassName("programs-crud-table")[0];
const rows = table.querySelectorAll("tbody tr") as NodeListOf<HTMLTableRowElement>;
const addButton = table.querySelector(".buttons-container .add") as HTMLButtonElement;

addButton.addEventListener("click", onAddBtnClick);
rows.forEach((row) => {
    addEventListenersToRow(row);
});

function addEventListenersToRow(row: HTMLTableRowElement) {
    row.getElementsByClassName("change")[0].addEventListener("click", onChangeBtnClick);
    row.getElementsByClassName("cancel")[0].addEventListener("click", onCancelBtnClick);
    row.getElementsByClassName("delete")[0].addEventListener("click", onDeleteBtnClick);
    row.getElementsByClassName("save")[0].addEventListener("click", onSaveBtnClick);
}

async function onSaveBtnClick(event: MouseEvent) {
    const row = getButtonsRow(event.currentTarget as HTMLButtonElement);
    const newData = getRowNewData(row);
    if (newData.id) {
        await fetch(`/api/program/change.php`, {
            method: "post",
            body: JSON.stringify({
                id: newData.id,
                program_name: newData.programName,
                duration: newData.duration
            })
        });
        setRowNewData(row, newData);
        row.classList.remove("changed");
    } else {
        newData.id = await (await fetch(`/api/program/add.php`, {
            method: "post",
            body: JSON.stringify({
                program_name: newData.programName,
                duration: newData.duration
            })
        })).json();
        console.log(newData.id);
        setRowNewData(row, newData);
        row.classList.remove("changed");
    }
}

async function onDeleteBtnClick(event: MouseEvent) {
    if (!confirm("Хорошо подумали?")) return;
    const row = getButtonsRow(event.currentTarget as HTMLButtonElement);
    const id = (row.getElementsByClassName("id-cell")[0] as HTMLElement).innerText;
    await fetch("/api/program/delete.php?id=" + id, { method: "delete" });
    row.style.display = "none";
}

function onCancelBtnClick(event: MouseEvent) {
    const row = getButtonsRow(event.currentTarget as HTMLButtonElement);
    const id = (row.getElementsByClassName("id-cell")[0] as HTMLElement).innerText;
    if (id) {
        row.classList.remove("changed");
        setRowOldData(row);
    }
    else row.parentElement.removeChild(row);
}

function onChangeBtnClick(event: MouseEvent) {
    getButtonsRow(event.currentTarget as HTMLButtonElement).classList.add("changed");
}

function onAddBtnClick() {
    table.insertAdjacentHTML("afterbegin", `
        <tr class="changed">
            <td class="id-cell"></td>
            <td>
                <span class="program-name-text"></span>
                <input class="program-name-input">
            </td>
            <td class="duration-cell">
                <span class="duration-text"></span>
                <span class="duration-inputs">
                    <input type="number" class="duration-hours" min="0" max="60" value="1">ч.
                    <input type="number" class="duration-mins" min="0" max="24" value="0">мин.
                </span>
            </td>
            <td class="buttons-container">
                <button class="pi pi-pencil change"></button>
                <button class="pi pi-trash delete"></button>
                <button class="pi pi-save save"></button>
                <button class="pi pi-times cancel"></button>
            </td>
        </tr>
    `);
    const newRow = table.querySelector("tbody tr") as HTMLTableRowElement;
    addEventListenersToRow(newRow);
}

function getButtonsRow(button: HTMLButtonElement) {
    return (button.parentElement as HTMLElement).parentElement as HTMLElement;
}

function getRowNewData(row: HTMLElement) {
    return {
        id: +(row.getElementsByClassName("id-cell")[0] as HTMLElement).innerText,
        programName: (row.getElementsByClassName("program-name-input")[0] as HTMLInputElement).value,
        duration: +(row.getElementsByClassName("duration-hours")[0] as HTMLInputElement).value * 3600000 +
            +(row.getElementsByClassName("duration-mins")[0] as HTMLInputElement).value * 60000
    }
}

function setRowNewData(row: HTMLElement, newData: ProgramData) {
    (row.getElementsByClassName("id-cell")[0] as HTMLElement).innerText = "" + newData.id;
    (row.getElementsByClassName("program-name-text")[0] as HTMLElement).innerText = newData.programName;
    const hours = Math.floor(newData.duration / 3600000);
    const mins = Math.floor((newData.duration - hours * 3600000) / 60000);
    (row.getElementsByClassName("duration-text")[0] as HTMLElement).innerText = (hours > 0 ? hours + "ч. " : "") +
        (mins > 0 || hours === 0 ? mins + "мин." : "");

    const nameInput = row.getElementsByClassName("program-name-input")[0] as HTMLInputElement;
    nameInput.setAttribute("value", newData.programName);
    const hoursInput = row.getElementsByClassName("duration-hours")[0] as HTMLInputElement;
    hoursInput.setAttribute("value", "" + hours);
    const minsInput = row.getElementsByClassName("duration-mins")[0] as HTMLInputElement;
    minsInput.setAttribute("value", "" + mins);
}

function setRowOldData(row: HTMLElement) {
    const nameInput = row.getElementsByClassName("program-name-input")[0] as HTMLInputElement;
    nameInput.value = nameInput.getAttribute("value");
    const hoursInput = row.getElementsByClassName("duration-hours")[0] as HTMLInputElement;
    hoursInput.value = hoursInput.getAttribute("value");
    const minsInput = row.getElementsByClassName("duration-mins")[0] as HTMLInputElement;
    minsInput.value = minsInput.getAttribute("value");
}

class ProgramData {
    id: number;
    programName: string;
    duration: number;
}