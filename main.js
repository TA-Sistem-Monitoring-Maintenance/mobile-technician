import { createApp } from "vue";
import App from "./App.vue";
import { createVuetify } from "vuetify";
import "vuetify/styles"; // Import Vuetify styles
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);
app.use(vuetify);
app.mount("#app");
