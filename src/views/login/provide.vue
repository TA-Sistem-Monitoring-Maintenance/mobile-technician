<script setup>
import { provide, ref, computed } from "vue";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useRouter } from "vue-router";
import VueCookies from "vue-cookies";
import Index from "./index.vue"; // Assuming you're using Index.vue for login form

// For both Login and Sign-Up
const email = ref("");
const password = ref("");
const confirmPassword = ref(""); // for password confirmation (only for signup)
const name = ref(""); // For sign-up: User's name
const usernameError = ref("");
const passwordError = ref("");
const nameError = ref(""); // For sign-up error
const isLoading = ref(false);
const isSignup = ref(false); // Toggle between login and signup

// Password validation checks
const isLongEnough = computed(
  () => password.value && password.value.length >= 8
);
const hasSpecialChar = computed(
  () => password.value && /[!@#$%^&*(),.?":{}|<>]/.test(password.value)
);
const passwordsMatch = computed(
  () =>
    password.value &&
    confirmPassword.value &&
    password.value === confirmPassword.value
);

const router = useRouter();

// Handle login
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

    // Send the request to the backend
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

// Handle sign-up
async function handleSignUp() {
  try {
    const encryptedPassword = CryptoJS.AES.encrypt(
      password.value,
      import.meta.env.VITE_APP_SECRET_KEY
    ).toString();

    // Prepare form data
    const formData = new FormData();
    formData.append("email", email.value);
    formData.append("password", encryptedPassword);
    formData.append("name", name.value); // Send user's name

    // Get the timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Send the request to the backend
    const response = await axios.post(
      "http://localhost:3000/monitoring/v1/auth/signup", // Adjust your URL for sign-up
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Time-Zone": timeZone,
        },
      }
    );

    // Handle successful sign-up
    VueCookies.set("tokenMonitoringMobile", response.data.token, "1d");
    router.push("/welcome"); // Redirect to a different route on success
  } catch (error) {
    console.error("Sign-Up failed:", error.response?.data || error.message);
  }
}

// Provide login and signup functionality and data to child components
provide("auth", {
  email,
  password,
  confirmPassword,
  name,
  isSignup,
  isLongEnough,
  hasSpecialChar,
  passwordsMatch,
  handleLogin,
  handleSignUp,
});
</script>

<template>
  <div>
    <Index />
  </div>
</template>
