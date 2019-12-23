export class InputFind<ItemType> {

    private html: {
        root?: HTMLElement;
        input?: HTMLInputElement;
        valuesContainer?: HTMLElement;
    } = {}

    constructor(
        element: HTMLElement,
        private valuesList: ItemType[],
        private currentValue: ItemType | null,
        private findField: string
    ) {
        this.html.root = element;
        this.html.root.classList.add("input-find");
        this.html.root.innerHTML = "";
        this.html.input = document.createElement("input");
        this.html.input.value = this.currentValue ? this.currentValue[this.findField] : "";
        this.html.valuesContainer = document.createElement("div");
        this.html.valuesContainer.classList.add("input-find__values-container");

        this.html.input.addEventListener("input", this.displayFindRezults.bind(this));
        const visibleListenner = (event: MouseEvent) => {
            if (!this.html.root.contains(event.target as HTMLElement)) {
                document.removeEventListener("mousedown", visibleListenner);
                this.html.valuesContainer.classList.remove("_visible");
                this.html.input.value = this.currentValue ? this.currentValue[this.findField] : "";
            }
        };
        this.html.input.addEventListener("focus", () => {
            document.addEventListener("mousedown", visibleListenner)
            this.displayFindRezults();
        });
        this.html.valuesContainer.addEventListener("click", this.onSelectValue.bind(this, visibleListenner));

        this.html.root.appendChild(this.html.input);
        this.html.root.appendChild(this.html.valuesContainer);
    }

    private find() {
        const words = this.html.input.value.split(/[\s.,-]+/i).filter((item, idx, arr) => {
            return !(item.length < 2 || arr.lastIndexOf(item) > idx);
        });
        if (words.length === 0) return [];

        let rezult = this.valuesList.map((item, idx) => {
            const newItem = { value: item, wordsQuantity: 0, arrIdx: idx };
            for (let word of words) {
                if ((new RegExp(`^${word}[\\s.,-]+|[\\s.,-]+${word}[\\s.,-]+|[\\s.,-]+${word}$`, "i")).test(item[this.findField])) {
                    newItem.wordsQuantity++;
                };
            }
            return newItem;
        }).filter((item) => item.wordsQuantity >= Math.ceil(words.length * 0.5));
        rezult.sort((item1, item2) => item2.wordsQuantity - item1.wordsQuantity);
        return rezult;
    }

    private displayFindRezults() {
        this.html.valuesContainer.innerHTML = "";
        let trueValues = this.find();
        for (let item of trueValues) {
            const htmlItem = document.createElement("div");
            htmlItem.dataset.valueArrIdx = item.arrIdx + "";
            htmlItem.innerText = item.value[this.findField];
            htmlItem.classList.add("input-find__values-item");
            this.html.valuesContainer.appendChild(htmlItem);
        }
        this.html.valuesContainer.classList.add("_visible");
        this.html.valuesContainer.scrollTop = 0;
    }

    private onSelectValue(visibleListenner) {
        document.removeEventListener("mousedown", visibleListenner);
        const element = event.target as HTMLElement;
        if (!element.classList.contains("input-find__values-item")) return;
        this.currentValue = this.valuesList[+element.dataset.valueArrIdx];
        this.html.input.value = this.currentValue[this.findField];
        this.html.valuesContainer.classList.remove("_visible");
        this.html.root.dispatchEvent(new CustomEvent("inputFindChange", { detail: { value: this.currentValue } }));
    }
}