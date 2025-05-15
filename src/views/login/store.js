import { provide, ref, computed } from "vue";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useRouter } from "vue-router";
import VueCookies from "vue-cookies";
import Index from "./index.vue";
import { reactive } from "vue";
import MyToaster from "@components/Toaster/MyToaster";

export const email = ref("");
export const password = ref("");

export async function handleLogin(body) {
  try {
    console.log(body);
    const encryptedPassword = CryptoJS.AES.encrypt(
      body.password,
      import.meta.env.VITE_APP_SECRET_KEY
    ).toString();
    console.log(body);

    // Prepare form data
    const formData = new FormData();
    formData.append("email", body.username);
    formData.append("password", encryptedPassword);
    console.log();
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
    // .then(MyToaster)
    // .catch(MyToaster);
    console.log("jajajajajaj", response);
    MyToaster(response);
    VueCookies.set("tokenMonitoringMobile", response.data.token, "1d");
    body.router.push("/task");
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
  }
}
