<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useDropzone } from "vue3-dropzone";
import * as XLSX from "xlsx";
import {
  convertToMimeDict,
  formatFileExtensions,
  formatFileSize,
} from "../../../src/services/Helper";
import MyCardFile from "./MyCardFile.vue";
import MyButton from "@components/Button/MyButton.vue";
import { UploadCloud02, CameraPlus, DownloadCloud01 } from "untitledui-js/vue";

const props = defineProps({
  colorBg: String,
  maxSize: Number,
  accept: Array,
  progressUpload: Object,
  multiple: { type: Boolean, default: false },
  onChange: Function,
  onDrop: Function,
  onDropAccepted: Function,
  onDropRejected: Function,
  failedFile: Object,
  errors: String,
  showImage: Boolean,
  isSmallSize: { type: Boolean, default: false },
  type: { type: String, default: "file" },
});

const files = ref([]);
const failedFiles = ref(null);

// Dropzone logic
const handleDrop = (acceptedFiles, rejectedFiles, event) => {
  const newFiles = [...files.value, ...acceptedFiles];
  files.value = newFiles;

  props.onChange?.(newFiles);
  props.onDrop?.(acceptedFiles, rejectedFiles, event);
};

const handleDropAccepted = (acceptedFiles) => {
  props.onDropAccepted?.(acceptedFiles, handleDeleteFile);
};

const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone(
  {
    onDrop: handleDrop,
    onDropAccepted: handleDropAccepted,
    onDropRejected: props.onDropRejected,
    accept: convertToMimeDict(props.accept),
    maxSize: props.maxSize,
    multiple: props.multiple,
  }
);

watch(
  () => props.failedFile,
  (val) => {
    failedFiles.value = val;
  },
  { immediate: true }
);

const handleDeleteFile = (file) => {
  const updated = files.value.filter((f) => f !== file);
  files.value = updated;
  props.onChange?.(updated);
  failedFiles.value = null;
};

const handleDownload = () => {
  const worksheet = XLSX.utils.json_to_sheet(failedFiles.value?.failed || []);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  delete worksheet["!rows"];
  delete worksheet["!cols"];
  workbook.Props = {};
  workbook.Custprops = {};
  XLSX.writeFile(workbook, "downloaded-file.xlsx", { compression: true });
};

const progressList = computed(() => {
  if (files.value.length && props.progressUpload?.progress != null) {
    const maxValue = 1 / files.value.length;
    let progress = props.progressUpload.progress;
    const result = [];

    for (let i = 0; i < files.value.length; i++) {
      if (progress > maxValue) {
        result.push(100);
        progress -= maxValue;
      } else {
        const value = Math.min(progress, maxValue);
        result.push(Math.floor((value / maxValue) * 100));
        progress = 0;
      }
    }

    return result;
  }
  return files.value.map(() => 0);
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-1.5">
      <div
        v-if="props.multiple || files.length === 0"
        v-bind="getRootProps({ class: 'dropzone' })"
      >
        <input v-bind="getInputProps()" />

        <section
          :class="[
            isDragReject
              ? 'cursor-not-allowed border-2 border-error/600'
              : isDragActive
              ? 'cursor-pointer border-2 border-brand/600'
              : 'cursor-pointer border border-gray-light/200',
            'flex w-full flex-col items-center gap-y-3 rounded-xl px-6 py-4',
            props.colorBg,
          ]"
        >
          <div
            class="block w-max rounded-lg border border-gray-light/200 p-2.5 shadow-shadows/shadow-xs"
          >
            <component
              :is="props.type === 'photo' ? CameraPlus : UploadCloud02"
              class="size-5 text-gray-light/700"
              stroke="currentColor"
            />
          </div>
          <div class="flex flex-col items-center gap-1 text-center">
            <div
              :class="
                props.isSmallSize
                  ? 'flex-col'
                  : 'flex' + ' items-center gap-1.5'
              "
            >
              <p
                class="text-sm-semibold"
                :class="isDragReject ? 'text-error/700' : 'text-brand/700'"
              >
                {{
                  props.type === "photo"
                    ? "Ambil Foto *"
                    : "Klik untuk mengunggah"
                }}
              </p>
            </div>
            <p
              class="text-xs-regular text-gray-light/600"
              :class="props.isSmallSize ? 'flex-col' : 'flex gap-1'"
            >
              <template v-if="props.type === 'photo'">
                Ambil foto dari kamera atau galeri
              </template>
              <template v-else>
                <span v-if="props.accept?.length < 10">{{
                  formatFileExtensions(props.accept)
                }}</span>
                <span v-if="props.maxSize"
                  >(max. {{ formatFileSize(props.maxSize) }})</span
                >
              </template>
            </p>
          </div>
        </section>
      </div>

      <p
        v-if="props.errors && files.length === 0"
        class="text-sm-medium text-error/600"
      >
        {{ props.errors }}
      </p>
    </div>

    <!-- Files Preview -->
    <div class="flex flex-col gap-3">
      <MyCardFile
        v-for="(file, i) in files"
        :key="i"
        :file="file"
        :progressUpload="props.progressUpload"
        :progress="progressList[i]"
        :onDeleteFile="() => handleDeleteFile(file)"
        :showImage="props.showImage"
      />
    </div>

    <!-- Failed Summary -->
    <div v-if="failedFiles" class="rounded-lg border border-gray-light/200">
      <div
        class="flex items-start gap-3 rounded-t-lg bg-gray-light/50 px-4 py-4"
      >
        <p class="text-sm-medium flex-1 text-gray-light/900">Total data</p>
        <p class="text-sm-regular text-right text-gray-light/600">
          {{ failedFiles?.success + failedFiles?.failed?.length ?? "-" }}
        </p>
      </div>
      <div class="flex items-start gap-3 px-4 py-4">
        <p class="text-sm-medium flex-1 text-gray-light/900">Success</p>
        <p class="text-sm-regular text-right text-gray-light/600">
          {{ failedFiles?.success ?? "-" }}
        </p>
      </div>
      <div
        class="flex items-start gap-3 rounded-b-lg bg-gray-light/50 px-4 py-4"
      >
        <p class="text-sm-medium flex-1 text-gray-light/900">Failed</p>
        <p class="text-sm-regular text-right text-gray-light/600">
          {{ failedFiles?.failed?.length ?? "-" }}
        </p>
      </div>

      <div
        v-if="failedFiles?.failed?.length"
        class="flex justify-end gap-3 px-1 py-4"
      >
        <MyButton
          @click="handleDownload"
          size="sm"
          color="primary"
          variant="text"
        >
          <div class="flex items-center gap-1.5">
            <DownloadCloud01 stroke="currentColor" />
            <p class="text-sm-semibold">Download failed data</p>
          </div>
        </MyButton>
      </div>
    </div>
  </div>
</template>
