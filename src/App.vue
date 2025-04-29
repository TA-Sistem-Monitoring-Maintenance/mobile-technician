<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isAuthenticated = ref(false);

const getCookie = (name) => {
  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return value ? value.split("=")[1] : null;
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
  }
});

onUnmounted(() => {
  if (authInterval) {
    clearInterval(authInterval);
  }
});

const shouldShowNavbar = computed(() => isAuthenticated.value);

// const logout = () => {
//   document.cookie = "tokenMonitoringMobile";
//   checkAuth();
//   router.push("/login");
// };
</script>

<template>
  <div class="bg-gray/100 sm:px-4 md:px-6 h-dvh">
    <div class="mx-auto max-w-[425px] bg-white p-1 h-dvh">
      <router-view />
    </div>
  </div>
</template>
