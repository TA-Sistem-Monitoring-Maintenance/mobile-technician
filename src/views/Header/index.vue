<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Menu02 } from "untitledui-js/vue";
import { onClickOutside } from "@vueuse/core"; // Impor untuk click outside

// Placeholder untuk gambar profil (tidak digunakan di contoh ini, tapi ada di kode asli)
const profilePicture = ref();

// Router instance untuk navigasi
const router = useRouter();

// State untuk mengontrol visibilitas dropdown
const isDropdownOpen = ref(false);

// Ref untuk elemen dropdown dan tombol menu (untuk onClickOutside)
const dropdownMenuRef = ref(null);
const menuButtonRef = ref(null);

// Fungsi untuk toggle dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Fungsi navigasi ke halaman profil
const goToProfile = () => {
  router.push("/profile");
  isDropdownOpen.value = false; // Tutup dropdown setelah navigasi
};

// Fungsi untuk logout
const logout = () => {
  console.log("Logout action triggered");
  // Implementasikan logika logout Anda di sini
  // Misalnya: hapus token, panggil API logout, redirect ke halaman login
  isDropdownOpen.value = false; // Tutup dropdown
  router.push("/login"); // Contoh redirect ke halaman login
};

// Fungsi untuk menutup dropdown ketika klik di luar area dropdown dan tombol menu
onClickOutside(
  dropdownMenuRef,
  (event) => {
    // Pastikan klik tidak terjadi pada tombol menu itu sendiri
    // karena tombol menu sudah memiliki @click handler sendiri untuk toggle
    if (menuButtonRef.value && !menuButtonRef.value.contains(event.target)) {
      if (isDropdownOpen.value) {
        isDropdownOpen.value = false;
      }
    }
  },
  { ignore: [menuButtonRef] } // Abaikan klik pada menuButtonRef karena sudah dihandle
);
</script>

<template>
  <nav class="bg-white py-4 flex items-center justify-between">
    <div class="flex flex-col items-center space-y-1">
      <img
        src="../../assets/images/Logo.png"
        alt="App Logo"
        class="w-[90px] h-[60px] mx-auto"
      />
    </div>

    <!-- User Profile & Dropdown -->
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

      <!-- Dropdown Popper -->
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isDropdownOpen"
          ref="dropdownMenuRef"
          class="absolute right-0 mt-12 w-48 origin-top-right bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <a
            href="#"
            @click.prevent="goToProfile"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            role="menuitem"
            tabindex="-1"
            id="menu-item-0"
          >
            Profile
          </a>
          <a
            href="#"
            @click.prevent="logout"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            role="menuitem"
            tabindex="-1"
            id="menu-item-1"
          >
            Logout
          </a>
        </div>
      </transition>
    </div>
  </nav>
  <hr />
</template>

<style scoped>
nav {
  font-family: Arial, sans-serif;
}

/* Pastikan tombol tidak memiliki outline default yang mengganggu jika ada */
button:focus {
  /* outline: none;  -- bisa dihapus jika menggunakan focus utility class dari Tailwind */
}
</style>
