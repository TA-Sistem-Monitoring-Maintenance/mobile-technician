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
import { ChevronLeft } from "untitledui-js/vue";
import router from "../../router";
const { showProfile, updateProfile, handleFileUpload, profilePicture } = inject("profileContext", {});
const tableData = ref([]);

const profileData = ref({
  name: "",
  email: "",
  whatsapp: "",
});
onMounted(async () => {
  const response = await showProfile();
  profileData.value = {
    name: response.data.name,
    email: response.data.email,
    whatsapp: response.data.whatsapp,
    role: response.data.role?.name || "Teknisi",
  };
  profilePicture.value = response.data.profilePicture;
});

const handleSave = async () => {
  try {
    await updateProfile(profileData.value);
    alert("Profile berhasil diperbarui.");
  } catch (error) {
    alert("Gagal memperbarui profile.");
  }
};

const triggerFileInput = () => {
  document.getElementById("profile-picture-input").click();
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <simplebar class="h-full" forceVisible="y" autoHide="{false}">
    <div class="bg-white">
      <div class="flex flex-rows gap-3">
        <button
          @click="goBack"
          class="p-1 mr-2 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Kembali ke daftar task"
        >
          <ChevronLeft class="h-6 w-6 text-gray-700" />
        </button>
        <div class="flex flex-col">
          <p class="text-lg-semibold text-gray/900">Profile</p>
          <p class="text-sm-regular text-gray/600 pb-2">
            Update your photo and personal details
          </p>
        </div>
      </div>
      <hr class="py-2" />
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
            <input
              type="file"
              id="profile-picture-input"
              accept="image/*"
              @change="handleFileUpload"
              class="hidden"
            />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900">
              {{ profileData.name }}
            </h2>
            <p class="text-gray-600 mb-6">
              {{ profileData.role ?? "Role None" }}
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
                v-model="profileData.name"
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
                v-model="profileData.email"
              />
            </div>
            <div class="flex flex-col gap-2 mt-4">
              <label
                class="text-sm-medium text-gray/700 after:text-red/600 after:content-['*']"
              >
                Whatsapp
              </label>
              <MyTextField
                id="whatsapp"
                name="whatsapp"
                placeholder="Enter your whatsapp"
                v-model="profileData.whatsapp"
              />
            </div>
            <div class="flex justify-end gap-2 mt-4">
              <MyButton color="secondary" variant="outlined" size="md" @click="goBack">
                <p class="text-sm-semibold">Cancel</p>
              </MyButton>
              <MyButton
                type="button"
                color="primary"
                variant="filled"
                size="md"
                @click="handleSave"
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
