export class InputFind<ItemType> {

    html: {
        root?: HTMLElement;
        input?: HTMLInputElement;
        valuesContainer?: HTMLElement;
    } = {}

    private valuesList: ItemType[];

    constructor(
        element: HTMLElement,
        valuesList: ItemType[],
        value: ItemType,
        private findField: string
    ) {
        this.valuesList = valuesList;
        this.html.root = element;
        this.html.root.classList.add("input-find");
        this.html.root.innerHTML = "";
        this.html.input = document.createElement("input");
        this.html.valuesContainer = document.createElement("div");
        this.html.valuesContainer.classList.add("input-find__values-container");

        this.html.input.addEventListener("input", this.displayFindRezults.bind(this));

        const visibleListenner = (event: MouseEvent) => {
            if (!this.html.root.contains(event.target as HTMLElement)) {
                document.removeEventListener("mousedown", visibleListenner);
                this.html.valuesContainer.classList.remove("_visible");
                this.html.input.value = JSON.parse(this.html.root.dataset.value || "{}")[this.findField] || "";
            }
        };

        this.html.input.addEventListener("focus", () => {
            document.addEventListener("mousedown", visibleListenner)
            this.displayFindRezults();
        });

        this.html.valuesContainer.addEventListener("click", this.onSelectValue.bind(this, visibleListenner));

        if (value) {
            this.html.root.dataset.value = JSON.stringify(value);
            this.html.input.value = value[this.findField];
        }
        this.html.root.appendChild(this.html.input);
        this.html.root.appendChild(this.html.valuesContainer);
    }

    private find() {
        const words = this.html.input.value.split(/[\s.,-]+/i).filter((item, idx, arr) => {
            return !(item.length < 2 || arr.lastIndexOf(item) > idx);
        });
        if (words.length === 0) return [];

        let rezult = this.valuesList.map((item) => {
            const newItem = { item, wordsQuantity: 0 };
            for (let word of words) {
                if ((new RegExp(`^${word}[\\s.,-]+|[\\s.,-]+${word}[\\s.,-]+|[\\s.,-]+${word}$`, "i")).test(item[this.findField])) {
                    newItem.wordsQuantity++
                };
            }
            return newItem;
        }).filter((item) => item.wordsQuantity > 0);
        rezult.sort((item1, item2) => item2.wordsQuantity - item1.wordsQuantity);
        return rezult.map((item) => item.item);
    }

    private displayFindRezults() {
        this.html.valuesContainer.innerHTML = "";
        let trueValues = this.find();
        for (let item of trueValues) {
            const htmlItem = document.createElement("div");
            htmlItem.dataset.value = JSON.stringify(item);
            htmlItem.innerText = item[this.findField];
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
        this.html.root.dataset.value = element.dataset.value;
        this.html.input.value = JSON.parse(element.dataset.value)[this.findField];
        this.html.valuesContainer.classList.remove("_visible");
        this.html.root.dispatchEvent(new CustomEvent("change"));
    }
}