import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify"; // Import Vuetify Vite plugin
import path from "path";

export default defineConfig({
  base: '/mobile-technician/',
  plugins: [
    vue(),
    vuetify(), // Add the Vuetify plugin here
  ],
  resolve: {
    alias: {
      // Now `@bo` → mobile-technician/backoffice/src/views/components
      "@components": path.resolve(__dirname, "backoffice/src/components"),
    },
  },
  // server: {
  //   fs: {
  //     // Let Vite read files from the sibling `backoffice/` folder
  //     allow: ["backoffice"],
  //   },
  // },
});
