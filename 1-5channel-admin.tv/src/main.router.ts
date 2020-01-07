import VueRouter from 'vue-router';
import Banners from "./pages/Banners.vue";
import Programs from "./pages/Programs.vue";
import Scheldule from "./pages/Scheldule.vue";
import Pages from "./pages/Pages.vue";
import CommonSettings from "./pages/CommonSettings.vue";
import Auth from "./pages/Auth.vue";

export default new VueRouter({
    routes: [
        {
            path: "",
            redirect: "/banners"
        },
        {
            path: "/banners",
            component: Banners
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
            path: "/pages",
            component: Pages
        },
        {
            path: "/common_settings",
            component: CommonSettings
        },
        {
            path: "/auth",
            component: Auth
        }
    ],
    mode: "history"
})