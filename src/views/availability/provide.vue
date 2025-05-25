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
const availability = ref({});
const router = useRouter();

async function getAvability() {
  try {
    const response = await Service.getAvailability();
    availability.value = response;
    console.log(response);
    return response; // Return response to be used in provide.vue
  } catch (error) {
    console.error("Error fetching rooms:", error);
  }
}

async function createAvailability(body) {
  console.log(body);
  try {
    const formData = new FormData();
    body?.availabilities.forEach((item, index) => {
      if (item?.startDate) {
        formData.append(
          `availabilities[${index}][start_time]`,
          item.startDate.toISOString()
        );
        formData.append(
          `availabilities[${index}][end_time]`,
          item.endDate.toISOString()
        );
      }
    });
    await Service.createAvailability(formData, "form-data")
      .then(MyToaster)
      .then(getAvability)
      .catch(MyToaster);
  } catch (error) {
    console.error("Error fetching roles:", error);
  }
}

provide("availability", {
  email,
  password,
  step,
  createAvailability,
  getAvability,
  availability,
});
</script>

<template>
  <div>
    <Index />
  </div>
</template>
