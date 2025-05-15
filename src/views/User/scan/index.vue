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
import { SearchLg, Trash01 } from "untitledui-js/vue";
import MyButtonGroupV3 from "@components/Button/MyButtonGroupV3.vue";
import MyButtonGroupV2 from "@components/Button/MyButtonGroupV2.vue";
// import DetailSlider from "./sliders/detailSlider.vue";
// import importSlider from "./sliders/importSlider.vue";
import { FilterLines } from "untitledui-js/vue";
// import { BrowserQRCodeReader } from '@zxing/browser';
import { BrowserMultiFormatReader, BrowserCodeReader } from '@zxing/browser';

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
        if (err && !err.message.includes('No MultiFormat Readers were able to detect the code')) {
          console.error(err);
        }
      }
    );
  } catch (error) {
    console.error('Camera error:', error);
  }
});



const video = ref(null);
const result = ref('');

const {
  getRooms = () => Promise.resolve(),
  rooms,
  handleCurrentSlider,
  currentSlider,
  params,
  handleCurrentModal,
  currentModal,
  check,
  deleteRoom,
} = inject("roomsContext", {});
const tableData = ref([]);

const handleChangePage = async (newPage) => {
  params.page = newPage;
  await getRooms();
};

watchEffect(() => {
  console.log("Current Modal State:", currentModal.value);
});
console.log(check);


onBeforeUnmount(() => {
  codeReader?.reset();
});


</script>

<template>
  <MyModalSlider
    :open="currentSlider?.current === 'detail-slider'"
    :onClose="() => handleCurrentSlider(null)"
  >
    <template #element><DetailSlider /> </template>
  </MyModalSlider>
  <MyModalSlider
    :open="currentSlider?.current === 'form-slider'"
    :onClose="() => handleCurrentSlider(null)"
  >
    <template #element><formSlider /> </template>
  </MyModalSlider>
  <MyModalSlider
    :open="currentSlider?.current === 'import-slider'"
    :onClose="() => handleCurrentSlider(null)"
  >
    <template #element><importSlider /> </template>
  </MyModalSlider>
  <simplebar class="h-full" forceVisible="y" autoHide="{false}">
    <div class="bg-white">
      <div class="pb-3 gap-3">
        <p class="text-lg-semibold text-gray/900">Scan User</p>
        <p class="text-sm-regular text-gray/600 pb-2">
          scan the damaged device in the room
        </p>
        <hr class="py-1" />
      </div>
      <div class="flex flex-col gap-4">
        <div class="scanner-container">
          <video
            ref="video"
            class="camera-feed"
            muted
            autoplay
            playsinline
          ></video>
          <div class="result" v-if="result">Result: {{ result }}</div>
        </div>
      </div>
    </div>
  </simplebar>
</template>

<style scoped>
.scanner-container {
  width: 100%;
  aspect-ratio: 3 / 4;
  background-color: #000;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}
.camera-feed {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.result {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: white;
  padding: 8px 8px;
  border-radius: 8px;
  font-weight: bold;
}
</style>