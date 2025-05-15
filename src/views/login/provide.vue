<script setup>
import { provide, ref, computed } from "vue";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useRouter } from "vue-router";
import VueCookies from "vue-cookies";
import Index from "./index.vue";

const email = ref("");
const password = ref("");

const router = useRouter();

async function handleLogin() {
  try {
    const encryptedPassword = CryptoJS.AES.encrypt(
      password.value,
      import.meta.env.VITE_APP_SECRET_KEY
    ).toString();

    // Prepare form data
    const formData = new FormData();
    formData.append("email", email.value);
    formData.append("password", encryptedPassword);

    // Get the timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Send the request
    const response = await axios.post(
      "http://localhost:3000/monitoring/v1/auth/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Time-Zone": timeZone,
        },
      }
    );

    VueCookies.set("tokenMonitoringMobile", response.data.token, "1d");
    router.push("/task");
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
  }
}

provide("auth", {
  email,
  password,
  handleLogin,
});
</script>

<template>
  <div>
    <Index />
  </div>
</template>
