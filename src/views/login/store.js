import { ref } from "vue";
import axios from "axios";
import CryptoJS from "crypto-js";
import VueCookies from "vue-cookies";
import { useRouter } from "vue-router";

// Define form fields
export const email = ref("");
export const password = ref("");

const router = useRouter();

// Handle login function
export async function handleLogin(body) {
  try {
    const encryptedPassword = CryptoJS.AES.encrypt(
      body.password,
      import.meta.env.VITE_APP_SECRET_KEY
    ).toString();

    const formData = new FormData();
    formData.append("email", body.username);
    formData.append("password", encryptedPassword);

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Sending the login request
    const response = await axios.post(
      "http://localhost:3000/monitoring/v1/auth/", // API URL
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Time-Zone": timeZone,
        },
      }
    );

    // Save token and redirect to the task page
    VueCookies.set("tokenMonitoringMobile", response.data.token, "1d");
    router.push("/task");
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    // Optionally, handle error with toaster or another method
  }
}

// Handle sign-up function
export async function handleSignUp(body) {
  try {
    const encryptedPassword = CryptoJS.AES.encrypt(
      body.password,
      import.meta.env.VITE_APP_SECRET_KEY
    ).toString();

    const formData = new FormData();
    formData.append("name", body.name); 
    formData.append("email", body.email);
    formData.append("password", encryptedPassword);

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const response = await axios.post(
      "http://localhost:3000/monitoring/v1/mobile/auth/register", 
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Time-Zone": timeZone,
        },
      }
    );

    // Save token after successful registration
    VueCookies.set("tokenMonitoringMobile", response.data.token, "1d");
    router.push("/welcome"); // Redirect to the welcome page after registration
  } catch (error) {
    console.error("Sign-Up failed:", error.response?.data || error.message);
  }
}
