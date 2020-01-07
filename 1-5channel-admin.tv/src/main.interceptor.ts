import httpS from "./services/http.service"
import authS from "./services/auth.service";
import Vue from "vue";
import mainRouter from "./main.router";

export default (req, next) => {
    if (req.url.startsWith("/")) {
        if (["PUT", "POST", "DELETE", "GET"].indexOf(req.method) !== -1) req.headers.set('Authorization', localStorage.getItem("token"));
        req.url = httpS.backendAddress + req.url;
    }
    next((res) => {
        if (res.status === 401) {
            mainRouter.push("/auth");
            authS.isAuth = false;
            localStorage.removeItem("token");
        } else if (res.status === 403) {
            Vue.prototype.$toast.add({
                severity: "error",
                summary: "Ошибка",
                detail: "Введён неверный логин или пароль",
                life: 2000
            });
        } else if (!res.ok) {
            Vue.prototype.$toast.add({
                severity: "error",
                summary: "Что-то пошло не так...",
                detail: "Ошибка! Действие не было выполнено.",
                life: 2000
            });
        } else if (["PUT", "POST", "DELETE"].indexOf(req.method) !== -1 && req.url !== httpS.api.auth.login) {
            Vue.prototype.$toast.add({
                severity: "success",
                summary: "Удача!",
                detail: "Данные успешно изменены.",
                life: 1000
            });
        }
    });
}