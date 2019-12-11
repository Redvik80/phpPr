declare let Quill;

export const backendAddress = "http://1-5channel.tv";
export const imagesUrlRoot = "/files/images/";

export function getQuillEditorValue(quillEditorElem: HTMLElement) {
    return quillEditorElem.firstElementChild.innerHTML;
}

export function setQuillEditorValue(quillEditorElem: HTMLElement, value: string) {
    return quillEditorElem.firstElementChild.innerHTML = value;
}

export function createStandartQuillEditor(elem: HTMLElement) {
    new Quill(elem, {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'size': ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'script': 'sub' }, { 'script': 'super' }, { 'color': [] }, 'clean'],
            ],

        }
    });
}