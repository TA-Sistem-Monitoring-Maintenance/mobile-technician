<script setup>
import MyDataTable from "@components/Table/MyDataTable.vue";
import MyColumn from "@components/Table/MyColumn.vue";
import axios from "axios";
import { onMounted, inject, ref, watch, computed } from "vue";
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
import { useRouter } from "vue-router";
// import MaintenanceCard from "@components/Slider/MaintenanceSliderCard.vue";
import moment from "moment-timezone";

const { params, getDetail, detailTask } = inject("roomsContext", {});
const tableData = ref([]);
const router = useRouter();

onMounted(async () => {
  console.log("jalan");
  const id = window.location.pathname;
  const parts = id.split("/");
  const uuid = parts[parts.length - 1];
  console.log("jalan", uuid);
  try {
    await getDetail(uuid);
    console.log(detailTask?.value);
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
  }
});

const taskDetail = computed(() => {
  return [
    { label: "ID", value: detailTask?.value.id || "-" },
    { label: "Status", value: detailTask?.value.status || "-" },
    {
      label: "Room",
      value: detailTask?.value?.ticket?.asset?.room?.name || "-",
    },
    {
      label: "Location",
      value: detailTask?.value.ticket?.asset?.room?.location?.name || "-",
    },
    {
      label: "Equipment",
      value: detailTask?.value?.ticket?.asset?.name || "-",
    },
    { label: "Category", value: detailTask?.value?.ticket?.type || "-" },
    {
      label: "Schedule at",
      value:
        moment(detailTask?.value.schedule?.start_time).format("DD/M/YY HH:mm") +
        " - " +
        moment(detailTask?.value.schedule?.end_time).format("DD/M/YY HH:mm"),
    },
  ];
});

watchEffect(() => {});
</script>

<template>
  <div class="bg-white">
    <div class="pb-3 gap-3">
      <div class="flex flex-rows gap-3">
        <button
          @click="router.go(-1)"
          class="p-1 mr-2 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Kembali ke daftar task"
        >
          <ChevronLeft class="h-6 w-6 text-gray-700" />
        </button>
        <div class="flex flex-col">
          <p class="text-lg-semibold text-gray/900">#3966</p>
          <p class="text-sm-regular text-gray/600 pb-2">
            Task detail for technician
          </p>
        </div>
      </div>
      <hr class="py-1" />
      <div class="flex justify-center">
        <MaintenanceCard :details="taskDetail">
          <template #icon>
            <svg
              class="w-7 h-7"
              viewBox="0 0 29 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="14"
                cy="14"
                r="12"
                stroke="#7F56D9"
                stroke-width="2"
              />
              <path
                d="M10 14L14 18L18 10"
                stroke="#7F56D9"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </template>

          <template #title> Maintenance </template>

          <template #actions>
            <MyButton
              color="primary"
              variant="filled"
              class="flex justify-start"
              @click="isModalOpen = true"
            >
              <p class="text-md-semibold">Decline</p>
            </MyButton>
            <MyButton
              color="success"
              variant="filled"
              class="flex justify-end"
              @click="handleApproveSubmit"
            >
              <p class="text-md-semibold">Approve</p>
            </MyButton>
          </template>
        </MaintenanceCard>
      </div>
    </div>
  </div>
</template>
