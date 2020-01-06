import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import router from "./routes"
import VueResource from 'vue-resource';

import Menu from 'primevue/menu';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Spinner from 'primevue/spinner';
import SelectButton from 'primevue/selectbutton';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Paginator from 'primevue/paginator';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Editor from 'primevue/editor';
import Panel from 'primevue/panel';
import Checkbox from 'primevue/checkbox';

import ProgramsFindInput from './components/ProgramsFindInput.vue';
import InputFile from './components/InputFile.vue';

import 'primevue/resources/themes/nova-light/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import mainInterceptor from "./main.interceptor"

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueResource);

(Vue as any).http.interceptors.push(mainInterceptor);

Vue.component('Menu', Menu);
Vue.component('Button', Button);
Vue.component('Dialog', Dialog);
Vue.component('InputText', InputText);
Vue.component('Spinner', Spinner);
Vue.component('SelectButton', SelectButton);
Vue.component('Toast', Toast);
Vue.use(ToastService);
Vue.component('Paginator', Paginator);
Vue.component('Calendar', Calendar);
Vue.component('Dropdown', Dropdown);
Vue.component('Editor', Editor);
Vue.component('Panel', Panel);
Vue.component('Checkbox', Checkbox);

Vue.component('ProgramsFindInput', ProgramsFindInput);
Vue.component('InputFile', InputFile);

new Vue({
    render: h => h(App),
    router
}).$mount('#app')
