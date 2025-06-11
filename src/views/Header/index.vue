<template>
  <nav class="bg-white py-4 flex items-center justify-between">
    <div class="flex items-center">
      <img
        src="../../assets/images/Logo.png"
        alt="App Logo"
        class="w-[85px] h-[65px]"
      />
    </div>

    <!-- Menu button -->
    <div class="relative flex items-center px-2">
      <button
        ref="menuButtonRef"
        @click="toggleDropdown"
        class="flex items-center text-gray-600 space-x-2 hover:opacity-80 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-haspopup="true"
        :aria-expanded="isDropdownOpen.toString()"
      >
        <Menu02 class="w-6 h-6" />
      </button>
    </div>
  </nav>
  <hr />

  <Teleport to="body">
    <div
      v-if="isDropdownOpen"
      ref="dropdownMenuRef"
      class="bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 p-3"
      style="z-index: 9999"
      role="menu"
      aria-orientation="vertical"
    >
      <a
        href="#"
        @click.prevent="goToProfile"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        role="menuitem"
      >
        Profile
      </a>
      <a
        href="#"
        @click.prevent="goToAvailability"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        role="menuitem"
      >
        Availability
      </a>
      <a
        href="#"
        @click.prevent="logout"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        role="menuitem"
      >
        Logout
      </a>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUnmount, onMounted } from "vue";
import { createPopper } from "@popperjs/core";
import { onClickOutside } from "@vueuse/core";
import { useRouter } from "vue-router";
import { Menu02 } from "untitledui-js/vue";
import VueCookies from "vue-cookies";
// import getSession  from "../../App.vue"; // Adjust the import path as necessary

const router = useRouter();
const isDropdownOpen = ref(false);
const menuButtonRef = ref(null);
const dropdownMenuRef = ref(null);
let popperInstance = null;

function openPopper() {
  popperInstance = createPopper(menuButtonRef.value, dropdownMenuRef.value, {
    placement: "bottom-end",
    strategy: "fixed",
    modifiers: [
      { name: "offset", options: { offset: [0, 8] } },
      { name: "preventOverflow", options: { padding: 8 } },
    ],
  });
}

function closePopper() {
  if (popperInstance) {
    popperInstance.destroy();
    popperInstance = null;
  }
}

watch(isDropdownOpen, async (open) => {
  if (open) {
    // wait for dropdown to render
    await nextTick();
    openPopper();
  } else {
    closePopper();
  }
});

onClickOutside(
  dropdownMenuRef,
  () => {
    isDropdownOpen.value = false;
  },
  { ignore: [menuButtonRef] }
);

onBeforeUnmount(() => {
  closePopper();
});

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function goToProfile() {
  router.push("/profile");
  isDropdownOpen.value = false;
}

function goToAvailability() {
  router.push("/availability");
  isDropdownOpen.value = false;
}

function logout() {
  VueCookies.remove("tokenMonitoringMobile"); // Remove token from storage
  isDropdownOpen.value = false;
  router.push("/login");
}
const user = null;
// onMounted(() => {
//   getSession().then((response) => {
//     if (response && response.data) {
//       user.value = response.data.user;
//       console.log('user di header',response);// Assuming the user data is in response.data.user
//     } else {
//       console.error("No user data found in session response");
//     }
//   }).catch((error) => {
//     console.error("Error fetching session:", error);
//   });
// });
</script>

<style scoped>
nav {
  font-family: Arial, sans-serif;
}
</style>
