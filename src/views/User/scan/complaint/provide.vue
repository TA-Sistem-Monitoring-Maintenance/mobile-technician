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
const asset = ref(null);
const reason = ref("");
const dropzoneRef = ref(null);
const selectedRoom = ref(null);
const selectedLocation = ref(null);

const rooms = ref({});
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
  console.log("detail jalan");
  return Service.detaildata(body)
    .then((response) => {
      detailTask.value = response.data;
      console.log(response);
    })
    .catch(MyToaster);
};
const handleSubmit = async () => {
  if (!asset.value?.id) {
    return MyToaster({ type: "error", message: "Please select an asset" });
  }

  if (!reason.value) {
    return MyToaster({ type: "error", message: "Please provide a reason" });
  }

  const files = dropzoneRef.value?.getFiles?.() || [];
  if (files.length === 0) {
    return MyToaster({ type: "error", message: "Evidence is required" });
  }

  const formData = new FormData();
  formData.append("asset_id", asset.value.id);
  formData.append("room_id", selectedRoom.value?.id || "");
  formData.append("location_id", selectedLocation.value?.id || "");
  formData.append("description", reason.value); // FIXED field name

  for (const file of files) {
    formData.append("evidence", file);
  }

  try {
    const res = await Service.submitComplaint(formData);
    MyToaster({ type: "success", message: "Complaint submitted successfully" });
  } catch (err) {
    console.error("Failed to submit complaint", err);
    MyToaster(
      err?.response?.data || { type: "error", message: "Submit failed" }
    );
  }
};

const searchAsset = async (query) => {
  return Service.searchAsset(query);
};
const checkRoom = async (id, body) => {
  const formData = new FormData();
  formData.append("room_id", body);
  return await Service.checkRoom(id, formData)
    .then((res) => res.data)
    .catch(MyToaster);
};

const deleteRoom = async (data) =>
  await Service.deleteRoom({ ids: data })
    .then(MyToaster)
    .then(getRooms)
    .catch(MyToaster);

watch(
  () => params,
  debounce(() => {
    console.log("Params changed, fetching rooms...", params?.status);
    getRooms();
  }, 500),
  { deep: true }
);

provide("roomsContext", {
  getRooms,
  selectedRoom,
  selectedLocation,
  rooms,
  currentSlider,
  handleCurrentSlider,
  handleSubmit,
  asset,
  reason,
  dropzoneRef,
  createRoom,
  params,
  handleCurrentModal,
  currentModal,
  check,
  searchGrade,
  searchAsset: Service.searchAsset,
  searchCategory: Service.searchCategory,
  downloadTemplateImport,
  deleteRoom,
  checkRoom,
  updateRoom,
  searchRoom,
  searchAsset,
  getDetail,
  detailTask,
  showComplaintRoom: Service.showComplaintRoom,
});
</script>

<template>
  <div>
    <Index />
  </div>
</template>
<!-- 
<template>
  <div>
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template> -->
