import "./programTV.scss";
import "../../components/clock/clock";

document.getElementById("main-data-input").addEventListener("change", (event) => {
    let date = (event.currentTarget as HTMLInputElement).value;
    if (date) location.assign("/programTV?date=" + Math.round(+new Date(date) / 1000));
});