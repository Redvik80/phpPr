import VueRouter from 'vue-router';
import Home from "./pages/Home.vue";
import Programs from "./pages/Programs.vue";
import Scheldule from "./pages/Scheldule.vue";
import CommonSettings from "./pages/CommonSettings.vue";

export default new VueRouter({
    routes: [
        {
            path: "",
            redirect: "/home"
        },
        {
            path: "/home",
            component: Home
        },
        {
            path: "/programs",
            component: Programs
        },
        {
            path: "/scheldule",
            component: Scheldule
        },
        {
            path: "/common_settings",
            component: CommonSettings
        }
    ],
    mode: "history"
})