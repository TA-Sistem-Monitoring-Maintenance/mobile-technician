<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Menu02 } from "untitledui-js/vue";

// Placeholder untuk gambar profil
const profilePicture = ref();

// Router instance untuk navigasi
const router = useRouter();

// Fungsi navigasi ke halaman profil
const goToProfile = () => {
  router.push("/profile");
};
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

    <!-- User Profile -->
    <div class="flex items-center px-2">
      <button
        @click="goToProfile"
        class="flex items-center text-gray/600 space-x-2 hover:opacity-80"
      >
        <Menu02 />
      </button>
    </div>
  </nav>
  <hr />
</template>

<style scoped>
nav {
  font-family: Arial, sans-serif;
}
</style>
