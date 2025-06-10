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

import simplebar from "simplebar-vue";
import { SearchLg, Trash01 } from "untitledui-js/vue";
import MyButtonGroupV3 from "@components/Button/MyButtonGroupV3.vue";
import MyButtonGroupV2 from "@components/Button/MyButtonGroupV2.vue";
// import DetailSlider from "./sliders/detailSlider.vue";
// import importSlider from "./sliders/importSlider.vue";
import { FilterLines } from "untitledui-js/vue";
import { useRouter } from "vue-router";

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
} = inject("technicianContext", {});
const tableData = ref([]);

const handleChangePage = async (newPage) => {
  params.page = newPage;
  await getRooms();
};

onMounted(async () => {
  try {
    await getRooms();
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
  }
});

watchEffect(() => {
  console.log("Current Modal State:", currentModal.value);
});
const router = useRouter();
</script>

<template>
  <div class="bg-white">
    <div class="pb-3 gap-3">
      <p class="text-lg-semibold text-gray/900">Task Maintenance</p>
      <p class="text-sm-regular text-gray/600 pb-2">
        Task list for technicians to work on
      </p>
      <hr class="py-1" />
    </div>
    <div class="flex flex-col gap-4">
      <MyTextField
        id="name"
        name="name"
        placeholder="Search"
        v-model="params.search"
        :onChangeForm="
          debounce((event) => (params.search = event.target.value), 500)
        "
      >
        <template #startAdornment>
          <div class="text-gray/600">
            <SearchLg color="currentColor" class="size-5 text-gray/600" />
          </div> </template
      ></MyTextField>
      <div
        className="w-full rounded-lg border border-gray-light/200 shadow-shadows/shadow-xs"
      >
        <div class="">
          <MyDataTable
            :values="rooms"
            :onClick="
              (value) => {
                router.push(`/task/${value?.data?.id}`);
              }
            "
            @selectionChange="
              (val) => {
                check = val.data?.filter((e) => e.checked);
              }
            "
            @changePage="handleChangePage"
          >
            <template #header>
              <MyColumn field="nama" header="Name equipment" />
              <MyColumn header="Location" />
              <MyColumn field="status" header="Status" />
            </template>

            <template #body="{ rowData }">
              <!-- Jika tipe ticket_pending -->
              <template v-if="rowData.type === 'ticket_pending'">
                <MyColumn :rowData="rowData" field="nama">
                  <p class="text-sm-regular text-gray/600">
                    {{ rowData.data.asset?.name }}
                  </p>
                </MyColumn>
                <MyColumn :rowData="rowData" field="location">
                  <p class="text-sm-regular text-gray/600">
                    {{ rowData.data.asset?.room?.location?.name }}
                    {{ rowData.data.asset?.room?.name }}
                  </p>
                </MyColumn>
                <MyColumn :rowData="rowData" field="status">
                  <MyChip
                    :label="rowData.data.status"
                    :color="rowData.data.status ? 'warning' : 'success'"
                    variant="filled"
                    size="sm"
                    rounded="xl"
                  />
                </MyColumn>
              </template>

              <!-- Jika tipe task -->
              <template v-else-if="rowData.type === 'task'">
                <MyColumn :rowData="rowData" field="id">
                  <p class="text-sm-regular text-gray/600">
                    {{ rowData.data.ticket?.asset?.name }}
                  </p></MyColumn
                >
                <MyColumn :rowData="rowData" field="location">
                  <p class="text-sm-regular text-gray/600">
                    {{ rowData.data.ticket?.asset?.room?.location?.name }}
                    {{ rowData.data.ticket?.asset?.room?.name }}
                  </p>
                </MyColumn>
                <MyColumn :rowData="rowData" field="status">
                  <MyChip
                    :label="rowData.data.status"
                    :color="
                      rowData.data.status === 'scheduled'
                        ? 'warning'
                        : 'success'
                    "
                    variant="filled"
                    size="sm"
                    rounded="xl"
                  />
                </MyColumn>
              </template>
            </template>
          </MyDataTable>
        </div>
      </div>
      <div class="flex">
        <!-- <RoomActions class="bg-white px-8" />
          {{ rooms.value }} -->

        <!-- Table -->
      </div>
    </div>
  </div>
</template>
