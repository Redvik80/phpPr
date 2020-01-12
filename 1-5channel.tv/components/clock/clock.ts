const clockElem = document.getElementsByClassName("clock-comp")[0] as HTMLElement;

if (clockElem) {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const dateNow = new Date();
    const hours = dateNow.getUTCHours();
    const mins = dateNow.getUTCMinutes();
    const sec = dateNow.getUTCSeconds();
    clockElem.innerText = (hours < 10 ? "0" : "") + hours + ":" + (mins < 10 ? "0" : "") + mins + ":" + (sec < 10 ? "0" : "") + sec;
}