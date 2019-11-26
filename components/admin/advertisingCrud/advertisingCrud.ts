export { };

import { createInputImg, setCurrentInputImgValue, getNewInputImgValue } from "../input-img/input-img";

const imagesUrlRoot = "/files/images/";

const comp = document.getElementsByClassName("advertising-crud-component")[0] as HTMLElement;
const addBtn = comp.querySelector(".table__btn._add") as HTMLButtonElement;
const rowsContainer = comp.getElementsByClassName("table__body")[0] as HTMLElement;
const rows = rowsContainer.getElementsByClassName("table__row") as HTMLCollectionOf<HTMLElement>;
let advertisings: Advertising[] = [];

addBtn.addEventListener("click", onAddBtnClick);

fetch(`/api/advertising/getAll.php`).then((resp) => resp.json()).then((data) => {
    advertisings = data;
    for (let ad of advertisings) {
        rowsContainer.insertAdjacentHTML("beforeend", createRow(ad));
        const inpImg = rows[rows.length - 1].getElementsByClassName("input-img")[0] as HTMLElement;
        createInputImg(inpImg);
        if (ad.img_file_name) setCurrentInputImgValue(inpImg, imagesUrlRoot + ad.img_file_name);
    }
    for (let i = 0; i < rows.length; i++) addEventListenersToRow(rows[i]);
});

function getRowElems(row: HTMLElement) {
    return {
        id: row.querySelector(".table__cell._id .table__cell-value") as HTMLElement,
        nameValue: row.querySelector(".table__cell._name .table__cell-value") as HTMLElement,
        nameChangeElem: row.querySelector(".table__cell._name .table__cell-change-elem") as HTMLInputElement,
        yearValue: row.querySelector(".table__cell._year .table__cell-value") as HTMLElement,
        yearChangeElem: row.querySelector(".table__cell._year .table__cell-change-elem") as HTMLInputElement,
        descriptionChangeElem: row.querySelector(".table__cell._description .table__cell-change-elem") as HTMLInputElement,
        btnChange: row.querySelector(".table__btn._change") as HTMLButtonElement,
        btnDelete: row.querySelector(".table__btn._delete") as HTMLButtonElement,
        btnSave: row.querySelector(".table__btn._save") as HTMLButtonElement,
        btnCancel: row.querySelector(".table__btn._cancel") as HTMLButtonElement,
        btnOrderPlus: row.querySelector(".table__btn._order-plus") as HTMLButtonElement,
        btnOrderMinus: row.querySelector(".table__btn._order-minus") as HTMLButtonElement,
        btnBlock: row.querySelector(".table__btn._block") as HTMLButtonElement,
        inputImg: row.querySelector(".table__cell._img .table__cell-change-elem") as HTMLElement
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
    rowElems.btnBlock.addEventListener("click", onBlockBtnClick);
    rowElems.btnOrderPlus.addEventListener("click", onOrderPlusBtnClick);
    rowElems.btnOrderMinus.addEventListener("click", onOrderMinusBtnClick);
}

function onOrderPlusBtnClick(event: MouseEvent) {
    const row = getButtonsRow(event.currentTarget as HTMLButtonElement);
    if (row.nextElementSibling) {
        row.parentElement.insertBefore(row, row.nextElementSibling.nextElementSibling);
    }
}

function onOrderMinusBtnClick(event: MouseEvent) {
    const row = getButtonsRow(event.currentTarget as HTMLButtonElement);
    if (row.previousElementSibling) {
        row.parentElement.insertBefore(row, row.previousElementSibling);
    }
}

function createRow(ad: Advertising) {
    return `<div class="table__row" data-is-block="${ad.is_block ? "true" : "false"}" data-order="${ad.order}">
        <div class="table__content-cells-container">
            <div class="table__cell _id">
                <div class="table__cell-value">${ad.id || ""}</div>
            </div>
            <div class="table__cell _name">
                <div class="table__cell-value">${ad.name}</div>
                <input class="table__cell-change-elem" maxlength="200" name="name" value="${ad.name}">
            </div>
            <div class="table__cell _year">
                <div class="table__cell-value">${ad.year}</div>
                <input class="table__cell-change-elem" type="number" min="0" max="9999" value="${ad.year}">
            </div>
            <div class="table__cell _description">
                <div>Описание</div>
                <textarea class="table__cell-change-elem" maxlength="2000">${ad.description}</textarea>
            </div>
            <div class="table__cell _img">
                <div>Изображение</div>
                <div class="input-img table__cell-change-elem"></div>
            </div>
        </div>
        <div class="table__cell _btns">
            <button class="pi pi-pencil table__btn _change"></button>
            <button class="pi pi-trash table__btn _delete"></button>
            <button class="pi pi-save table__btn _save"></button>
            <button class="pi pi-times table__btn _cancel"></button>
            <button class="pi pi-arrow-up table__btn _order-minus"></button>
            <button class="pi pi-arrow-down table__btn _order-plus"></button>
            <button class="pi pi-${ad.is_block ? "unlock" : "lock"} table__btn _block"></button>
        </div>
    </div>`
}

function onAddBtnClick() {
    const newAd: Advertising = {
        id: null,
        name: "",
        description: "",
        img_file_name: "",
        is_block: false,
        order: advertisings.length + 1,
        year: (new Date).getFullYear()
    }
    rowsContainer.insertAdjacentHTML("beforeend", createRow(newAd));
    const newRow = rowsContainer.lastElementChild as HTMLElement;
    addEventListenersToRow(newRow);
    createInputImg(newRow.getElementsByClassName("input-img")[0] as HTMLElement);
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
        const ad = advertisings.find((item) => item.id + "" === rowElems.id.innerText);
        rowElems.nameChangeElem.value = ad.name;
        rowElems.descriptionChangeElem.value = ad.description;
        rowElems.yearChangeElem.value = ad.year + "";

        row.dataset.isBlock = ad.is_block ? "true" : "false";
        if (ad.is_block) {
            rowElems.btnBlock.classList.remove("pi-lock");
            rowElems.btnBlock.classList.add("pi-unlock");
        } else {
            rowElems.btnBlock.classList.remove("pi-unlock");
            rowElems.btnBlock.classList.add("pi-lock");
        }

        let currentOrder = null;
        let oldOrder = ad.order;
        for (let i = 1; i <= rows.length; i++) if (rows[i] === row) {
            currentOrder = i;
            break;
        }
        if (currentOrder > oldOrder) {
            row.parentElement.insertBefore(row, rows[oldOrder - 1]);
        } else if (currentOrder < oldOrder) {
            row.parentElement.insertBefore(row, rows[oldOrder - 1].nextElementSibling);
        }
    }
    else row.parentElement.removeChild(row);
}

async function onDeleteBtnClick(event: MouseEvent) {
    if (!confirm("Хорошо подумали?")) return;
    const row = getButtonsRow(event.currentTarget as HTMLButtonElement);
    const rowElems = getRowElems(row);
    await fetch("/api/advertising/delete.php?id=" + rowElems.id.innerText, { method: "delete" });
    advertisings = advertisings.filter((item) => item.id !== +rowElems.id.innerText);
    const rowOrder = +row.dataset.order;
    row.parentElement.removeChild(row);
    for (let i = 0; i < rows.length; i++) if (+rows[i].dataset.order > rowOrder) {
        rows[i].dataset.order = +rows[i].dataset.order - 1 + "";
    }
    for (let item of advertisings) if (item.order > rowOrder) item.order--;
}

async function onSaveBtnClick(event: MouseEvent) {
    const row = getButtonsRow(event.currentTarget as HTMLButtonElement);
    const rowElems = getRowElems(row);
    let newOrder: number;
    let oldOrder: number;
    for (let i = 0; i < rows.length; i++) if (rows[i] === row) {
        newOrder = i + 1;
        break;
    }
    for (let item of advertisings) if (item.id === +rowElems.id.innerText) {
        oldOrder = item.order;
        break;
    }
    if (!oldOrder) {
        oldOrder = advertisings.length + 1;
    }
    let changedAdId = null;
    if (rowElems.id.innerText) {
        changedAdId = +rowElems.id.innerText;
        const changedAd: Advertising = {
            id: +rowElems.id.innerText,
            name: rowElems.nameChangeElem.value,
            description: rowElems.descriptionChangeElem.value,
            year: +rowElems.yearChangeElem.value,
            img_file_name: "",
            is_block: row.dataset.isBlock === "true" ? true : false,
            order: newOrder,
            newImg: getNewInputImgValue(rowElems.inputImg)
        }
        await fetch(`/api/advertising/change.php`, {
            method: "put",
            body: JSON.stringify(changedAd)
        });
        advertisings = advertisings.map((item) => item.id === changedAd.id ? changedAd : item);
    } else {
        const newAd: Advertising = {
            id: null,
            name: rowElems.nameChangeElem.value,
            description: rowElems.descriptionChangeElem.value,
            year: +rowElems.yearChangeElem.value,
            img_file_name: "",
            is_block: row.dataset.isBlock === "true" ? true : false,
            order: newOrder,
            newImg: getNewInputImgValue(rowElems.inputImg)
        }
        newAd.id = await (await fetch(`/api/advertising/add.php`, {
            method: "post",
            body: JSON.stringify(newAd)
        })).json();
        changedAdId = newAd.id;
        rowElems.id.innerText = "" + newAd.id;
        advertisings.push(newAd);
    }
    rowElems.nameValue.innerText = rowElems.nameChangeElem.value;
    rowElems.yearValue.innerText = rowElems.yearChangeElem.value;
    if (newOrder > oldOrder) {
        for (let item of advertisings) if (item.order > oldOrder && item.order <= newOrder && item.id !== changedAdId) {
            item.order--;
        }
    } else if (newOrder < oldOrder) {
        for (let item of advertisings) if (item.order < oldOrder && item.order >= newOrder && item.id !== changedAdId) {
            item.order++;
        }
    }
    row.classList.remove("_changed");
}

function onBlockBtnClick(event: MouseEvent) {
    const btn = event.currentTarget as HTMLButtonElement;
    const row = getButtonsRow(btn);
    row.dataset.isBlock = row.dataset.isBlock === "true" ? "false" : "true";
    if (row.dataset.isBlock === "true") {
        btn.classList.remove("pi-lock");
        btn.classList.add("pi-unlock");
    } else {
        btn.classList.remove("pi-unlock");
        btn.classList.add("pi-lock");
    }
}

class Advertising {
    id: number;
    name: string;
    year: number;
    description: string;
    img_file_name: string;
    is_block: boolean;
    order: number;
    newImg?: string;
}