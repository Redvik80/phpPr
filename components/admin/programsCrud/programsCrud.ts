export { };

const comp = document.getElementsByClassName("programs-crud-component")[0] as HTMLElement;
const addBtn = comp.querySelector(".table__btn._add") as HTMLButtonElement;
const rowsContainer = comp.getElementsByClassName("table__body")[0] as HTMLElement;
const rows = rowsContainer.getElementsByClassName("table__row") as HTMLCollectionOf<HTMLElement>;
let programs: Program[] = [];

addBtn.addEventListener("click", onAddBtnClick);

fetch(`/api/program/getAll.php`).then((resp) => resp.json()).then((data) => {
    programs = data;
    for (let program of programs) rowsContainer.insertAdjacentHTML("beforeend", createRow(program));
    for (let i = 0; i < rows.length; i++) addEventListenersToRow(rows[i]);
});

function getRowElems(row: HTMLElement) {
    return {
        id: row.querySelector(".table__cell._id .table__cell-value") as HTMLElement,
        nameValue: row.querySelector(".table__cell._name .table__cell-value") as HTMLElement,
        nameChangeElem: row.querySelector(".table__cell._name .table__cell-change-elem") as HTMLInputElement,
        durationValue: row.querySelector(".table__cell._duration .table__cell-value") as HTMLElement,
        durationChangeElemHours: row.querySelector(".table__cell._duration .table__cell-change-elem._hours") as HTMLInputElement,
        durationChangeElemMins: row.querySelector(".table__cell._duration .table__cell-change-elem._mins") as HTMLInputElement,
        btnChange: row.querySelector(".table__btn._change") as HTMLButtonElement,
        btnDelete: row.querySelector(".table__btn._delete") as HTMLButtonElement,
        btnSave: row.querySelector(".table__btn._save") as HTMLButtonElement,
        btnCancel: row.querySelector(".table__btn._cancel") as HTMLButtonElement
    }
}

function getButtonsRow(button: HTMLButtonElement) {
    return (button.parentElement as HTMLElement).parentElement as HTMLElement;
}

function addEventListenersToRow(row: HTMLElement) {
    const rowElems = getRowElems(row);
    rowElems.btnChange.addEventListener("click", onChangeBtnClick);
    rowElems.btnCancel.addEventListener("click", onCancelBtnClick);
    rowElems.btnDelete.addEventListener("click", onDeleteBtnClick);
    rowElems.btnSave.addEventListener("click", onSaveBtnClick);
}

function convertDuration(duration: number) {
    const hours = Math.floor(duration / 3600000);
    const mins = Math.floor((duration - hours * 3600000) / 60000);
    const str = (hours > 0 ? hours + "ч. " : "") + (mins > 0 || hours === 0 ? mins + "мин." : "");
    return { hours, mins, str }
}

function createRow(program: Program) {
    const duration = convertDuration(program.duration);
    return `<div class="table__row">
        <div class="table__content-cells-container">
            <div class="table__cell _id">
                <div class="table__cell-value">${program.id || ""}</div>
            </div>
            <div class="table__cell _name">
                <div class="table__cell-value">${program.name}</div>
                <input class="table__cell-change-elem" maxlength="200" name="name" value="${program.name}">
            </div>
            <div class="table__cell _duration">
                <div class="table__cell-value">${duration.str}</div>
                <div class="table__cell-change-elem-container">
                    <input class="table__cell-change-elem _hours" type="number" min="0" max="24" value="${duration.hours}">ч.
                    <input class="table__cell-change-elem _mins" type="number" min="0" max="59" value="${duration.mins}">мин.
                </div>
            </div>
        </div>
        <div class="table__cell _btns">
            <button class="pi pi-pencil table__btn _change"></button>
            <button class="pi pi-trash table__btn _delete"></button>
            <button class="pi pi-save table__btn _save"></button>
            <button class="pi pi-times table__btn _cancel"></button>
        </div>
    </div>`
}

function onAddBtnClick() {
    const newProgram: Program = {
        id: null,
        name: "",
        duration: 3600000
    }
    rowsContainer.insertAdjacentHTML("beforeend", createRow(newProgram));
    const newRow = rowsContainer.lastElementChild as HTMLElement;
    addEventListenersToRow(newRow);
    getRowElems(newRow).btnChange.click();
    setTimeout(() => rowsContainer.scrollTop = rowsContainer.scrollHeight);
}

function onChangeBtnClick(event: MouseEvent) {
    const row = getButtonsRow(event.currentTarget as HTMLButtonElement);
    row.classList.add("_changed");
}

function onCancelBtnClick(event: MouseEvent) {
    const row = getButtonsRow(event.currentTarget as HTMLButtonElement);
    const rowElems = getRowElems(row);
    if (rowElems.id.innerText) {
        row.classList.remove("_changed");
        const program = programs.find((item) => item.id + "" === rowElems.id.innerText);
        const duration = convertDuration(program.duration);
        rowElems.nameChangeElem.value = program.name;
        rowElems.durationChangeElemHours.value = duration.hours + "";
        rowElems.durationChangeElemMins.value = duration.mins + "";
    }
    else row.parentElement.removeChild(row);
}

async function onDeleteBtnClick(event: MouseEvent) {
    if (!confirm("Хорошо подумали?")) return;
    const row = getButtonsRow(event.currentTarget as HTMLButtonElement);
    const rowElems = getRowElems(row);
    await fetch("/api/program/delete.php?id=" + rowElems.id.innerText, { method: "delete" });
    programs = programs.filter((item) => item.id + "" !== rowElems.id.innerText);
    row.parentElement.removeChild(row);
}

async function onSaveBtnClick(event: MouseEvent) {
    const row = getButtonsRow(event.currentTarget as HTMLButtonElement);
    const rowElems = getRowElems(row);
    const duration = +rowElems.durationChangeElemHours.value * 3600000 + +rowElems.durationChangeElemMins.value * 60000;
    if (rowElems.id.innerText) {
        const changedProgram = {
            id: +rowElems.id.innerText,
            name: rowElems.nameChangeElem.value,
            duration
        };
        await fetch(`/api/program/change.php`, {
            method: "put",
            body: JSON.stringify(changedProgram)
        });
        programs = programs.map((item) => item.id === changedProgram.id ? changedProgram : item);
    } else {
        const newProgram = {
            id: null,
            name: rowElems.nameChangeElem.value,
            duration
        }
        newProgram.id = await (await fetch(`/api/program/add.php`, {
            method: "post",
            body: JSON.stringify(newProgram)
        })).json();
        rowElems.id.innerText = "" + newProgram.id;
        programs.push(newProgram);
    }
    const durationObj = convertDuration(duration);
    rowElems.nameValue.innerText = rowElems.nameChangeElem.value;
    rowElems.durationValue.innerText = durationObj.str;
    row.classList.remove("_changed");
}

class Program {
    id: number;
    name: string;
    duration: number;
}