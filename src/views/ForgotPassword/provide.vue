<script setup>
import { provide, ref, computed } from "vue";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useRouter } from "vue-router";
import VueCookies from "vue-cookies";
import Index from "./index.vue";
import { Service } from "./service";
import MyToaster from "@components/Toaster/MyToaster";

const email = ref("");
const password = ref("");
var user_id = ref("");
var step = ref(1);

const router = useRouter();

async function sendOtp(body) {
  console.log(body);
  try {
    const formData = new FormData();
    formData.append("email", body.email);
    await Service.sendOTP(formData, "form-data")
      .then((response) => {
        MyToaster(response);
        console.log("response", response);
        if (response) {
          console.log("response inside", response.user_id);
          step.value = 2;
          user_id.value = response.user_id;
          sessionStorage.setItem("otpResponse", JSON.stringify(response));
        }
      })
      .catch((response) => {
        console.log("error", response);
        if (response.message !== "No user with that email is found") {
          console.log("response inside", response);
          step.value = 2;
          user_id.value = response.user_id;
        }
        MyToaster(response);
      });
  } catch (error) {
    console.error("Error fetching roles:", error);
  }
}

async function checkOtp(body) {
  try {
    console.log(user_id);
    const formData = new FormData();
    formData.append("user_id", user_id.value);
    formData.append("otp", body.otp);
    await Service.checkOTP(formData, "form-data")
      .then((response) => {
        MyToaster(response);
        console.log("response", response);
        if (response) {
          console.log("response inside", response);
          step.value = 3;
          sessionStorage.setItem("otpResponse", JSON.stringify(response));
        }
      })
      .catch(MyToaster);
  } catch (error) {
    console.error("Error fetching roles:", error);
  }
}

async function resetPassword(body) {
  try {
    console.log(user_id);
    const formData = new FormData();
    formData.append("user_id", user_id.value);
    formData.append("password", body.password);
    await Service.resetPassword(formData, "form-data")
      .then((response) => {
        MyToaster(response);

        if (response) {
          step.value = 4;
          sessionStorage.setItem("otpResponse", JSON.stringify(response));
        }
      })
      .catch(MyToaster);
  } catch (error) {
    console.error("Error fetching roles:", error);
  }
}
provide("forgotPassword", {
  email,
  password,
  step,
  sendOtp,
  checkOtp,
  resetPassword,
});
</script>

<template>
  <div>
    <Index />
  </div>
</template>
