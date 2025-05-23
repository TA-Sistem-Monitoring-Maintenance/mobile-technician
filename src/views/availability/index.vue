<script setup>
import { computed, inject, ref } from "vue";
import MyDatePicker from "@components/DatePicker/MyDatePicker.vue";

const { sendOtp, step, checkOtp, resetPassword } = inject("availability", {});
var startDate = ref();
</script>

<template>
  <simplebar class="h-full" forceVisible="y" autoHide="{false}">
    <div class="bg-white">
      <div class="pb-3 gap-3">
        <p class="text-lg-semibold text-gray/900">Technician Availability</p>
        <p class="text-sm-regular text-gray/600 pb-2">
          Set your availability in form.
        </p>
        <hr class="py-1" />
        <div>
          <MyDatePicker
            v-model="startDate"
            :teleport="true"
            allow-prevent-default
            allow-stop-propagation
          />
        </div>
      </div>
    </div>
  </simplebar>
</template>
