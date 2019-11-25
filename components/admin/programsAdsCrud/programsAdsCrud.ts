export { };
import { createInputImg, setCurrentInputImgValue, getNewInputImgValue } from "../input-img/input-img"

const table = document.getElementsByClassName("programs-ad-crud-table")[0];
const rowsContainer = document.getElementsByClassName("items")[0];
const rows = rowsContainer.getElementsByTagName("tr") as HTMLCollectionOf<HTMLTableRowElement>;
const addButton = table.querySelector(".buttons-container .add") as HTMLButtonElement;

addButton.addEventListener("click", onAddBtnClick);
for (let i = 0; i < rows.length; i++) {
    addEventListenersToRow(rows[i]);
}

function addEventListenersToRow(row: HTMLTableRowElement) {
    row.getElementsByClassName("change")[0].addEventListener("click", onChangeBtnClick);
    row.getElementsByClassName("cancel")[0].addEventListener("click", onCancelBtnClick);
    // row.getElementsByClassName("delete")[0].addEventListener("click", onDeleteBtnClick);
    row.getElementsByClassName("save")[0].addEventListener("click", onSaveBtnClick);
}

async function onSaveBtnClick(event: MouseEvent) {
    const row = getButtonsRow(event.currentTarget as HTMLButtonElement);
    const newData = getRowNewData(row);
    if (newData.id) {
        await fetch(`/api/programAd/change.php`, {
            method: "post",
            body: JSON.stringify(newData)
        });
    } else {
        newData.id = await (await fetch(`/api/programAd/add.php`, {
            method: "post",
            body: JSON.stringify(newData)
        })).json();

    }
    setRowNewData(row, newData);
    row.classList.remove("changed");
}

// async function onDeleteBtnClick(event: MouseEvent) {
//     if (!confirm("Хорошо подумали?")) return;
//     const row = getButtonsRow(event.currentTarget as HTMLButtonElement);
//     const id = (row.getElementsByClassName("id-cell")[0] as HTMLElement).innerText;
//     await fetch("/api/programAd/delete.php?id=" + id, { method: "delete" });
//     row.style.display = "none";
// }

function onCancelBtnClick(event: MouseEvent) {
    const row = getButtonsRow(event.currentTarget as HTMLButtonElement);
    if (row.dataset.oldData) {
        row.classList.remove("changed");
        setRowOldData(row);
    }
    else {
        row.parentElement.removeChild(row.nextElementSibling);
        row.parentElement.removeChild(row);
    }
}

function onChangeBtnClick(event: MouseEvent) {
    const row = getButtonsRow(event.currentTarget as HTMLButtonElement);
    row.classList.add("changed");
    row.insertAdjacentHTML("afterend", `
            <tr class="change-row">
                <td colspan="2">
                    <div class="cell-title">Описание</div>
                    <textarea class="description-textarea" maxlength="2000"></textarea>
                </td>
                <td colspan="2">
                    <div class="cell-title">Изображение</div>
                    <div class="input-img"></div>
                </td>
                <td class="buttons-container">
                    <button class="pi pi-arrow-up order-plus"></button>
                    <button class="pi pi-arrow-down order-minus"></button>
                </td>
            </tr>
    `);
    createInputImg(row.nextElementSibling.getElementsByClassName("input-img")[0] as HTMLElement);
}

function onAddBtnClick() {
    rowsContainer.insertAdjacentHTML("afterbegin", `
        <tr>
            <td class="id-cell"></td>
            <td colspan="2">
                <span class="name-text"></span>
                <input class="name-input" maxlength="200">
            </td>
            <td class="year-cell">
                <span class="year-text"></span>
                <input class="year-input" type="number">
            </td>
            <td class="buttons-container">
                <button class="pi pi-pencil change"></button>
                <button class="pi pi-trash delete"></button>
                <button class="pi pi-save save"></button>
                <button class="pi pi-times cancel"></button>
            </td>
        </tr>
    `);
    const newRow = rowsContainer.firstElementChild as HTMLTableRowElement;
    const oldData = {
        id: null as any,
        name: "",
        description: "",
        year: null as any,
        img_file_name: null as any,
        new_img_file: null as any,
    }
    addEventListenersToRow(newRow);
    (newRow.getElementsByClassName("change")[0] as HTMLElement).click();
}

function getButtonsRow(button: HTMLButtonElement) {
    return (button.parentElement as HTMLElement).parentElement as HTMLElement;
}

function getRowNewData(row: HTMLElement): RowData {
    const newData = {
        id: null as any,
        name: (row.getElementsByClassName("name-input")[0] as HTMLInputElement).value,
        description: (row.nextElementSibling.getElementsByClassName("description-textarea")[0] as HTMLInputElement).value,
        year: +(row.getElementsByClassName("year-input")[0] as HTMLInputElement).value,
        img_file_name: null as any,
        new_img_file: getNewInputImgValue(row.nextElementSibling.getElementsByClassName("input-img")[0] as HTMLElement) || null
    }

    let oldData: RowData | string = row.dataset.oldData;
    if (oldData) {
        oldData = JSON.parse(oldData) as RowData;
        newData.id = oldData.id;
        newData.img_file_name = oldData.img_file_name;
    }
    return newData;
}

function setRowNewData(row: HTMLElement, newData: RowData) {
    row.dataset.oldData = JSON.stringify(newData);
    (row.getElementsByClassName("id-cell")[0] as HTMLElement).innerText = "" + newData.id;
    (row.getElementsByClassName("name-text")[0] as HTMLElement).innerText = newData.name;
    (row.getElementsByClassName("year-text")[0] as HTMLElement).innerText = newData.year + "";
    setRowOldData(row);
}

function setRowOldData(row: HTMLElement) {
    const oldData = JSON.parse(row.dataset.oldData) as RowData;
    const nameInput = row.getElementsByClassName("name-input")[0] as HTMLInputElement;
    nameInput.value = oldData["name"];
    const yearInput = row.getElementsByClassName("year-input")[0] as HTMLInputElement;
    yearInput.value = oldData["year"] + "";
}

class RowData {
    id: number;
    name: string;
    description: string;
    year: number;
    img_file_name: string;
    new_img_file?: string
}