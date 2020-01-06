export function delayDecorator(func: Function, delayMs: number) {
    let timerId = null;

    return () => {
        if (timerId !== null) clearTimeout(timerId);
        timerId = setTimeout(() => {
            timerId = null;
            func();
        }, delayMs);
    }
}