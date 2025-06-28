<script setup>
import MyDataTable from "@components/Table/MyDataTable.vue";
import MyColumn from "@components/Table/MyColumn.vue";
import axios from "axios";
import { onMounted, inject, ref, watch, reactive } from "vue";
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
import MyCheckBox from "@components/Check/MyCheckBox.vue";

const {
  handleCurrentSlider,
  currentSlider,
  getDetail,
  currentModal,
  check,
  deleteRoom,
  detailTask,
  handleSubmitFormChecklist,
  getAllAssets,
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
let assets = ref([]);

// Checklist state for each asset
const checklistData = ref([]);

// Fetch assets and initialize checklistData
onMounted(async () => {
  console.log("jalan");
  try {
    await getAllAssets(uuid).then((response) => {
      console.log("Assets fetched:", response?.data);
      assets.value = response?.data;
      // Initialize checklistData
      checklistData.value = assets.value.map((asset) => ({
        id: asset.id,
        asset_id: asset.asset_id,
        checked: !!asset.check_status,
        remarks: asset.remarks || "",
        assetObj: asset, // keep reference for display
      }));
    });
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
  }
});
watch(selectedAsset, (newVal) => {
  console.log("selectedAsset changed:", selectedAsset.value);
  console.log("selectedRoom changed:", selectedRoom.value);
  console.log("selectedLocation changed:", selectedLocation.value);
});
console.log("checklist jalan", assets.value);

// Toggle individual asset check
function toggleCheck(assetId) {
  const item = checklistData.value.find((a) => a.id === assetId);
  if (item) item.checked = !item.checked;
}

// "Check All" functionality
function checkAll() {
  const allChecked = checklistData.value.every((a) => a.checked);
  checklistData.value.forEach((a) => (a.checked = !allChecked));
}
</script>

<template>
  <div class="bg-white">
    <div class="pb-3 gap-3">
      <p class="text-lg-semibold text-gray/900">Checklist Assets</p>
      <p class="text-sm-regular text-gray/600 pb-2">
        Checklist all the assets in the room.
      </p>
      <hr class="py-1" />
    </div>
    <div class="flex flex-col gap-4">
      <div class="flex justify-end pr-3">
        <p
          class="text-sm-semibold text-blue/500 cursor-pointer"
          @click="checkAll"
        >
          Check All
        </p>
      </div>
      <div
        v-for="item in checklistData"
        :key="item.id"
        class="flex items-start gap-y-2 gap-x-3"
      >
        <MyCheckBox
          :checked="item.checked"
          @change="() => toggleCheck(item.id)"
          class="pt-1"
        />

        <div class="flex flex-col">
          <p :for="`asset-${item.id}`" class="text-sm-semibold text-gray/600">
            {{ item.assetObj?.asset?.name }}
          </p>
          <div class="w-full">
            <MyTextArea
              placeholder="Enter a description..."
              :maxLength="500"
              v-model="item.remarks"
            />
          </div>
        </div>
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
            handleSubmitFormChecklist({
              uuid,
              checklistData: checklistData,
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
</template>
