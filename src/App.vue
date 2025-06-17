<script setup>
import { ref, computed, onMounted, onUnmounted, reactive, provide } from "vue";
import { useRouter } from "vue-router";
import Header from "./views/Header/index.vue";
import { get } from "./utils/networkUtils";

const router = useRouter();
const isAuthenticated = ref(false);

const getCookie = (name) => {
  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return value ? value.split("=")[1] : null;
};
const Service = {
  getSession: (body) => get("/mobile/auth/session", body, {}, "form-data"),
};

const checkAuth = () => {
  isAuthenticated.value = !!getCookie("tokenMonitoringMobile");
};

let authInterval = null;

onMounted(() => {
  checkAuth();

  authInterval = setInterval(() => {
    checkAuth();
  }, 1000);

  if (!isAuthenticated.value) {
    router.push("/login");
  } else {
    getSession();
  }
});

onUnmounted(() => {
  if (authInterval) {
    getSession();
    clearInterval(authInterval);
  }
});

const shouldShowNavbar = computed(() => isAuthenticated.value);

const logout = () => {
  document.cookie = "tokenMonitoringMobile";
  checkAuth();
  router.push("/login");
};

const session = reactive({
  id: null,
  name: null,
  email: null,
  role: null,
});

provide("session", session);

async function getSession() {
  try {
    const { data } = await get("mobile/auth/session");
    // assign _directly_ on the reactive object:
    session.id = data.id;
    session.name = data.name;
    session.email = data.email;
    session.role = data.role;
  } catch (e) {
    console.error("Error fetching session:", e);
  }
}
</script>

<template>
  <div class="bg-gray/100 sm:px-4 md:px-6 h-dvh">
    <div class="mx-auto max-w-[425px] bg-white px-3 h-full">
      <div v-if="shouldShowNavbar">
        <Header />
      </div>

      <div v-if="shouldShowNavbar" class="flex flex-col pt-6">
        <router-view />
      </div>

      <div v-else>
        <router-view />
      </div>
    </div>
  </div>
</template>
