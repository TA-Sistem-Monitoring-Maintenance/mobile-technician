<script setup>
import { computed, inject, ref } from "vue";
import { useRouter } from "vue-router";
import MyButton from "@components/Button/MyButton.vue";
import MyTextField from "@components/TextField/MyTextField.vue";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  Key01,
  Lock01,
  Mail01,
} from "untitledui-js/vue";
import { forgotPasswordSchema } from "./schema";

import OtpInput from "@components/TextField/OtpInput.vue";

const { sendOtp, step, checkOtp, resetPassword } = inject("forgotPassword", {});

const email = ref("");
const errorMessage = ref("");
const isLoading = ref(false);
const otp = ref("");
const new_password = ref("");
const confirm_password = ref("");
const router = useRouter();
console.log(confirm_password);

const isLongEnough = computed(() => new_password.value.length >= 8);
const hasSpecialChar = computed(() => /[^A-Za-z0-9]/.test(new_password.value));
const passwordsMatch = computed(
  () =>
    new_password.value.length > 0 &&
    confirm_password.value.length > 0 &&
    new_password.value === confirm_password.value
);

const allValid = computed(
  () => isLongEnough.value && hasSpecialChar.value && passwordsMatch.value
);
function handleOtp(code) {
  otp.value = code;
  console.log("OTP Code:", otp.value);
  checkOtp({ otp: otp.value });
}
function handleResetPassword(body) {
  resetPassword({ password: new_password.value });
}

const onSubmit = async () => {
  errorMessage.value = ""; // Reset pesan error
  isLoading.value = true; // Tampilkan spinner loading

  try {
    await forgotPasswordSchema.validate({ email: email.value });
    await sendOtp({ email: email.value });
  } catch (error) {
    errorMessage.value = error.message || "An error occurred.";
  } finally {
    isLoading.value = false; // Hentikan spinner loading
  }
};
</script>

<template>
  <main class="flex h-screen">
    <!-- Bagian Kiri -->
    <section
      v-if="step === 1"
      class="w-full bg-white flex flex-col justify-center items-center p-8 md:p-12"
    >
      <div class="items-center justify-center flex flex-col gap-4">
        <!-- Replace //key01 with Key01 component -->
        <!-- <Activity class="mb-4" /> -->
        <div class="border border-gray/200 rounded-xl">
          <div class="p-4 text-gray/700 text-md-regular">
            <key01 :size="34" color="currentColor" />
          </div>
        </div>

        <h1 class="text-2xl font-bold text-gray/700 mb-2">Forgot Password?</h1>
        <p class="text-gray/500">
          No worries, we'll send you reset instructions.
        </p>
      </div>
      <form
        @submit.prevent="onSubmit"
        class="mt-8 w-full max-w-sm flex flex-col gap-6"
      >
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray/700 pb-2"
          >
            Email
          </label>
          <MyTextField
            type="text"
            id="email"
            v-model="email"
            :error-message="errorMessage"
            placeholder="Enter your email address"
          />
        </div>

        <div class="flex flex-col gap-4 justify-center items-center">
          <div class="flex justify-center w-full">
            <MyButton
              expanded=""
              color="primary"
              variant="filled"
              :disabled="isLoading"
              @click="onSubmit"
            >
              <p class="text-md-semibold">Reset Password</p>
            </MyButton>
          </div>
          <div
            class="flex flex-row gap-2 items-center cursor-pointer text-gray/500"
          >
            <router-link
              to="/login"
              class="flex flex-row gap-2 items-center cursor-pointer"
            >
              <ArrowLeft :size="20" color="currentColor" />
              <p class="text-gray/500 text-sm-semibold">Back to login</p>
            </router-link>
          </div>
        </div>
      </form>
    </section>
    <section
      v-else-if="step === 2"
      class="w-full bg-white flex flex-col justify-center items-center p-8 md:p-12"
    >
      <div class="items-center justify-center flex flex-col gap-4">
        <div class="border border-gray/200 rounded-xl">
          <div class="p-4 text-gray/700 text-md-regular">
            <Mail01 :size="34" color="currentColor" />
          </div>
        </div>

        <h1 class="text-2xl font-bold text-gray/700 mb-2">Check your email</h1>
        <div class="flex flex-col gap-2 justify-center items-center">
          <p class="text-gray/500">We sent a one time password to</p>
          <p class="text-gray/500 text-md-semibold">{{ email }}</p>
        </div>
      </div>
      <div class="p-8">
        <OtpInput @complete="handleOtp" />
      </div>

      <div class="mt-8 w-full max-w-sm flex flex-col gap-6">
        <div class="flex flex-col gap-4 justify-center items-center">
          <div
            class="flex flex-row gap-2 items-center cursor-pointer text-gray/500"
          >
            <router-link
              to="/login"
              class="flex flex-row gap-2 items-center cursor-pointer"
            >
              <ArrowLeft :size="20" color="currentColor" />
              <p class="text-gray/500 text-sm-semibold">Back to login</p>
            </router-link>
          </div>
        </div>
      </div>
    </section>
    <section
      v-else-if="step === 3"
      class="w-full bg-white flex flex-col justify-center items-center p-8 md:p-12"
    >
      <div class="items-center justify-center flex flex-col gap-4">
        <div class="border border-gray/200 rounded-xl">
          <div class="p-4 text-gray/700 text-md-regular">
            <Lock01 :size="34" color="currentColor" />
          </div>
        </div>

        <h1 class="text-2xl font-bold text-gray/700 mb-2">Set new password</h1>
        <div class="flex flex-col gap-2 justify-center items-center">
          <p class="text-gray/500">
            Your new password must be different to previously used passwords.
          </p>
        </div>
      </div>
      <div class="w-[400px] pt-4 flex flex-col gap-4">
        <div class="">
          <label
            for="new_password"
            class="block text-sm font-medium text-gray/700 pb-2"
          >
            Password
          </label>
          <MyTextField
            class="w-full"
            expanded
            type="password"
            id="new_password"
            v-model="new_password"
            :error-message="errorMessage"
            placeholder="Enter new password"
          />
        </div>
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray/700 pb-2"
          >
            Confirm password
          </label>
          <MyTextField
            type="password"
            id="confirm_password"
            v-model="confirm_password"
            :error-message="errorMessage"
            placeholder="Confirm new password"
          />
        </div>
        <div class="flex flex-col gap-y-3">
          <div class="flex flex-rows gap-2 items-center">
            <Check
              :size="20"
              :color="isLongEnough ? 'green' : 'currentColor'"
              :class="[
                'rounded-full p-[3px]',
                isLongEnough
                  ? 'bg-green-100 text-green-500'
                  : 'bg-gray/200 text-gray/400',
              ]"
            />
            <p
              :class="[
                'text-sm-regular',
                isLongEnough ? 'text-green-600' : 'text-gray-500',
              ]"
            >
              Must be at least 8 characters
            </p>
          </div>
          <div class="flex flex-rows gap-2 items-center">
            <Check
              :size="20"
              :color="hasSpecialChar ? 'green' : 'currentColor'"
              :class="[
                'rounded-full p-[3px]',
                hasSpecialChar
                  ? 'bg-green-100 text-green-500'
                  : 'bg-gray/200 text-gray/400',
              ]"
            />
            <p
              :class="[
                'text-sm-regular',
                hasSpecialChar ? 'text-green-600' : 'text-gray-500',
              ]"
            >
              Must contain one special character
            </p>
          </div>
          <div class="flex flex-rows gap-2 items-center">
            <Check
              :size="20"
              :color="passwordsMatch ? 'green' : 'currentColor'"
              :class="[
                'rounded-full p-[3px]',
                passwordsMatch
                  ? 'bg-green-100 text-green-500'
                  : 'bg-gray/200 text-gray/400',
              ]"
            />
            <p
              :class="[
                'text-sm-regular',
                passwordsMatch ? 'text-green-600' : 'text-gray-500',
              ]"
            >
              Passwords match
            </p>
          </div>
        </div>
        <MyButton
          expanded=""
          color="primary"
          variant="filled"
          :disabled="isLoading || !allValid"
          @click="handleResetPassword"
        >
          <p class="text-md-semibold">Reset Password</p>
        </MyButton>
      </div>

      <div class="mt-8 w-full max-w-sm flex flex-col gap-6">
        <div class="flex flex-col gap-4 justify-center items-center">
          <div
            class="flex flex-row gap-2 items-center cursor-pointer text-gray/500"
          >
            <router-link
              to="/login"
              class="flex flex-row gap-2 items-center cursor-pointer"
            >
              <ArrowLeft :size="20" color="currentColor" />
              <p class="text-gray/500 text-sm-semibold">Back to login</p>
            </router-link>
          </div>
        </div>
      </div>
    </section>
    <section
      v-else-if="step === 4"
      class="w-full bg-white flex flex-col justify-center items-center p-8 md:p-12"
    >
      <div class="items-center justify-center flex flex-col gap-1">
        <div class="border border-gray/200 rounded-xl">
          <div class="p-4 text-gray/700 text-md-regular">
            <CheckCircle :size="34" color="currentColor" />
          </div>
        </div>

        <h1 class="text-2xl font-bold text-gray/700 mb-2">Password Reset</h1>
        <div class="flex flex-col gap-2 justify-center items-center">
          <p class="text-gray/500">
            Your password has been successfully reset. Click below to log in
            magically.
          </p>
        </div>
      </div>

      <div class="mt-8 w-full max-w-sm flex flex-col gap-6">
        <div class="flex flex-col gap-4 justify-center items-center">
          <div
            class="flex flex-row gap-2 items-center cursor-pointer text-gray/500"
          >
            <MyButton
              expanded
              color="primary"
              variant="filled"
              :disabled="isLoading || !allValid"
              @click="router.push('/login')"
            >
              <p class="text-md-semibold">Back to login</p>
            </MyButton>
            <!-- <router-link
              to="/login"
              class="flex flex-row gap-2 items-center cursor-pointer"
            >
              <ArrowLeft :size="20" color="currentColor" />
              <p class="text-gray/500 text-sm-semibold">Back to login</p>
            </router-link> -->
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
