<template>
    <div
      class="w-full max-w-[375px] flex flex-col items-start gap-4 bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03),0px_2px_2px_-1px_rgba(10,13,18,0.04)]"
    >
      <!-- Icon and Title Section -->
      <div class="flex flex-col items-start gap-6 p-6 w-full">
        <div class="flex flex-col items-center gap-2 w-full">
          <div class="flex flex-col items-center gap-4 w-full">
            <div
              class="flex justify-center items-center w-14 h-14 rounded-full bg-[#F4EBFF] p-3.5"
            >
              <slot name="icon" />
            </div>
            <div
              class="text-[#6941C6] text-center text-xl font-semibold leading-[30px]"
            >
              <slot name="title">Maintenance</slot>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Details Section -->
      <div class="flex flex-col w-full border-y border-[#E9EAEB]">
        <div
          v-for="(item, index) in details"
          :key="index"
          class="flex justify-between items-center p-4 border-y border-[#E9EAEB]"
        >
          <div class="text-[#181D27] font-medium text-sm">{{ item.label }}</div>
          <div class="text-[#535862] text-sm font-normal">
            {{ item.value || "-" }}
          </div>
        </div>
      </div>
  
      <!-- Action Buttons -->
      <div class="flex flex-col w-full">
        <div class="flex justify-between items-center p-5 gap-4">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    details: {
      type: Array,
      required: true,
    },
  });
  console.log(props);
  </script>
  