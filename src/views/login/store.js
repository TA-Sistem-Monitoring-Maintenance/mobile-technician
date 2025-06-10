// store.js
import { ref } from "vue";
import axios from "axios";
import CryptoJS from "crypto-js";
import VueCookies from "vue-cookies";
import MyToaster from "@components/Toaster/MyToaster"; // Pastikan Anda sudah punya komponen MyToaster

// Login and SignUp Logic
export const email = ref("");
export const password = ref("");

// Handle Login Function
export async function handleLogin(body) {
  try {
    const encryptedPassword = CryptoJS.AES.encrypt(
      body.password,
      import.meta.env.VITE_APP_SECRET_KEY
    ).toString();

    // Prepare form data
    const formData = new FormData();
    formData.append("email", body.username);
    formData.append("password", encryptedPassword);

    // Get timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const response = await axios.post(
      "https://telu-monitoring.site/api/monitoring/v1/mobile/auth/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Time-Zone": timeZone,
        },
      }
    );

    // Show success message using toaster
    MyToaster({
      message: "Login successful!",
      type: "success",
    });

    VueCookies.set("tokenMonitoringMobile", response.data.token, "1d");
    console.log(response?.data);
    if (
      response?.data?.role?.role_menus?.some(
        (menu_item) => menu_item.menu === "Mobile"
      )
    ) {
      body.router.push("/task");
    } else {
      body.router.push("/history");
    }
  } catch (error) {
    MyToaster({
      message: error.response?.data?.message || error.message || "Login failed",
      type: "error",
    });
  }
}

// Handle SignUp Function
export async function handleSignUp(body) {
  console.log(body);
  try {
    const encryptedPassword = CryptoJS.AES.encrypt(
      body.password,
      import.meta.env.VITE_APP_SECRET_KEY
    ).toString();

    // Prepare form data
    const formData = new FormData();
    formData.append("email", body.username);
    formData.append("password", body?.password);
    formData.append("name", body.name);

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log("yang ini jalan");

    const response = await axios.post(
      "https://telu-monitoring.site/api/monitoring/v1/mobile/auth/register", // Adjust URL for registration
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Time-Zone": timeZone,
        },
      }
    );

    MyToaster({
      message: "Registration successful! You can now log in.",
      type: "success",
    });

    body.router.push("/login"); // Redirect on success
  } catch (error) {
    MyToaster({
      message:
        error.response?.data?.message || error.message || "Sign-Up failed",
      type: "error",
    });
  }
}
