<script setup>
import { useRouter } from "vue-router";
import MyButton from "@components/Button/MyButton.vue";
import simplebar from "simplebar-vue";

const router = useRouter();
</script>

<template>
  <simplebar class="h-full" forceVisible="y" autoHide="{false}">
    <div class="bg-white items-center pt-[25dvh]">
      <div class="flex flex-col gap-4 justify-center items-center">
        <p class="display-md-semibold text-gray/900">Oops!!</p>
        <p class="text-md-regular text-gray/600">
            Sorry, the room you scanned is not available
        </p>
        <MyButton
          class="py-2 px-4 rounded-lg"
          color="primary"
          variant="filled"
          size="sm"
          @click="router.push('/scanuser')"
        >
          <p class="text-sm-semibold">Scan again</p>
        </MyButton>
      </div>
    </div>
  </simplebar>
</template>
