<script setup>
import MyDataTable from "@components/Table/MyDataTable.vue";
import MyColumn from "@components/Table/MyColumn.vue";
import axios from "axios";
import { onMounted, inject, ref, watch, onBeforeUnmount } from "vue";
import MyButton from "@components/Button/MyButton.vue";
import { mdiMagnify, mdiPlus, mdiUpload } from "@mdi/js";
import MyTextField from "@components/TextField/MyTextField.vue";
import MyModalSlider from "@components/Slider/MyModalSlider.vue";
// import formSlider from "./sliders/formSlider.vue";
import { debounce } from "lodash";
import MyModal from "@components/Modal/MyModal.vue";
import { watchEffect } from "vue";
import MyChip from "@components/Chip/MyChip.vue";

import simplebar from "simplebar-vue";
import { ChevronLeft, SearchLg, Trash01 } from "untitledui-js/vue";
import MyButtonGroupV3 from "@components/Button/MyButtonGroupV3.vue";
import MyButtonGroupV2 from "@components/Button/MyButtonGroupV2.vue";
// import DetailSlider from "./sliders/detailSlider.vue";
// import importSlider from "./sliders/importSlider.vue";
import { FilterLines } from "untitledui-js/vue";
// import { BrowserQRCodeReader } from '@zxing/browser';
import { BrowserMultiFormatReader, BrowserCodeReader } from "@zxing/browser";
import { useRouter } from "vue-router";

let codeReader;

onMounted(async () => {
  codeReader = new BrowserMultiFormatReader();

  try {
    const devices = await BrowserCodeReader.listVideoInputDevices(); // ✅ di sini

    const selectedDeviceId = devices[0]?.deviceId;

    codeReader.decodeFromVideoDevice(
      selectedDeviceId,
      video.value,
      (res, err) => {
        if (res) {
          result.value = res.getText();
        }
        if (
          err &&
          !err.message.includes(
            "No MultiFormat Readers were able to detect the code"
          )
        ) {
          console.error(err);
        }
      }
    );
  } catch (error) {
    console.error("Camera error:", error);
  }
});
const router = useRouter();

const video = ref(null);
const result = ref("");

const { checkRoom } = inject("technicianContext", {});
const tableData = ref([]);

console.log(result);

// onBeforeUnmount(() => {
//   codeReader?.reset();
// });
watchEffect(async () => {
  const currentResult = result.value;
  const id = window.location.pathname;
  const parts = id.split("/");
  const uuid = parts[parts.length - 1];
  if (currentResult) {
    // Navigates if currentResult is truthy
    console.log(`Result is "${currentResult}". Navigating via watchEffect...`);
    const data = await checkRoom(uuid, currentResult); // Directly await the promise
    console.log("Room check successful:", data);
    if (data === "success") {
      // router.push(`/scanned-item-effect/${encodeURIComponent(currentResult)}`);
    } else {
    }
  }
});
</script>

<template>
  <simplebar class="h-full" forceVisible="y" autoHide="{false}">
    <div class="bg-white items-center pt-[25dvh]">
      <div class="flex flex-col gap-4 justify-center items-center">
        <p class="display-md-semibold text-gray/900">oops!!</p>
        <p class="text-md-regular text-gray/600">
          Sorry, you scanned the wrong room
        </p>
        <MyButton
          class="py-2 px-4 rounded-lg"
          color="primary"
          variant="filled"
          size="sm"
          @click="router.go(-1)"
        >
          <p class="text-sm-semibold">Scan again</p>
        </MyButton>
      </div>
    </div>
  </simplebar>
</template>
