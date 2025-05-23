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

provide("availability", {
  email,
  password,
  step,
});
</script>

<template>
  <div>
    <Index />
  </div>
</template>
