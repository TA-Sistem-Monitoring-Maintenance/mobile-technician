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
import { useRouter } from "vue-router";

const {
  handleCurrentSlider,
  currentSlider,
  getDetail,
  currentModal,
  check,
  deleteRoom,
  detailTask,
  handleSubmitForm,
  dropzoneRef,
} = inject("technicianContext", {});

const router = useRouter();
const id = window.location.pathname;
const parts = id.split("/");
const uuid = parts[parts.length - 2];
const selectedRoom = ref(null);
const selectedLocation = ref(null);
const selectedAsset = ref(null);
const loaded = ref(false);
const description = ref("");
const selectedImages = ref([]);

const handleFilesChange = (files) => {
  console.log("Selected files:", files);
  selectedImages.value = files;
};

onMounted(async () => {
  console.log("jalan");
  try {
    await getDetail(uuid);
    console.log(detailTask.value);
    selectedAsset.value = {
      id: detailTask.value.ticket?.asset?.id,
      name: detailTask.value.ticket?.asset?.name,
    };
    selectedRoom.value = {
      id: detailTask.value.ticket?.asset?.room?.id,
      name: detailTask.value.ticket?.asset?.room?.name,
    };
    selectedLocation.value = {
      id: detailTask.value.ticket?.asset?.room?.location?.id,
      name: detailTask.value.ticket?.asset?.room?.location?.name,
    };
    loaded.value = true;
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
  }
});
watch(selectedAsset, (newVal) => {
  console.log("selectedAsset changed:", selectedAsset.value);
  console.log("selectedRoom changed:", selectedRoom.value);
  console.log("selectedLocation changed:", selectedLocation.value);
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
  <!-- <simplebar v-if="loaded" class="h-full" forceVisible="y" autoHide="{false}"> -->
  <div class="bg-white">
    <div class="pb-3 gap-3">
      <p class="text-lg-semibold text-gray/900">Proof of work</p>
      <p class="text-sm-regular text-gray/600 pb-2">
        Proof form for completing the task
      </p>
      <hr class="py-1" />
    </div>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label
          class="text-sm-medium text-gray/700 after:text-red/600 after:content-['*']"
        >
          Location
        </label>
        <MyAsyncDropdown
          class="w-full"
          name="Location"
          :disabled="true"
          :v-model="selectedLocation"
          :modelValue="selectedLocation"
          :placeholder="'Select Location'"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label
          class="text-sm-medium text-gray/700 after:text-red/600 after:content-['*']"
        >
          Room
        </label>
        <MyAsyncDropdown
          class="w-full"
          name="Room"
          :disabled="true"
          :modelValue="selectedRoom"
          :placeholder="'Select Room'"
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
          :disabled="true"
          :modelValue="selectedAsset"
          :placeholder="'Select Equipment'"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label
          class="text-sm-medium text-gray/700 after:text-red/600 after:content-['*']"
        >
          Description
        </label>
        <MyTextArea
          placeholder="Enter a reason..."
          :maxLength="500"
          v-model="description"
        />
      </div>
      <div class="flex flex-col gap-2">
        <MyDropzone
          ref="dropzoneRef"
          :accept="['.jpg', '.jpeg', '.png', '.gif']"
          :multiple="true"
          :maxSize="2_500_000"
          :showImage="true"
          :onChange="handleFilesChange"
        />
      </div>
      <div
        class="sticky bottom-0 left-0 right-0 bg-white z-10 shadow-t px-4 py-3 flex justify-end gap-2 border-t"
      >
        <MyButton color="secondary" variant="outlined" size="md">
          <p class="text-sm-semibold">History</p>
        </MyButton>
        <MyButton
          type="submit"
          color="primary"
          variant="filled"
          size="md"
          @click="
            handleSubmitForm({
              uuid,
              description,
              selectedAsset,
              selectedRoom,
              selectedLocation,
              selectedImages,
            })
          "
        >
          <p class="text-sm-semibold">Send</p>
        </MyButton>
      </div>
    </div>
  </div>
  <!-- </simplebar> -->
</template>
