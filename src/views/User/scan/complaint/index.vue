<script setup>
import MyDataTable from "@components/Table/MyDataTable.vue";
import MyColumn from "@components/Table/MyColumn.vue";
import axios from "axios";
import { onMounted, inject, ref, watch } from "vue";
import MyButton from "@components/Button/MyButton.vue";
import { mdiMagnify, mdiPlus, mdiUpload } from "@mdi/js";
import MyTextField from "@components/TextField/MyTextField.vue";
import MyModalSlider from "@components/Slider/MyModalSlider.vue";
// import formSlider from "./sliders/formSlider.vue";
import { debounce } from "lodash";
import MyModal from "@components/Modal/MyModal.vue";
import { watchEffect } from "vue";
import MyChip from "@components/Chip/MyChip.vue";
import MyAsyncDropdown from "@components/Autocomplete/MyAsyncDropdown.vue";
import MyTextArea from "@components/TextField/MyTextArea.vue";

import simplebar from "simplebar-vue";
import { SearchLg, Trash01 } from "untitledui-js/vue";
import MyButtonGroupV3 from "@components/Button/MyButtonGroupV3.vue";
import MyButtonGroupV2 from "@components/Button/MyButtonGroupV2.vue";
// import DetailSlider from "./sliders/detailSlider.vue";
// import importSlider from "./sliders/importSlider.vue";
import { FilterLines } from "untitledui-js/vue";
import MyDropzone from "@components/Dropzone/MyDropzone.vue";
import { Service } from "./service";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

const router = useRouter();

const goToHistory = () => {
  router.push("/history");
};

const route = useRoute();
const selectedRoom = ref(null);

const selectedLocation = ref(null);

const { searchAsset, handleSubmit, dropzoneRef, asset, reason } = inject(
  "roomsContext",
  {}
);

const isRoomLoaded = ref(false);
const presetRoomId = ref(null);
const selectedImages = ref([]);

const handleFilesChange = (files) => {
  console.log("Selected files:", files);
  selectedImages.value = files;
};

watchEffect(async () => {
  if (isRoomLoaded.value) return;

  const roomId = route.query.room_id;
  if (!roomId) return;

  presetRoomId.value = roomId;

  try {
    const res = await Service.showComplaintRoom(roomId);
    if (res.data) {
      console.log(
        "Room data:",
        res.data.room.location.id,
        res.data.room.location.name
      );
      asset.value = {
        id: res.data.id,
        name: res.data.name,
      };
      selectedRoom.value = {
        id: res.data.room.id,
        name: res.data.room.name,
      };
      selectedLocation.value = res.data.room.location
        ? {
            id: res.data.room.location.id,
            name: res.data.room.location.name,
          }
        : null;
      isRoomLoaded.value = true;
    }
  } catch (error) {
    console.error("Gagal mengambil data room", error);
  }
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
  <!-- <simplebar class="h-full" forceVisible="y" autoHide="{false}"> -->
  <div class="bg-white">
    <div class="pb-3 gap-3">
      <p class="text-lg-semibold text-gray/900">Maintenance Submission Form</p>
      <p class="text-sm-regular text-gray/600 pb-2">maintenance requests</p>
      <hr class="py-1" />
    </div>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label
          class="text-sm-medium text-gray/700 after:text-red/600 after:content-['*']"
        >
          Room
        </label>
        <MyAsyncDropdown
          class="w-full"
          name="Room"
          :placeholder="'Select Room'"
          v-model="selectedRoom"
          :disabled="true"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label
          class="text-sm-medium text-gray/700 after:text-red/600 after:content-['*']"
        >
          Location
        </label>
        <MyAsyncDropdown
          class="w-full"
          name="Location"
          :placeholder="'Select Location'"
          v-model="selectedLocation"
          :disabled="true"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label
          class="text-sm-medium text-gray/700 after:text-red/600 after:content-['*']"
        >
          Equipment
        </label>
        <MyAsyncDropdown
          class="w-full"
          name="asset"
          :placeholder="'Select Equipment'"
          v-model="asset"
          :disabled="true"
          :extraData="selectedRoom?.id"
          :asyncFunction="searchAsset"
          :getOptionLabel="(tag) => tag?.name"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label
          class="text-sm-medium text-gray/700 after:text-red/600 after:content-['*']"
        >
          Reason
        </label>
        <MyTextArea
          placeholder="Enter a reason..."
          v-model="reason"
          :errorMessage="error"
          :helperText="error"
          :maxLength="500"
          onDropAccepted=""
        />
      </div>
      <div class="flex flex-col gap-2">
        <MyDropzone
          ref="dropzoneRef"
          :multiple="true"
          :maxSize="25_000_000"
          :showImage="true"
          :onChange="handleFilesChange"
          :accept="['.png', '.jpg', '.jpeg']"
          capture="environment"
        />
        <!-- <MyDropzone type="photo" :multiple="false" maxSize="25000000" /> -->
      </div>
      <div
        class="sticky bottom-0 left-0 right-0 bg-white z-10 shadow-t px-4 py-3 flex justify-end gap-2 border-t"
      >
        <MyButton
          color="secondary"
          variant="outlined"
          size="md"
          @click="goToHistory"
        >
          <p class="text-sm-semibold">History</p>
        </MyButton>
        <MyButton
          type="submit"
          color="primary"
          variant="filled"
          size="md"
          @click="handleSubmit"
        >
          <p class="text-sm-semibold">Send</p>
        </MyButton>
      </div>
    </div>
  </div>
  <!-- </simplebar> -->
</template>
