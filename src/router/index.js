import { createRouter, createWebHistory } from "vue-router";
import VueCookies from "vue-cookies";

import Login from "../views/login/index.vue";

// Definisi Rute
const routes = [
  {
    path: "/",
    redirect: () =>
      VueCookies.get("tokenMonitoringMobile") ? "/dashboard" : "/login", // Redirect berdasarkan token
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false },
  },
];

// Konfigurasi Vue Router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Menambahkan logika sebelum navigasi
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!VueCookies.get("tokenMonitoring"); // Mengecek token di cookies

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login"); // Redirect ke login jika tidak ada token
  } else if (to.path === "/login" && isAuthenticated) {
    next("/dashboard"); // Redirect ke dashboard jika sudah login dan mencoba mengakses halaman login
  } else {
    next(); // Lanjutkan navigasi jika sudah terautentikasi atau tidak perlu autentikasi
  }
});

export default router;
