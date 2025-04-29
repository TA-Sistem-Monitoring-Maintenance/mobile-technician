<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { handleLogin } from "./store.js";
import MyButton from "@components/Button/MyButton.vue";
import MyTextField from "@components/TextField/MyTextField.vue";
import { loginSchema } from "./schema.js"; // Import the schema

// State untuk username, password, error message, dan loading
const username = ref("");
const password = ref("");
const usernameError = ref(""); // Error message for username
const passwordError = ref(""); // Error message for password
const isLoading = ref(false);

const router = useRouter();

const onSubmit = async () => {
  usernameError.value = ""; // Reset username error
  passwordError.value = ""; // Reset password error
  isLoading.value = true; // Tampilkan spinner loading

  try {
    // Validate input using schema
    await loginSchema.validate(
      {
        username: username.value,
        password: password.value,
      },
      { abortEarly: false } // Collect all errors
    );
    await handleLogin({
      username: username.value,
      password: password.value,
      router,
    });
  } catch (error) {
    if (error.inner) {
      // Map validation errors to specific fields
      error.inner.forEach((err) => {
        if (err.path === "username") {
          usernameError.value = err.message;
        } else if (err.path === "password") {
          passwordError.value = err.message;
        }
      });
    }
  } finally {
    isLoading.value = false; // Hentikan spinner loading
  }
};
</script>

<template>
  <main class="flex h-screen">
    <!-- Bagian Kiri -->
    <section
      class="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-8 md:p-12"
    >
      <div class="text-center">
        <img
          src="../../assets/images/Logo.png"
          alt="App Logo"
          class="w-209 h-32 mx-auto mb-4"
        />
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Log in to your account
        </h1>
        <p class="text-gray-600">Welcome back! Please enter your details.</p>
      </div>
      <form @submit.prevent="onSubmit" class="mt-10 w-full max-w-sm">
        <div class="mb-6">
          <label for="username" class="block text-sm font-medium text-gray-700">
            Email
          </label>
          <MyTextField
            type="text"
            id="username"
            v-model="username"
            placeholder="Enter your email"
            :error-message="usernameError"
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">
            Password
          </label>
          <MyTextField
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            :error-message="passwordError"
          />
        </div>
        <div class="flex justify-end items-center mb-6">
          <router-link
            to="/forgot-password"
            class="text-sm-semibold text-purple-600 hover:underline"
          >
            Forgot password
          </router-link>
        </div>
        <div class="flex justify-center">
          <MyButton
            expanded=""
            class="w-full py-3 rounded-lg"
            color="primary"
            variant="filled"
            :disabled="isLoading"
            @click="onSubmit"
          >
            <p class="text-md-semibold">Sign in</p>
          </MyButton>
        </div>
      </form>
    </section>

    <!-- Bagian Kanan -->
    <section class="w-1/2 bg-cover bg-center relative hidden md:block">
      <img
        src="../../assets/images/Gedung.png"
        alt="App Gedung"
        class="w-full h-full object-cover"
      />
      <div
        class="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-6"
      >
        <h2 class="text-3xl font-semibold">Telkom University</h2>
        <p class="text-sm">Maintenance 2024</p>
      </div>
    </section>
  </main>
</template>
