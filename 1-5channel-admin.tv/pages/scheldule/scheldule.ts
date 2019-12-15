import "./scheldule.scss";
import "../../components/input-find/input-find"
import { backendAddress } from "../../services/common";
import { InputFind } from "../../components/input-find/input-find"
export { };

const comp = document.getElementsByClassName("scheldule-crud-container")[0] as HTMLElement;
const addBtn = comp.querySelector(".table__btn._add") as HTMLButtonElement;
const saveBtn = comp.querySelector(".table__btn._save") as HTMLButtonElement;
const cancelBtn = comp.querySelector(".table__btn._cancel") as HTMLButtonElement;
const dateInput = comp.getElementsByClassName("date-input")[0] as HTMLInputElement;
const rowsContainer = comp.getElementsByClassName("table__body")[0] as HTMLElement;
const rows = rowsContainer.getElementsByClassName("table__row") as HTMLCollectionOf<HTMLElement>;
let schelduleItems: Scheldule[] = [];
let programs: Program[] = [];

addBtn.addEventListener("click", onAddBtnClick);
cancelBtn.addEventListener("click", onCancelBtnClick);
saveBtn.addEventListener("click", onSaveBtnClick);
dateInput.value = new Date().getFullYear() + "-" + new Date().getMonth() + "-" + new Date().getDate();
dateInput.addEventListener("click", onDateChange);
onDateChange();



function onDateChange() {
    const pr1 = fetch(backendAddress + `/api/program/getAll.php`).then((resp) => resp.json());
    const pr2 = fetch(backendAddress + `/api/scheldule/getAll.php?date=` + +new Date(dateInput.value)).then((resp) => resp.json());
    Promise.all([pr1, pr2]).then((data) => {
        programs = data[0];
        schelduleItems = data[1];
        rowsContainer.innerHTML = "";
        for (let item of schelduleItems) rowsContainer.insertAdjacentHTML("beforeend", createRow(item));
        for (let i = 0; i < rows.length; i++) addEventListenersToRow(rows[i]);
    });
}

function getRowElems(row: HTMLElement) {
    return {
        id: row.querySelector(".table__cell._id .table__cell-value") as HTMLElement,
        timeValue: row.querySelector(".table__cell._time .table__cell-value") as HTMLElement,
        programNameChangeElem: row.querySelector(".table__cell._program-name .table__cell-change-elem") as HTMLElement,
        programDurationValue: row.querySelector(".table__cell._program-duration .table__cell-value") as HTMLElement,

        btnOrderPlus: row.querySelector(".table__btn._order-plus") as HTMLButtonElement,
        btnOrderMinus: row.querySelector(".table__btn._order-minus") as HTMLButtonElement,
        btnDelete: row.querySelector(".table__btn._delete") as HTMLButtonElement
    }
}

function getButtonsRow(button: HTMLButtonElement) {
    return (button.parentElement as HTMLElement).parentElement as HTMLElement;
}

function addEventListenersToRow(row: HTMLElement) {
    const rowElems = getRowElems(row);
    new InputFind(
        rowElems.programNameChangeElem,
        programs,
        programs.find((item) => item.id === +row.dataset.programId),
        "name"
    );
    rowElems.programNameChangeElem.addEventListener("change", () => {
        comp.classList.add("_changed");
        rowElems.programDurationValue.innerText = convertDuration(JSON.parse(rowElems.programNameChangeElem.dataset.value).duration).str;
    });
    rowElems.btnDelete.addEventListener("click", onDeleteBtnClick);
    rowElems.btnOrderPlus.addEventListener("click", onOrderPlusBtnClick);
    rowElems.btnOrderPlus.addEventListener("click", onOrderPlusBtnClick);
}

function convertDuration(duration: number) {
    const hours = Math.floor(duration / 3600000);
    const mins = Math.floor((duration - hours * 3600000) / 60000);
    const str = (hours > 0 ? hours + "ч. " : "") + (mins > 0 || hours === 0 ? mins + "мин." : "");
    return { hours, mins, str }
}

function createRow(schelduleItem: Scheldule) {
    const duration = convertDuration(schelduleItem.programDuration);
    return `<div class="table__row" data-scheldule-id="${schelduleItem.id}" data-program-id="${schelduleItem.programId}">
        <div class="table__content-cells-container">
            <div class="table__cell _time">
                <div class="table__cell-value">${""}</div>
            </div>
            <div class="table__cell _program-name">
                <div class="table__cell-change-elem">${schelduleItem.programName}</div>
            </div>
            <div class="table__cell _program-duration">
                <div class="table__cell-value">${duration.str}</div>
            </div>
        </div>
        <div class="table__cell _btns">
            <button class="pi pi-arrow-up table__btn _order-minus"></button>
            <button class="pi pi-arrow-down table__btn _order-plus"></button>
            <button class="pi pi-trash table__btn _delete"></button>
        </div>
    </div>`;
}

function onOrderPlusBtnClick(event: MouseEvent) {
    // const row = getButtonsRow(event.currentTarget as HTMLButtonElement);
    // if (row.nextElementSibling) {
    //     row.parentElement.insertBefore(row, row.nextElementSibling.nextElementSibling);
    // }
}

function onOrderMinusBtnClick(event: MouseEvent) {
    // const row = getButtonsRow(event.currentTarget as HTMLButtonElement);
    // if (row.previousElementSibling) {
    //     row.parentElement.insertBefore(row, row.previousElementSibling);
    // }
}

async function onDeleteBtnClick(event: MouseEvent) {
    // if (!confirm("Хорошо подумали?")) return;
    // const row = getButtonsRow(event.currentTarget as HTMLButtonElement);
    // const rowElems = getRowElems(row);
    // await fetch(backendAddress + "/api/advertising/delete.php?id=" + rowElems.id.innerText, { method: "delete" });
    // advertisings = advertisings.filter((item) => item.id !== +rowElems.id.innerText);
    // const rowOrder = +row.dataset.order;
    // row.parentElement.removeChild(row);
    // for (let i = 0; i < rows.length; i++) if (+rows[i].dataset.order > rowOrder) {
    //     rows[i].dataset.order = +rows[i].dataset.order - 1 + "";
    // }
    // for (let item of advertisings) if (item.order > rowOrder) item.order--;
}

function onSaveBtnClick(event: MouseEvent) {
    comp.classList.remove("_changed");
}
function onCancelBtnClick(event: MouseEvent) {
    comp.classList.remove("_changed");
}
function onAddBtnClick() { }

class Scheldule {
    id: number;
    date: number;
    order: number;

    programId: number;
    programName: string;
    programDuration: number;
}

class Program {
    id: number;
    name: string;
    duration: number;
    link: string;
}