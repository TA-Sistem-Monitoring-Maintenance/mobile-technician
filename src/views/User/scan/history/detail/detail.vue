<script setup>
import MyDataTable from "@components/Table/MyDataTable.vue";
import MyColumn from "@components/Table/MyColumn.vue";
import axios from "axios";
import { onMounted, inject, ref, watch, computed } from "vue";
import MyButton from "@components/Button/MyButton.vue";
import { mdiMagnify, mdiPlus, mdiUpload } from "@mdi/js";
import MyTextField from "@components/TextField/MyTextField.vue";
import MyModalSlider from "@components/Slider/MyModalSlider.vue";
import { debounce } from "lodash";
import MyModal from "@components/Modal/MyModal.vue";
import { watchEffect } from "vue";
import MyChip from "@components/Chip/MyChip.vue";
import simplebar from "simplebar-vue";
import { ChevronLeft, SearchLg, Trash01, FilterLines } from "untitledui-js/vue";
import MyButtonGroupV3 from "@components/Button/MyButtonGroupV3.vue";
import MyButtonGroupV2 from "@components/Button/MyButtonGroupV2.vue";
import { useRouter, useRoute } from "vue-router";
import MaintenanceCard from "@components/Slider/MaintenanceSliderCard.vue";
import moment from "moment-timezone";
import { defineProps } from "vue";

const dynamicSteps = computed(() => {
  const statusRaw = detailTask?.value?.status || "";
  const status = statusRaw.toLowerCase();

  const approvalReason = detailTask?.value?.approval_reason || "";

  const allSteps = {
    pending: {
      title: "Pending",
      description: "Waiting for admin approval",
    },
    adminRejected: {
      title: "Rejected",
      description: approvalReason || "Task rejected",
    },
    waitingTechnician: {
      title: "Waiting Technician Approval",
      description: "Approved by admin, waiting technician",
    },
    reschedule: {
      title: "Reschedule Required",
      description: "Technician requested a reschedule",
    },
    scheduled: {
      title: "Scheduled",
      description: "Task scheduled for technician",
    },
    completed: {
      title: "Completed / Verified",
      description: "Maintenance task completed and verified",
    },
  };

  const steps = [];

  // Step always starts with Pending
  steps.push({
    ...allSteps.pending,
    status: status === "pending" ? "current" : "completed",
  });

  if (status === "rejected") {
    steps.push({
      ...allSteps.adminRejected,
      status: "current",
    });
    return steps;
  }

  if (
    status === "waiting technician approval" ||
    status === "reschedule required" ||
    status === "scheduled" ||
    status === "completed / verified"
  ) {
    steps.push({
      ...allSteps.waitingTechnician,
      status:
        status === "waiting technician approval" ? "current" : "completed",
    });
  }

  // Tampilkan Reschedule Required hanya jika statusnya memang itu
  if (status === "reschedule required") {
    steps.push({
      ...allSteps.reschedule,
      status: "current",
    });
    return steps;
  }

  if (status === "scheduled" || status === "completed / verified") {
    steps.push({
      ...allSteps.scheduled,
      status: status === "scheduled" ? "current" : "completed",
    });
  }

  if (status === "completed / verified") {
    steps.push({
      ...allSteps.completed,
      status: "current",
    });
  }

  return steps;
});

const { params, getDetail, detailTask } = inject("roomsContext", {});
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  const id = window.location.pathname;
  const parts = id.split("/");
  const uuid = parts[parts.length - 1];
  try {
    await getDetail(uuid);
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
      value:
        detailTask?.value?.asset?.room?.name ||
        detailTask?.value?.ticket?.asset?.room?.name ||
        "-",
    },
    {
      label: "Location",
      value:
        detailTask?.value?.asset?.room?.location?.name ||
        detailTask?.value?.ticket?.asset?.room?.location?.name ||
        "-",
    },
    {
      label: "Equipment",
      value:
        detailTask?.value?.asset?.name ||
        detailTask?.value?.ticket?.asset?.name ||
        "-",
    },
    {
      label: "Description",
      value:
        detailTask?.value?.description ||
        detailTask?.ticket?.histories?.reason ||
        "-",
    },
    {
      label: "Category",
      value:
        detailTask?.value?.asset?.room?.category?.name ||
        detailTask?.value?.ticket?.asset?.room?.category?.name ||
        "-",
    },
    {
      label: "Created at",
      value: moment(detailTask?.value.created_at).format("DD/M/YY HH:mm"),
    },
    { label: "Evidence", value: detailTask?.value.attachments || "-" },
  ];
});
// Setelah data detailTask sudah siap, misalnya setelah fetch selesai:
watch(
  () => detailTask.value,
  (newVal) => {
    console.log("detailTask:", newVal);
  },
  { immediate: true }
);

watch(
  () => taskDetail.value,
  (newVal) => {
    console.log("taskDetail:", newVal);
  },
  { immediate: true }
);
</script>

<template>
  <div class="bg-white">
    <div class="pb-3 gap-3">
      <div class="flex flex-rows gap-3">
        <button
          @click="router.go(-1)"
          class="p-1 mr-2 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
      <div class="flex flex-col">
        <div class="flex flex-col w-full p-4 gap-4">
          <div
            class="flex items-start gap-3 w-full"
            v-for="(step, index) in dynamicSteps"
            :key="index"
          >
            <!-- Step Icon & Line -->
            <div class="flex flex-col items-center gap-1">
              <div
                v-if="step.status === 'completed'"
                class="flex w-6 h-6 p-1.5 justify-center items-center rounded-full bg-purple-600"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M10 3L4.5 8.5L2 6"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div v-else-if="step.status === 'current'" class="relative">
                <svg width="32" height="70" viewBox="0 0 32 70" fill="none">
                  <path
                    d="M16 32L16 66"
                    stroke="#E9EAEB"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <g filter="url(#filter0_dd)">
                    <rect
                      x="4"
                      y="4"
                      width="24"
                      height="24"
                      rx="12"
                      fill="#7F56D9"
                    />
                    <circle cx="16" cy="16" r="4" fill="white" />
                  </g>
                  <defs>
                    <filter
                      id="filter0_dd"
                      x="0"
                      y="0"
                      width="32"
                      height="32"
                      filterUnits="userSpaceOnUse"
                    >
                      <feMorphology
                        radius="4"
                        operator="dilate"
                        in="SourceAlpha"
                        result="effect1_dropShadow"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0.619 0 0 0 0 0.467 0 0 0 0 0.929 0 0 0 1 0"
                      />
                      <feBlend
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow"
                      />
                    </filter>
                  </defs>
                </svg>
              </div>
              <div v-else class="flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="11.25"
                    fill="white"
                    stroke="#E9EAEB"
                    stroke-width="1.5"
                  />
                  <circle cx="12" cy="12" r="4" fill="#D5D7DA" />
                </svg>
              </div>
              <div
                v-if="
                  index < dynamicSteps.length - 1 && step.status !== 'current'
                "
              >
                <svg width="2" height="36" viewBox="0 0 2 36" fill="none">
                  <path
                    d="M1 1L1 35"
                    stroke="#7F56D9"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
            </div>

            <!-- Step Text -->
            <div
              class="flex flex-col py-0.5 pb-6 flex-1"
              :class="{ 'pb-0': index === dynamicSteps.length - 1 }"
            >
              <div
                class="text-sm font-bold leading-5"
                :class="{
                  'text-gray-700': step.status !== 'current',
                  'text-purple-700': step.status === 'current',
                }"
              >
                {{ step.title }}
              </div>
              <div
                class="text-sm font-normal leading-5"
                :class="{
                  'text-gray-600': step.status !== 'current',
                  'text-purple-600': step.status === 'current',
                }"
              >
                {{ step.description }}
              </div>
            </div>
          </div>
        </div>

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
          <!-- contoh render detail list -->
          <template v-slot:default>
            <div
              v-for="(item, index) in taskDetail"
              :key="index"
              class="detail-row"
            >
              <strong>{{ item.label }}:</strong>
              <span v-if="item.isImage">
                <img
                  :src="item.value"
                  alt="Evidence Photo"
                  style="
                    max-width: 200px;
                    max-height: 150px;
                    object-fit: contain;
                  "
                />
              </span>
              <span v-else>
                {{ item.value }}
              </span>
            </div>
          </template>
        </MaintenanceCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
}
</style>
