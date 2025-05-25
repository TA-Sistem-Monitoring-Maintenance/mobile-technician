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
const router = useRouter();
const video = ref(null);
const result = ref("");
const { checkScannedRoom } = inject("roomsContext", {});
const hasScanned = ref(false);

const stopScanner = () => {
  try {
    // Hentikan ZXing (jika ada)
    if (codeReader && typeof codeReader.reset === "function") {
      codeReader.reset();
      console.log("ZXing scanner stopped");
    }

    // Hentikan semua stream dari video element
    if (video.value?.srcObject) {
      video.value.srcObject.getTracks().forEach((track) => track.stop());
      video.value.srcObject = null;
      console.log("Video stream stopped manually");
    }
  } catch (err) {
    console.error("Error stopping scanner:", err);
  }
};

onMounted(async () => {
  codeReader = new BrowserMultiFormatReader();

  try {
    const devices = await BrowserCodeReader.listVideoInputDevices();
    const selectedDeviceId = devices[0]?.deviceId;

    codeReader.decodeFromVideoDevice(
      selectedDeviceId,
      video.value,
      (res, err) => {
        if (res && !hasScanned.value) {
          hasScanned.value = true; // ✅ Jangan izinkan scan ulang
          const scannedId = res.getText();
          result.value = scannedId;
          validateRoom(scannedId); // cek dan navigate
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

// Watch perubahan route
watch(
  () => router.fullPath,
  (newPath, oldPath) => {
    console.log("Navigasi dari", oldPath, "ke", newPath);
    stopScanner(); // Stop kamera jika pindah halaman
  }
);
// Validasi room dan navigasi
const validateRoom = async (scannedId) => {
  try {
    const res = await checkScannedRoom(scannedId);
    console.log("response dari checkScannedRoom:", res);

    stopScanner(); // ✅ Tambahkan ini sebelum redirect

    if (res?.data) {
      router.push({
        path: "/complaint",
        query: { room_id: res.data.id },
      });
    } else {
      router.push("/notmatchuser");
    }
  } catch (err) {
    stopScanner(); // ✅ Tambahkan ini juga di error
    router.push("/notmatchuser");
  }
};

</script>

<template>
  <simplebar class="h-full" forceVisible="y" autoHide="{false}">
    <div class="bg-white">
      <div class="flex flex-rows gap-3">
        <button
          @click="router.push('/history')"
          class="p-1 mr-2 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Kembali ke daftar task"
        >
          <ChevronLeft class="h-6 w-6 text-gray-700" />
        </button>
        <div class="flex flex-col">
          <p class="text-lg-semibold text-gray/900">Scan QR Code</p>
          <p class="text-sm-regular text-gray/600 pb-2">
            Scan qr code in the room of the task
          </p>
        </div>
      </div>
      <hr class="py-2" />
      <div class="flex flex-col gap-4">
        <div class="flex justify-center">
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
    </div>
  </simplebar>
</template>

<style scoped>
.scanner-container {
  width: 80%;
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
