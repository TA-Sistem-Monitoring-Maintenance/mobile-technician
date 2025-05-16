<script setup>
import { ref, watch, onMounted } from "vue";
import { formatFileSize } from "../../../src/services/Helper";
import MyButton from "@components/Button/MyButton.vue";
import { LinkExternal02, Trash01 } from "untitledui-js/vue";
import JpegDefault from "@components/Icon/JpegDefault.vue";
import PngDefault from "@components/Icon/PngDefault.vue";
import GifDefault from "@components/Icon/GifDefault.vue";
import XlsxDefault from "@components/Icon/XlsxDefault.vue";
import XlsDefault from "@components/Icon/XlsDefault.vue";
import FileDefault from "@components/Icon/FileDefault.vue";

const props = defineProps({
  progressUpload: Object,
  file: Object,
  onDeleteFile: Function,
  progress: { type: Number, default: 0 },
  showImage: { type: Boolean, default: true },
  onClickDownload: { type: Boolean, default: false },
});

const blob = ref(null);
const blob2 = ref(null);

const getIconExtension = () => {
  const fileType = props.file.type || props.file.mime_type;
  switch (fileType) {
    case "image/jpeg":
      return JpegDefault;
    case "image/png":
      return PngDefault;
    case "image/gif":
      return GifDefault;
    // case "application/pdf":
    //   return PdfDefault;
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return XlsxDefault;
    case "application/vnd.ms-excel":
      return XlsDefault;
    // case "text/csv":
    //   return CsvDefault;
    default:
      return FileDefault;
  }
};

const loadPreview = () => {
  const file = props.file;
  if (!file || !file.type) return;

  if (["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
    const reader = new FileReader();
    reader.onload = () => {
      const data = new Blob([reader.result], { type: file.type });
      const url = URL.createObjectURL(data);
      blob.value = url;

      const readerBase64 = new FileReader();
      readerBase64.onload = () => {
        blob2.value = readerBase64.result;
      };
      readerBase64.readAsDataURL(data);
    };
    reader.readAsArrayBuffer(file);
  }
};

watch(() => props.file, loadPreview, { immediate: true });

const handleClickPreview = () => {
  if (blob2.value) {
    const byteCharacters = atob(blob2.value.split(",")[1]);
    const byteNumbers = Array.from(byteCharacters, (c) => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const newBlob = new Blob([byteArray], { type: props.file.type });
    const url = URL.createObjectURL(newBlob);
    window.open(url);
  }
};
</script>

<template>
  <section
    class="relative w-full overflow-hidden rounded-lg border border-gray-light/200 p-4"
  >
    <div
      class="flex w-full cursor-pointer items-start gap-3"
      @click="handleClickPreview"
    >
      <div class="h-10 min-h-[40px] w-10 min-w-[40px]">
        <component :is="getIconExtension()" :size="40" />
      </div>
      <div class="flex flex-1 flex-col gap-1 overflow-hidden">
        <div class="flex flex-col overflow-hidden pr-8">
          <p class="text-sm-medium line-clamp-1 break-all text-gray-light/700">
            {{ file.name || file.filename }}
          </p>
          <p class="text-sm-regular text-gray-light/600">
            {{ formatFileSize(file.size) }}
          </p>
        </div>

        <div
          class="flex items-center gap-3"
          :class="{ invisible: progress === null }"
        >
          <div class="flex-1">
            <div
              :class="[
                'h-2 rounded-full duration-300',
                progressUpload?.import ? 'bg-success/600' : 'bg-brand/600',
              ]"
              :style="{ width: `${progress}%` }"
            />
          </div>
          <p v-if="file.type" class="text-sm-medium text-gray-light/700">
            {{ progress }}%
          </p>
        </div>

        <div
          v-if="showImage && blob"
          class="flex w-full items-center justify-center overflow-hidden rounded-lg"
        >
          <img class="h-full w-full object-contain" :src="blob" alt="" />
        </div>
      </div>
    </div>

    <div class="absolute right-2 top-2">
      <MyButton
        v-if="onClickDownload && file?.full_url"
        :disabled="progress < 100 && progress > 0"
        @click="() => window.open(file.full_url, '_blank')"
        color="gray"
        variant="text"
        size="md"
      >
        <LinkExternal02 class="size-5 text-brand/600" stroke="currentColor" />
      </MyButton>

      <MyButton
        v-else
        :disabled="progress < 100 && progress > 0"
        @click="onDeleteFile"
        color="gray"
        variant="text"
        size="md"
      >
        <Trash01 class="size-5 text-gray-light/600" stroke="currentColor" />
      </MyButton>
    </div>
  </section>
</template>
