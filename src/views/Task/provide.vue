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
import TaskDetail from "./TaskDetail.vue";

const rooms = ref({});
const currentSlider = ref({
  current: "",
  status: false,
});

const id = window.location.pathname;
const parts = id.split("/");
const uuid = parts[parts.length - 1];

const currentModal = ref({
  current: "",
  status: false,
});
const dropzoneRef = ref(null);

const check = ref();

const params = reactive({
  search: "",
  status: "all",
  filter: [],
  meta: [],
});
var detailTask = ref({});

const gradeList = Array.from({ length: 11 }, (_, i) => i.toString());
const searchGrade = async ({ search }) => ({
  data: gradeList.filter((element) => element.includes(search)),
});

const router = useRouter();
const base_url = import.meta.env.VITE_APP_BASE_URL;
console.log(base_url);

async function getRooms() {
  try {
    const response = await Service.getRooms(params);
    rooms.value = response;
    console.log(response);
    return response; // Return response to be used in provide.vue
  } catch (error) {
    console.error("Error fetching rooms:", error);
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

async function createRoom(body) {
  try {
    const formData = new FormData();
    formData.append("name", body.name);
    formData.append("location_id", body.location.id);
    formData.append("category_id", body.category.id);
    formData.append(
      "deleted_at",
      body?.isActive === false ? new Date().toISOString() : ""
    );

    await Service.createRoom(formData, "form-data")
      .then(MyToaster)
      .then(() => handleCurrentSlider({ status: false, current: null }))
      .then(getRooms)
      .catch(MyToaster);
  } catch (error) {
    console.error("Error creating room:", error);
  }
}

async function updateRoom(body) {
  try {
    const formData = new FormData();
    formData.append("name", body.name);
    formData.append("location_id", body.location.id);
    formData.append("category_id", body.category.id);
    formData.append(
      "deleted_at",
      body?.isActive === false ? new Date().toISOString() : ""
    );

    await Service.updateRoom(formData, "form-data")
      .then(MyToaster)
      .then(() => handleCurrentSlider({ status: false, current: null }))
      .then(getRooms)
      .catch(MyToaster);
  } catch (error) {
    console.error("Error creating room:", error);
  }
}

const searchRoom = async (query) => {
  console.log("query", query);
  return Service.searchRoom(query);
};
const downloadTemplateImport = () => {
  console.log("downloadTemplateImport");
  return Service.downloadTemplateImport();
};

const getDetail = async (body) => {
  return Service.detaildata(body)
    .then((response) => {
      detailTask.value = response.data;
      console.log(response);
    })
    .catch(MyToaster);
};

const getAllAssets = async (id) => {
  return Service.getAllAssets(id)
    .then((response) => {
      return response;
    })
    .catch(MyToaster);
};

const declineMaintenance = async (id, reason) => {
  const formData = new FormData();
  formData.append("reason", reason);
  formData.append("approved", false);
  try {
    const response = await Service.approveMaintenance(id, formData);
    MyToaster({ type: "success", message: "Task declined successfully" });
    handleCurrentSlider({ status: false, current: null });
    return response;
  } catch (error) {
    MyToaster({ type: "error", message: "Failed to decline task" });
    throw error;
  }
};

const checkRoom = async (id, body) => {
  const formData = new FormData();
  formData.append("room_id", body);
  return await Service.checkRoom(id, formData)
    .then((res) => res)
    .catch(MyToaster);
};

const deleteRoom = async (data) =>
  await Service.deleteRoom({ ids: data })
    .then(MyToaster)
    .then(getRooms)
    .catch(MyToaster);

const approveMaintenance = async (id) => {
  const formData = new FormData();
  formData.append("approved", true);
  const response = Service.approveMaintenance(id, formData)
    .then(MyToaster)
    .then(getDetail(uuid))
    .catch(MyToaster);
  // if(response)
  return response;
};

const handleSubmitForm = async (body) => {
  console.log(body);
  if (!body?.description) {
    return MyToaster({ type: "error", message: "Please select an asset" });
  }

  const files = body?.selectedImages || [];
  if (files.length === 0) {
    return MyToaster({ type: "error", message: "Evidence is required" });
  }

  const formData = new FormData();
  formData.append("asset_id", body?.selectedAsset.id);

  formData.append("description", body?.description);

  for (const file of files) {
    formData.append("evidence", file);
  }

  try {
    const res = await Service.submitForm(body?.uuid, formData);
    MyToaster({ type: "success", message: "Complaint submitted successfully" });
    router.push("/task");
  } catch (err) {
    console.error("Failed to submit complaint", err);
    MyToaster(
      err?.response?.data || { type: "error", message: "Submit failed" }
    );
  }
};

const handleSubmitFormChecklist = async (body) => {
  console.log(body);
};

watch(
  () => params,
  debounce(() => {
    console.log("Params changed, fetching rooms...", params?.status);
    getRooms();
  }, 500),
  { deep: true }
);

provide("technicianContext", {
  getRooms,
  rooms,
  currentSlider,
  handleCurrentSlider,
  createRoom,
  params,
  handleCurrentModal,
  currentModal,
  check,
  handleSubmitFormChecklist,
  getAllAssets,
  searchGrade,
  searchRoom,
  dropzoneRef,
  searchLocation: Service.searchLocation,
  searchCategory: Service.searchCategory,
  downloadTemplateImport,
  approveMaintenance,
  deleteRoom,
  checkRoom,
  updateRoom,
  getDetail,
  detailTask,
  handleSubmitForm,
  declineMaintenance,
});
</script>

<!-- <template>
  <div>
    <Index />
  </div>
</template> -->

<template>
  <div>
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>
