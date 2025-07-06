<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, provide } from "vue";
import { useRouter, useRoute } from "vue-router";
import { get } from "./utils/networkUtils";
import Header from "./views/Header/index.vue";

const router = useRouter();
const route = useRoute();

const isAuthenticated = ref(false);
const session = reactive({
  id: null,
  name: null,
  email: null,
  role: null,
  full_photo_url: null,
});

provide("session", session);

let authInterval = null;

function getCookie(name) {
  const m = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return m ? m.split("=")[1] : null;
}
function checkAuth() {
  isAuthenticated.value = !!getCookie("tokenMonitoringMobile");
}

async function getSession() {
  try {
    const { data } = await get("/auth/session");
    Object.assign(session, {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      general: data.generalInstance,
      full_photo_url: data.full_photo_url || null,
    });
  } catch (e) {
    console.error("Error fetching session:", e);
  }
}

provide("getSession", { getSession });

function clearSession() {
  Object.assign(session, {
    id: null,
    name: null,
    email: null,
    role: null,
    general: null,
    full_photo_url: null,
  });
}

function logout() {
  document.cookie =
    "tokenMonitoring=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  checkAuth();
}

onMounted(() => {
  checkAuth();
  if (isAuthenticated.value) {
    getSession();
  } else if (route.path !== "/login") {
    router.push("/login");
  }

  authInterval = setInterval(() => {
    const wasAuth = isAuthenticated.value;
    checkAuth();

    if (isAuthenticated.value && !wasAuth) {
      getSession();
      if (route.path === "/login") {
        router.push("/dashboard");
      }
    }

    if (!isAuthenticated.value && wasAuth) {
      clearSession();
      router.push("/login");
    }
  });
});

onUnmounted(() => {
  clearInterval(authInterval);
});

const shouldShowNavbar = computed(() => isAuthenticated.value);
</script>

<template>
  <div class="bg-gray/100 sm:px-4 md:px-6 h-full">
    <div class="mx-auto max-w-[425px] bg-white px-3 h-full">
      <div v-if="shouldShowNavbar">
        <Header @logout="logout" />
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
