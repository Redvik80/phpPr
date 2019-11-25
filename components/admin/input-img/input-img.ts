export function createInputImg(element: HTMLElement) {
    element.innerHTML = "";
    element.insertAdjacentHTML("afterbegin", `
        <img src="/files/images/noImage.png">
        <label class="button">
            <span>Выбрать изображение</span>
            <input type="file">
        </label>
    `);
    element.classList.add("input-img");

    const img = element.getElementsByTagName("img")[0];
    const input = element.getElementsByTagName("input")[0];
    input.addEventListener("change", (event) => {
        let files = (event.target as any).files;
        if (files[0].type !== 'image/jpeg' && files[0].type !== 'image/png') {
            return alert("Error. Invalid file type. Valid only 'image/jpeg' and 'image/png'.");
        }

        let reader = new FileReader();
        reader.addEventListener("load", (event) => {
            img.src = event.target.result as string;
            element.dataset.newValue = event.target.result as string;
            input.value = null;
        });
        reader.readAsDataURL(files[0]);
    });
}

export function setCurrentInputImgValue(element: HTMLElement, value: string) {
    element.getElementsByTagName("img")[0].src = value;
}

export function getNewInputImgValue(element: HTMLElement) {
    return element.dataset.value;
}

