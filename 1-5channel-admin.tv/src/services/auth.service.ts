import Vue from "vue";
import httpS from "../services/http.service";
import mainRouter from "../main.router";

class AuthService {
    isAuth = false;

    login(login: string, password: string, comp: Vue) {
        comp.$http.post(httpS.api.auth.login, { login, password }).then(async (res) => {
            localStorage.setItem("token", await res.json());
            this.isAuth = true;
            mainRouter.push("/");
        });
    }

    logout(comp: Vue) {
        comp.$http.delete(httpS.api.auth.logout).then(
            () => {
                localStorage.removeItem("token");
                this.isAuth = false;
                mainRouter.push("/auth");
            });
    }

    checkToken(comp: Vue) {
        comp.$http.get(httpS.api.auth.checkToken).then(
            () => {
                this.isAuth = true;
            },
            () => {
                localStorage.removeItem("token");
            }
        );
    }
}

export default new AuthService;