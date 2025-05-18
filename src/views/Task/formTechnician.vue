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

onMounted(async () => {
  console.log("jalan");
  try {
    await getRooms();
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
  }
});

watchEffect(() => {
  console.log("Current Modal State:", currentModal.value);
});
console.log(check);
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
            name="Equipment"
            :placeholder="'Select Equipment'"
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
            :errorMessage="error"
            :helperText="error"
            :maxLength="500"
          />
        </div>
        <div class="flex flex-col gap-2">
          <MyDropzone
            :errorMessage="error"
            :helperText="error"
            :maxLength="500"
          ></MyDropzone>
        </div>
        <div class="flex justify-end gap-2">
          <MyButton color="secondary" variant="outlined" size="md">
            <p class="text-sm-semibold">History</p>
          </MyButton>
          <MyButton type="submit" color="primary" variant="filled" size="md">
            <p class="text-sm-semibold">Send</p>
          </MyButton>
        </div>
      </div>
    </div>
  </simplebar>
</template>
