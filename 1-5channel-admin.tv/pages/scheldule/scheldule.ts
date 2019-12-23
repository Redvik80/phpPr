import "./scheldule.scss";
import "../../components/input-find/input-find"
import { backendAddress } from "../../services/common";
import { InputFind } from "../../components/input-find/input-find"
export { };

class ScheldulePage {
    html: {
        root: HTMLElement;
        addBtn: HTMLButtonElement;
        saveBtn: HTMLButtonElement;
        cancelBtn: HTMLButtonElement;
        dateInput: HTMLInputElement;
        rowsContainer: HTMLElement;
    };

    programs: Program[] = [];
    schelduleItems: SchelduleItem[] = [];
    schelduleItemsBackup: string;

    rows: Row[] = [];

    constructor() {
        const compRoot = document.getElementsByClassName("scheldule-crud-container")[0] as HTMLElement;
        this.html = {
            root: compRoot,
            addBtn: compRoot.querySelector(".table__btn._add") as HTMLButtonElement,
            saveBtn: compRoot.querySelector(".table__btn._save") as HTMLButtonElement,
            cancelBtn: compRoot.querySelector(".table__btn._cancel") as HTMLButtonElement,
            dateInput: compRoot.getElementsByClassName("date-input")[0] as HTMLInputElement,
            rowsContainer: compRoot.getElementsByClassName("table__body")[0] as HTMLElement,
        };

        this.html.addBtn.addEventListener("click", this.onAddBtnClick.bind(this));
        this.html.cancelBtn.addEventListener("click", this.onCancelBtnClick.bind(this));
        this.html.saveBtn.addEventListener("click", this.onSaveBtnClick.bind(this));

        // this.html.dateInput.value = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
        this.html.dateInput.value = "2019-11-22";

        this.html.dateInput.addEventListener("change", () => {
            this.updateScheldule();
        });
        this.updateScheldule();
    }

    updateScheldule(schelduleItems: SchelduleItem[] = null) {
        if (!this.html.dateInput.value) return;

        if (this.programs.length === 0) {
            var pr1 = fetch(backendAddress + `/api/program/getAll.php`).then((resp) => resp.json());
        } else {
            var pr1 = new Promise((resolve) => resolve(this.programs)) as Promise<any>;
        }

        if (!schelduleItems) {
            var pr2 = fetch(
                backendAddress + `/api/scheldule/getAll.php?date=` + +new Date(this.html.dateInput.value)
            ).then((resp) => resp.json());
        } else {
            var pr2 = new Promise((resolve) => resolve(schelduleItems)) as Promise<any>;
        }

        Promise.all([pr1, pr2]).then((data) => {
            this.programs = data[0];
            this.schelduleItems = data[1];
            this.schelduleItems.sort((item1, item2) => item1.order - item2.order);

            this.html.rowsContainer.innerHTML = "";
            this.rows = [];
            for (let item of this.schelduleItems) {
                item.program = this.programs.find((item2) => item2.id === item.program_id);
                this.addRow(item);
            }
            this.setAllRowsTime();
            this.schelduleItemsBackup = JSON.stringify(this.schelduleItems.map((item) => {
                const newItem = { ...item };
                delete newItem.program;
                return newItem;
            }));
        });
    }

    addRow(schelduleItem: SchelduleItem) {
        this.html.rowsContainer.insertAdjacentHTML("beforeend",
            `<div class="table__row" data-scheldule-id="${schelduleItem.id}">
                <div class="table__content-cells-container">
                    <div class="table__cell _time">
                        <div class="table__cell-value">${""}</div>
                    </div>
                    <div class="table__cell _program-name">
                        <div class="table__cell-change-elem"></div>
                    </div>
                    <div class="table__cell _program-duration">
                        <div class="table__cell-value">
                            ${schelduleItem.program ? this.convertDuration(schelduleItem.program.duration).str : "0мин."}
                        </div>
                    </div>
                </div>
                <div class="table__cell _btns">
                    <button class="pi pi-arrow-up table__btn _order-minus"></button>
                    <button class="pi pi-arrow-down table__btn _order-plus"></button>
                    <button class="pi pi-trash table__btn _delete"></button>
                </div>
            </div>`
        );
        const newRowHtml = this.html.rowsContainer.lastElementChild as HTMLElement;
        const newRow = {
            html: {
                root: newRowHtml,
                timeValue: newRowHtml.querySelector(".table__cell._time .table__cell-value") as HTMLElement,
                programNameChangeElem: newRowHtml.querySelector(".table__cell._program-name .table__cell-change-elem") as HTMLElement,
                programDurationValue: newRowHtml.querySelector(".table__cell._program-duration .table__cell-value") as HTMLElement,
                btnOrderPlus: newRowHtml.querySelector(".table__btn._order-plus") as HTMLButtonElement,
                btnOrderMinus: newRowHtml.querySelector(".table__btn._order-minus") as HTMLButtonElement,
                btnDelete: newRowHtml.querySelector(".table__btn._delete") as HTMLButtonElement
            },
            value: schelduleItem
        } as Row;
        this.rows.push(newRow);

        new InputFind<Program>(
            newRow.html.programNameChangeElem,
            this.programs,
            schelduleItem.program,
            "name"
        );
        newRow.html.programNameChangeElem.addEventListener("inputFindChange", this.onSelectProgram.bind(this, newRow));
        newRow.html.btnDelete.addEventListener("click", this.onDeleteBtnClick.bind(this, newRow));
        newRow.html.btnOrderPlus.addEventListener("click", this.onOrderPlusBtnClick.bind(this, newRow));
        newRow.html.btnOrderMinus.addEventListener("click", this.onOrderMinusBtnClick.bind(this, newRow));
    }

    async onSaveBtnClick() {
        this.html.root.classList.remove("_changed");
        const newData: SchelduleItem[] = await (await fetch(
            backendAddress + `/api/scheldule/change.php?date=` + +new Date(this.html.dateInput.value),
            {
                method: "PUT",
                body: JSON.stringify(this.schelduleItems.filter((item) => item.program_id).map((item) => {
                    const newItem = { ...item };
                    delete newItem.program;
                    return newItem;
                }))
            }
        )).json();
        this.updateScheldule(newData);
    }

    onCancelBtnClick() {
        this.html.root.classList.remove("_changed");
        this.updateScheldule(JSON.parse(this.schelduleItemsBackup));
    }

    onAddBtnClick() {
        this.html.root.classList.add("_changed");
        const newShelduleItem: SchelduleItem = {
            date: +new Date(this.html.dateInput.value),
            order: this.rows.length + 1,
            program_id: null,
            program: null,
            id: null
        }
        this.schelduleItems.push(newShelduleItem);
        this.addRow(newShelduleItem);
        this.setLastRowTime();
        this.html.rowsContainer.scrollTop = this.html.rowsContainer.scrollHeight;
    }

    onSelectProgram(row: Row) {
        this.html.root.classList.add("_changed");
        const newProgram: Program = (event as CustomEvent).detail.value;
        for (let item of this.rows) {
            if (item.value.order > row.value.order) {
                if (row.value.program) this.rowTimeMinus(item, row.value.program.duration);
                this.rowTimePlus(item, newProgram.duration);
            }
        }
        row.value.program = newProgram;
        row.value.program_id = newProgram.id;
        row.html.programDurationValue.innerText = this.convertDuration(newProgram.duration).str;
    }

    onOrderPlusBtnClick(row: Row) {
        const rowArrIdx = this.rows.findIndex((item) => item.value.id === row.value.id);
        if (rowArrIdx < this.rows.length - 2) {
            row.html.root.parentElement.insertBefore(row.html.root, this.rows[rowArrIdx + 2].html.root);
        } else if (rowArrIdx < this.rows.length - 1) {
            row.html.root.parentElement.appendChild(row.html.root);
        }
        if (rowArrIdx < this.rows.length - 1) {
            this.html.root.classList.add("_changed");
            const nextRow = this.rows[rowArrIdx + 1];
            this.rows[rowArrIdx + 1] = row;
            this.rows[rowArrIdx] = nextRow;
            row.value.order++;
            nextRow.value.order--;
            if (nextRow.value.program) this.rowTimePlus(row, nextRow.value.program.duration);
            if (row.value.program) this.rowTimeMinus(nextRow, row.value.program.duration);
        }
    }

    onOrderMinusBtnClick(row: Row) {
        const rowArrIdx = this.rows.findIndex((item) => item === row);
        if (rowArrIdx > 0) {
            this.html.root.classList.add("_changed");
            const previousRow = this.rows[rowArrIdx - 1];
            row.html.root.parentElement.insertBefore(row.html.root, previousRow.html.root);
            this.rows[rowArrIdx - 1] = row;
            this.rows[rowArrIdx] = previousRow;
            row.value.order--;
            previousRow.value.order++;
            if (previousRow.value.program) this.rowTimeMinus(row, previousRow.value.program.duration);
            if (row.value.program) this.rowTimePlus(previousRow, row.value.program.duration);
        }
    }

    onDeleteBtnClick(row: Row) {
        if (row.value.program && !confirm("Хорошо подумали?")) return;
        this.html.root.classList.add("_changed");
        row.html.root.parentElement.removeChild(row.html.root);
        this.rows.splice(this.rows.findIndex((item) => item === row), 1);
        this.schelduleItems.splice(this.schelduleItems.findIndex((item) => item === row.value), 1);
        for (let item of this.rows) {
            if (item.value.order > row.value.order) {
                item.value.order--;
                if (row.value.program) this.rowTimeMinus(item, row.value.program.duration);
            }
        }
    }

    convertDuration(duration: number) {
        const hours = Math.floor(duration / 3600000);
        const mins = Math.floor((duration - hours * 3600000) / 60000);
        const str = (hours > 0 ? hours + "ч. " : "") + (mins > 0 || hours === 0 ? mins + "мин." : "");
        return { hours, mins, str }
    }

    setAllRowsTime() {
        const time = {
            hours: 0,
            minutes: 0
        };
        for (let row of this.rows) {
            row.html.timeValue.innerText = `${(time.hours < 10 ? "0" : "") + time.hours}:${(time.minutes < 10 ? "0" : "") + time.minutes}`;
            this.checkTime(row);
            time.minutes += Math.round(row.value.program.duration / 60000);
            while (time.minutes > 59) {
                time.minutes -= 60;
                time.hours++;
            }
        }
    }

    setLastRowTime() {
        const previousRow = this.rows[this.rows.length - 2];
        const timeArr = previousRow.html.timeValue.innerText.split(":");
        const time = {
            hours: +timeArr[0],
            minutes: +timeArr[1]
        };
        time.minutes += Math.round((previousRow.value.program ? previousRow.value.program.duration : 0) / 60000);
        while (time.minutes > 59) {
            time.minutes -= 60;
            time.hours++;
        }
        this.rows[this.rows.length - 1].html.timeValue.innerText = `${(time.hours < 10 ? "0" : "") + time.hours}:${(time.minutes < 10 ? "0" : "") + time.minutes}`;
        this.checkTime(this.rows[this.rows.length - 1]);
    }

    rowTimePlus(row: Row, duration: number) {
        const timeArr = row.html.timeValue.innerText.split(":");
        const time = {
            hours: +timeArr[0],
            minutes: +timeArr[1]
        };
        time.minutes += Math.round(duration / 60000);
        while (time.minutes > 59) {
            time.minutes -= 60;
            time.hours++;
        }
        row.html.timeValue.innerText = `${(time.hours < 10 ? "0" : "") + time.hours}:${(time.minutes < 10 ? "0" : "") + time.minutes}`;
        this.checkTime(row);
    }

    rowTimeMinus(row: Row, duration: number) {
        const timeArr = row.html.timeValue.innerText.split(":");
        const time = {
            hours: +timeArr[0],
            minutes: +timeArr[1]
        };
        time.minutes -= Math.round(duration / 60000);
        while (time.minutes < 0) {
            time.minutes += 60;
            time.hours--;
        }
        row.html.timeValue.innerText = `${(time.hours < 10 ? "0" : "") + time.hours}:${(time.minutes < 10 ? "0" : "") + time.minutes}`;
        this.checkTime(row);
    }

    checkTime(row: Row) {
        const timeArr = row.html.timeValue.innerText.split(":");
        const time = {
            hours: +timeArr[0],
            minutes: +timeArr[1]
        };
        time.minutes += Math.round(row.value.program ? row.value.program.duration / 60000 : 0);
        while (time.minutes > 59) {
            time.minutes -= 60;
            time.hours++;
        }
        if (time.hours === 24 && time.minutes === 0 || time.hours < 24) row.html.root.classList.remove("_excess");
        else row.html.root.classList.add("_excess");
    }
}

new ScheldulePage();

class SchelduleItem {
    id: number;
    date: number;
    order: number;
    program_id: number;
    program?: Program;
}

class Program {
    id: number;
    name: string;
    duration: number;
    link: string;
}

class Row {
    html: {
        root: HTMLElement;
        timeValue: HTMLElement;
        programNameChangeElem: HTMLElement;
        programDurationValue: HTMLElement;
        btnOrderPlus: HTMLButtonElement;
        btnOrderMinus: HTMLButtonElement;
        btnDelete: HTMLButtonElement;
    };
    value: SchelduleItem;
}