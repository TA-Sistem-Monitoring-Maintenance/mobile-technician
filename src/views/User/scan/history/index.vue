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
import { useRouter } from "vue-router";
import {
  Scan,
} from "untitledui-js/vue";

const router = useRouter();
const {
  getTask = () => Promise.resolve(),
  task,
  handleCurrentSlider,
  currentSlider,
  params,
  handleCurrentModal,
  currentModal,
  check,
  deleteTask,
} = inject("taskContext", {});
const tableData = ref([]);

const handleChangePage = async (newPage) => {
  params.page = newPage;
  await getTask();
};

onMounted(async () => {
  console.log("jalan");
  try {
    await getTask();
  } catch (error) {
    console.error("Failed to fetch task:", error);
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
        <p class="text-lg-semibold text-gray/900">History</p>
        <p class="text-sm-regular text-gray/600 pb-2">
          List of complaint history submitted
        </p>
        <hr class="py-1" />
       
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
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
        <MyButton
          class="py-2 px-4 rounded-lg"
          color="primary"
          variant="filled"
          size="sm"
          @click="router.push('/scanuser')"
        >
        <Scan class="w-5 h-5" />
          <p className="text-sm-semibold">Scan</p>
        </MyButton>
      </div>
        <div
          className="w-full rounded-lg border border-gray-light/200 shadow-shadows/shadow-xs"
        >
          <div class="">
            <MyDataTable
              :values="task"
              :onClick="
                (value) => {
                  console.log('Clicked Row:', value);
                  router.push(`/history/detail/${value.id}`);
                }
              "
              @selectionChange="
                (val) => {
                  console.log(check);
                  check = val.data?.filter((e) => e.checked);
                }
              "
              @changePage="handleChangePage"
            >
              <template #header>
                <MyColumn header="Room" />
                <MyColumn header="Name" />
                <MyColumn header="Status" />
              </template>

              <template #body="{ rowData }">
                <MyColumn :rowData="rowData">
                  <p class="text-sm-regular">
                    {{ rowData.asset?.room?.name }}
                    {{ rowData.asset?.room?.location?.name }}
                  </p>
                </MyColumn>
                <MyColumn :rowData="rowData">
                  {{ rowData.asset?.name }}</MyColumn
                >
                <MyColumn :rowData="rowData">
                  <MyChip
                    :label="rowData.status"
                    :color="rowData.status ? 'warning' : 'success'"
                    variant="filled"
                    size="sm"
                    rounded="xl"
                  />
                </MyColumn>
              </template>
            </MyDataTable>
          </div>
        </div>
        <div class="flex">
          <!-- <TaskActions class="bg-white px-8" />
          {{ task.value }} -->

          <!-- Table -->
        </div>
      </div>
    </div>
  </simplebar>
</template>
