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
import { useRouter, useRoute } from "vue-router";
import MaintenanceCard from "../../../../../components/Card/MaintenanceCardLokal.vue";
import moment from "moment-timezone";
import { defineProps } from "vue";

const props = defineProps({
  steps: {
    type: Array,
    default: () => [
      {
        title: "Complaint Submission",
        description: "Please provide your name and email",
        status: "completed",
      },
      {
        title: "Admin approved",
        description: "A few details about your company",
        status: "completed",
      },
      {
        title: "Being worked on by technician",
        description: "Start collaborating with your team",
        status: "current",
      },
      {
        title: "Finished",
        description: "Share posts to your social accounts",
        status: "pending",
      },
    ],
  },
});

const { params, getDetail, detailTask } = inject("roomsContext", {});
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  console.log("jalan");
  const id = window.location.pathname;
  const parts = id.split("/");
  const uuid = parts[parts.length - 1];
  console.log("jalan", uuid);
  console.log("Detail Task", detailTask?.value);
  try {
    await getDetail(uuid);
    console.log("Detail Task after fetch:", detailTask.value);
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
      value: detailTask?.value?.asset?.room?.name || "-",
    },
    {
      label: "Location",
      value: detailTask?.value?.asset?.room?.location?.name || "-",
    },
    {
      label: "Equipment",
      value: detailTask?.value?.asset?.name || "-",
    },
    {
      label: "Category",
      value: detailTask?.value?.asset?.room?.category?.name || "-",
    },
    {
      label: "Schedule at",
      value:
        moment(detailTask?.value.created_at).format("DD/M/YY HH:mm")
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
      <div class="flex flex-col">
        <div class="flex flex-col w-full p-4 gap-4">
          <!-- Step 1 -->
          <div
            class="flex items-start gap-3 w-full"
            v-for="(step, index) in steps"
            :key="index"
          >
            <div class="flex flex-col items-center gap-1">
              <!-- Completed Step -->
              <div
                v-if="step.status === 'completed'"
                class="flex w-6 h-6 p-1.5 justify-center items-center rounded-full bg-purple-600"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 3L4.5 8.5L2 6"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </div>

              <!-- Current Step -->
              <div v-else-if="step.status === 'current'" class="relative">
                <svg
                  width="32"
                  height="70"
                  viewBox="0 0 32 70"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 32L16 66"
                    stroke="#E9EAEB"
                    stroke-width="2"
                    stroke-linecap="round"
                  ></path>
                  <g filter="url(#filter0_dd_15562_2460)">
                    <rect
                      x="4"
                      y="4"
                      width="24"
                      height="24"
                      rx="12"
                      fill="#7F56D9"
                    ></rect>
                    <circle cx="16" cy="16" r="4" fill="white"></circle>
                  </g>
                  <defs>
                    <filter
                      id="filter0_dd_15562_2460"
                      x="0"
                      y="0"
                      width="32"
                      height="32"
                      filterUnits="userSpaceOnUse"
                      color-interpolation-filters="sRGB"
                    >
                      <feFlood
                        flood-opacity="0"
                        result="BackgroundImageFix"
                      ></feFlood>
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      ></feColorMatrix>
                      <feMorphology
                        radius="4"
                        operator="dilate"
                        in="SourceAlpha"
                        result="effect1_dropShadow_15562_2460"
                      ></feMorphology>
                      <feOffset></feOffset>
                      <feComposite in2="hardAlpha" operator="out"></feComposite>
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.619608 0 0 0 0 0.466667 0 0 0 0 0.929412 0 0 0 1 0"
                      ></feColorMatrix>
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_15562_2460"
                      ></feBlend>
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      ></feColorMatrix>
                      <feMorphology
                        radius="2"
                        operator="dilate"
                        in="SourceAlpha"
                        result="effect2_dropShadow_15562_2460"
                      ></feMorphology>
                      <feOffset></feOffset>
                      <feComposite in2="hardAlpha" operator="out"></feComposite>
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
                      ></feColorMatrix>
                      <feBlend
                        mode="normal"
                        in2="effect1_dropShadow_15562_2460"
                        result="effect2_dropShadow_15562_2460"
                      ></feBlend>
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect2_dropShadow_15562_2460"
                        result="shape"
                      ></feBlend>
                    </filter>
                  </defs>
                </svg>
              </div>

              <!-- Pending Step -->
              <div v-else class="flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.75"
                    y="0.75"
                    width="22.5"
                    height="22.5"
                    rx="11.25"
                    fill="white"
                  ></rect>
                  <rect
                    x="0.75"
                    y="0.75"
                    width="22.5"
                    height="22.5"
                    rx="11.25"
                    stroke="#E9EAEB"
                    stroke-width="1.5"
                  ></rect>
                  <circle cx="12" cy="12" r="4" fill="#D5D7DA"></circle>
                </svg>
              </div>

              <!-- Connector Line (only for non-last items) -->
              <div v-if="index < steps.length - 1 && step.status !== 'current'">
                <svg
                  width="2"
                  height="36"
                  viewBox="0 0 2 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L1 35"
                    stroke="#7F56D9"
                    stroke-width="2"
                    stroke-linecap="round"
                  ></path>
                </svg>
              </div>
            </div>

            <div
              class="flex flex-col py-0.5 pb-6 flex-1"
              :class="{ 'pb-0': index === steps.length - 1 }"
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
