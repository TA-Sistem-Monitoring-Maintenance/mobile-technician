<script setup>
import { provide, ref, computed, onMounted, watch, reactive } from "vue";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useRouter } from "vue-router";
import VueCookies from "vue-cookies";
import Index from "./index.vue";
import { debounce } from "lodash";
import { Service } from "./service";
import MyToaster from "@components/Toaster/MyToaster";

const task = ref({});
const currentSlider = ref({
  current: "",
  status: false,
});

const currentModal = ref({
  current: "",
  status: false,
});

const check = ref();

const params = reactive({
  search: "",
  status: "all",
  filter: [],
  meta: [],
});

const gradeList = Array.from({ length: 11 }, (_, i) => i.toString());
const searchGrade = async ({ search }) => ({
  data: gradeList.filter((element) => element.includes(search)),
});

const router = useRouter();
const base_url = import.meta.env.VITE_APP_BASE_URL;
console.log(base_url);

async function getTask() {
  try {
    const response = await Service.getTask(params);
    task.value = response;
    console.log(response);
    return response; // Return response to be used in provide.vue
  } catch (error) {
    console.error("Error fetching task:", error);
  }
}

const handleCurrentSlider = (slider, id = null) => {
  if (slider && slider.current) {
    currentSlider.value = { status: true, current: slider.current, id };
  } else {
    currentSlider.value = { ...currentSlider.value, current: null };
    setTimeout(() => {
      currentSlider.value = { status: false, current: null, id: null };
    }, 200);
  }
};

const handleCurrentModal = (modal, id = null) => {
  if (modal && modal.current) {
    currentModal.value = { status: true, current: modal.current, id };
  } else {
    currentModal.value = { ...currentModal.value, current: null };
    setTimeout(() => {
      currentModal.value = { status: false, current: null, id: null };
    }, 200);
  }
};

async function createTask(body) {
  try {
    const formData = new FormData();
    formData.append("name", body.name);
    formData.append("location_id", body.location.id);
    formData.append("category_id", body.category.id);
    formData.append(
      "deleted_at",
      body?.isActive === false ? new Date().toISOString() : ""
    );

    await Service.createTask(formData, "form-data")
      .then(MyToaster)
      .then(() => handleCurrentSlider({ status: false, current: null }))
      .then(getTask)
      .catch(MyToaster);
  } catch (error) {
    console.error("Error creating Task:", error);
  }
}

async function updateTask(body) {
  try {
    const formData = new FormData();
    formData.append("name", body.name);
    formData.append("location_id", body.location.id);
    formData.append("category_id", body.category.id);
    formData.append(
      "deleted_at",
      body?.isActive === false ? new Date().toISOString() : ""
    );

    await Service.updateTask(formData, "form-data")
      .then(MyToaster)
      .then(() => handleCurrentSlider({ status: false, current: null }))
      .then(getTask)
      .catch(MyToaster);
  } catch (error) {
    console.error("Error creating Task:", error);
  }
}

const searchTask = async (query) => {
  console.log("query", query);
  return Service.searchTask(query);
};
const downloadTemplateImport = () => {
  console.log("downloadTemplateImport");
  return Service.downloadTemplateImport();
};

const importTask = async (data) => {
  const formData = new FormData();
  console.log(data);
  console.log("import jalan", data);
  data.forEach((e) => {
    formData.append("task", e);
  });
  return Service.importTask(formData)
    .then(MyToaster)
    .then(getTask)
    .then(handleCurrentSlider(null))
    .catch(MyToaster);
};

const showTask = async (id) =>
  await Service.showTask(id)
    .then((res) => res.data)
    .catch(MyToaster);

const deleteTask = async (data) =>
  await Service.deleteTask({ ids: data })
    .then(MyToaster)
    .then(getTask)
    .catch(MyToaster);

watch(
  () => params,
  debounce(() => {
    console.log("Params changed, fetching task...", params?.status);
    getTask();
  }, 500),
  { deep: true }
);

provide("taskContext", {
  getTask,
  task,
  currentSlider,
  handleCurrentSlider,
  createTask,
  params,
  handleCurrentModal,
  currentModal,
  check,
  searchGrade,
  searchTask,
  searchLocation: Service.searchLocation,
  searchCategory: Service.searchCategory,
  downloadTemplateImport,
  importTask,
  deleteTask,
  showTask,
  updateTask,
});
</script>

<template>
  <div>
    <Index />
  </div>
</template>
