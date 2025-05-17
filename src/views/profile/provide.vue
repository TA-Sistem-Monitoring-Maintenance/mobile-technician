<script setup>
import { provide, ref, computed, onMounted, watch, reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import Index from "./index.vue";
import { debounce } from "lodash";
import VueCookies from "vue-cookies";

const profile = ref({});
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
    const token = VueCookies.get("tokenMonitoringMobile");
    console.log(token);
    const response = await axios.get(
      `${import.meta.env.VITE_APP_BASE_URL}/auth/show`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token with request
        },
      }
    );
    profile.value = response?.data;
    return response;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error; // Re-throw error so it can be handled in the component
  }
}

async function updateProfile(data) {
  try {
    const token = VueCookies.get("tokenMonitoringMobile");
    const response = await axios.put(
      `${import.meta.env.VITE_APP_BASE_URL}/auth/update`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Profile updated:", response.data);
    alert("Profile updated successfully!");
    return response;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error; // Re-throw error so it can be handled in the component
  }
}

function logout() {
  VueCookies.remove("tokenMonitoringMobile"); // Remove token from storage
  router.push("/login"); // Redirect to login
}

provide("profileContext", {
  showProfile,
  updateProfile,
  logout,
  params,
});
</script>

<template>
  <div>
    <Index />
  </div>
</template>
