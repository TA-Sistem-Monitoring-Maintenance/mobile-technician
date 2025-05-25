<script setup>
import { provide, ref, computed, onMounted, watch, reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import Index from "./index.vue";
import { debounce } from "lodash";
import VueCookies from "vue-cookies";
import { Service } from "./service";
const profile = ref({});
const profilePicture = ref(null);
const currentSlider = ref({
  current: "",
  status: false,
});
const params = reactive({
  search: "",
  filter: [],
  meta: [],
});

const router = useRouter();
const base_url = import.meta.env.VITE_APP_BASE_URL;
console.log(base_url);

async function showProfile() {
  try {
    const response = await Service.showProfile();
    profile.value = response.data;
    return response;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}

async function updateProfile(data) {
  try {
    const response = await Service.updateProfile(data);
    alert("Profile updated successfully!");
    return response;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file?.type.startsWith("image/")) {
    profilePicture.value = URL.createObjectURL(file);
  } else {
    console.error("Uploaded file is not an image.");
  }
};

function logout() {
  VueCookies.remove("tokenMonitoringMobile"); // Remove token from storage
  router.push("/login"); // Redirect to login
}

provide("profileContext", {
  showProfile,
  updateProfile,
  handleFileUpload,
  profilePicture,
  logout,
  params,
});
</script>

<template>
  <div>
    <Index />
  </div>
</template>
