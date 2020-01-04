import VueRouter from 'vue-router';
import Home from "./pages/Home.vue";
import Programs from "./pages/Programs.vue";
import Sheldule from "./pages/Sheldule.vue";
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
            path: "/sheldule",
            component: Sheldule
        },
        {
            path: "/common_settings",
            component: CommonSettings
        }
    ],
    mode: "history"
})