// import { createApp } from "vue";
// import App from "./App.vue";
// import "./main.css";
// createApp(App).mount("#app");

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import "./main.css"; // Tailwind's global styles
import "./style.css";
// import "../node_modules/simplebar/dist/simplebar.min.css";

import vuetify from "../plugins/vuetify";
import "vuetify/styles"; // Import Vuetify styles globally

import PrimeVue from "primevue/config";
import AutoComplete from "primevue/autocomplete";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import VueCookies from "vue-cookies";

const app = createApp(App);

// Use the necessary plugins
app.use(VueCookies);
app.use(router);
// app.use(PrimeVue);
app.use(vuetify);

// Register components globally if needed
app.component("AutoComplete", AutoComplete);

app.mount("#app");
