import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify"; // Import Vuetify Vite plugin

export default defineConfig({
  plugins: [
    vue(),
    vuetify(), // Add the Vuetify plugin here
  ],
});
