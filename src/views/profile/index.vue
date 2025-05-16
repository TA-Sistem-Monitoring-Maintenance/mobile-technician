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
import { Camera01 } from "untitledui-js/vue";

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

// watchEffect(() => {
//   console.log("Current Modal State:", currentModal.value);
// });
// console.log(check);

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
        <div>
          <div class="relative inline-block mb-6 ml-2">
            <img
              :src="profilePicture"
              alt="Profile Picture"
              class="w-32 h-32 rounded-full object-cover shadow-lg ring-4 ring-gray-200"
            />
            <button
              @click="triggerFileInput"
              class="absolute bottom-0 right-0 bg-gray-200 p-2 rounded-full shadow-lg transition-colors duration-200"
            >
              <Camera01 class="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Hamilton</h2>
            <p class="text-gray-600 mb-6">Teknisi</p>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-900">Personal info</h3>
            <p class="text-xs text-gray-600 leading-relaxed">
              Update your photo and personal details.
            </p>
          </div>
          <div class="border border-gray-200 rounded-lg p-4 mt-4">
            <div class="flex flex-col gap-2">
              <label
                class="text-sm-medium text-gray/700 after:text-red/600 after:content-['*']"
              >
                Name
              </label>
              <MyTextField
                id="name"
                name="name"
                placeholder="Enter your name"
                
              />
            </div>
            <div class="flex flex-col gap-2 mt-4">
              <label
                class="text-sm-medium text-gray/700 after:text-red/600 after:content-['*']"
              >
                Email
              </label>
              <MyTextField
                id="email"
                name="email"
                placeholder="Enter your email"
                
              />
            </div>
            <div class="flex flex-col gap-2 mt-4">
              <label
                class="text-sm-medium text-gray/700 after:text-red/600 after:content-['*']"
              >
                Whatsapp
              </label>
              <MyTextField
                id="email"
                name="email"
                placeholder="Enter your whatsapp"
                
              />
            </div>
            <div class="flex justify-end gap-2 mt-4">
              <MyButton color="secondary" variant="outlined" size="md">
                <p class="text-sm-semibold">Cancel</p>
              </MyButton>
              <MyButton
                type="submit"
                color="primary"
                variant="filled"
                size="md"
              >
                <p class="text-sm-semibold">Save changes</p>
              </MyButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </simplebar>
</template>
