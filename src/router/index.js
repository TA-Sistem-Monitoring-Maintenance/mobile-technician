import { createRouter, createWebHistory } from "vue-router";
import VueCookies from "vue-cookies";

import Login from "../views/login/index.vue";
import ForgotPassword from "../views/ForgotPassword/provide.vue";
import Task from "../views/Task/provide.vue";
import TaskDetail from "../views/Task/TaskDetail.vue";
import Index from "../views/Task/index.vue";
import ScanUser from "../views/User/scan/provide.vue";
import Complaint from "../views/User/scan/complaint/provide.vue";
import History from "../views/User/scan/history/provide.vue";
import Scan from "../views/Task/scan.vue";
import NotMatch from "../views/Task/notMatch.vue";
import FormTechnician from "../views/Task/formTechnician.vue";
// import Detail from "../views/User/scan/history/detail/detailHistory.vue";

// Definisi Rute
const routes = [
  {
    path: "/",
    redirect: () =>
      VueCookies.get("tokenMonitoringMobile") ? "/task" : "/login", // Redirect berdasarkan token
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
    meta: { requiresAuth: false },
  },
  {
    path: "/task",
    component: Task,
    meta: { requiresAuth: true },
    children: [
      { path: "", component: Index },
      { path: ":id", component: TaskDetail },
      {
        path: "scan/:id",
        component: Scan,
      },
      { path: "scan/:id/not-match", component: NotMatch },
      { path: "scan/:id/work-submission", component: FormTechnician },
    ],
  },
  {
    path: "/scanuser",
    name: "ScanUser",
    component: ScanUser,
    meta: { requiresAuth: true },
  },
  {
    path: "/complaint",
    name: "Complaint",
    component: Complaint,
    meta: { requiresAuth: true },
  },
  {
    path: "/history",
    name: "History",
    component: History,
    meta: { requiresAuth: true },
    children: [
      // {
      //   path: "detail",
      //   name: "Detail",
      //   component: Detail,
      //   meta: { requiresAuth: true },
      // },
    ],
  },

  // {
  //   path: "/task/:id",
  //   name: "TaskDetail",
  //   component: TaskDetail,
  //   props: true, // biar `id` di-route bisa diterima sebagai prop
  //   meta: { requiresAuth: true },
  // },
];

// Konfigurasi Vue Router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Menambahkan logika sebelum navigasi
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!VueCookies.get("tokenMonitoringMobile"); // Mengecek token di cookies

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login"); // Redirect ke login jika tidak ada token
  } else if (to.path === "/login" && isAuthenticated) {
    next("/dashboard"); // Redirect ke dashboard jika sudah login dan mencoba mengakses halaman login
  } else {
    next(); // Lanjutkan navigasi jika sudah terautentikasi atau tidak perlu autentikasi
  }
});

export default router;
