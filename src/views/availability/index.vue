<script setup>
import { inject, onMounted } from "vue";
import { useForm, useFieldArray } from "vee-validate";
import MyDatePicker from "@components/DatePicker/MyDatePicker.vue";
import { Plus } from "untitledui-js/vue";
import MyButton from "@components/Button/MyButton.vue";

const { createAvailability, getAvability } = inject("availability", {});

// 1) Buat form dengan initial array
const { values, handleSubmit, isSubmitting } = useForm({
  initialValues: { availabilities: [{ startDate: null, endDate: null }] },
});

// 2) FieldArray untuk manipulasi array, sekarang termasuk `remove`
const {
  fields: availabilities,
  push,
  replace,
  remove,
} = useFieldArray("availabilities");

function addNewAvailability() {
  push({ startDate: null, endDate: null });
}

const onSubmit = handleSubmit(createAvailability);

onMounted(async () => {
  try {
    const response = await getAvability();
    if (response?.data?.length) {
      const mapped = response.data.map((item) => ({
        startDate: item.start_time ? new Date(item.start_time) : null,
        endDate: item.end_time ? new Date(item.end_time) : null,
      }));
      replace(mapped);
    }
  } catch (error) {
    console.error("Failed to fetch approvals:", error);
  }
});
</script>

<template>
  <form @submit.prevent="onSubmit" class="min-h-dvh flex flex-col bg-white">
    <div class="flex-grow pb-3 gap-3">
      <p class="text-lg-semibold text-gray/900">Technician Availability</p>
      <p class="text-sm-regular text-gray/600 pb-2">
        Set your availability in form.
      </p>
      <hr class="py-1" />

      <div class="flex flex-col gap-3">
        <template v-for="(field, idx) in availabilities" :key="field.key">
          <!-- header with delete button -->
          <div class="flex justify-between items-center">
            <p class="text-md-semibold text-gray/900">
              Availability {{ idx + 1 }}
            </p>
            <button
              type="button"
              @click="remove(idx)"
              class="text-error/500 text-sm-semibold"
            >
              <p class="text-error/500">Delete</p>
            </button>
          </div>

          <!-- date pickers -->
          <div class="flex flex-col gap-1">
            <p class="text-sm-regular text-gray/600">Start date and time</p>
            <MyDatePicker
              v-model="field.value.startDate"
              :teleport="true"
              allow-prevent-default
              allow-stop-propagation
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-sm-regular text-gray/600">End date and time</p>
            <MyDatePicker
              v-model="field.value.endDate"
              :teleport="true"
              allow-prevent-default
              allow-stop-propagation
            />
          </div>
          <hr />
        </template>

        <div
          class="flex flex-row justify-end items-center gap-1 text-blue/500 cursor-pointer"
          @click="addNewAvailability"
        >
          <Plus color="currentColor" size="20" />
          <p class="text-blue/500 text-sm-semibold">Add new</p>
        </div>
      </div>
    </div>

    <footer
      class="flex-none flex items-center justify-end gap-4 border-t border-gray-light/200 px-4 py-4"
    >
      <MyButton
        type="submit"
        color="primary"
        variant="filled"
        size="md"
        :disabled="isSubmitting"
      >
        <p class="text-sm-semibold">Submit</p>
      </MyButton>
    </footer>
  </form>
</template>
