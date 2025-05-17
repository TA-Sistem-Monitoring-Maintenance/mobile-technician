<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { handleLogin } from "./store.js";
import MyButton from "@components/Button/MyButton.vue";
import MyTextField from "@components/TextField/MyTextField.vue";
import { loginSchema, signupSchema } from "./schema.js";
import MyButtonGroupV2 from "@components/Button/MyButtonGroupV2.vue";
import { Check } from "untitledui-js/vue"; // Assuming you're using an icon component for checkmarks
import MyToaster from "@components/Toaster/MyToaster"; // Assuming you have a toaster component for messages

// Define form fields and errors
const username = ref(null); // Set default to null
const password = ref(null); // Set default to null
const confirmPassword = ref(null); // for password confirmation (only for signup)
const name = ref(""); // for signup name field
const usernameError = ref("");
const passwordError = ref("");
const nameError = ref(""); // for signup name error
const confirmPasswordError = ref(""); // for signup confirm password error
const isLoading = ref(false);
const isSignup = ref(false); // toggle between login and signup

// Password validation checks
const isLongEnough = computed(
  () => password.value && password.value.length >= 8
);
const hasSpecialChar = computed(
  () => password.value && /[!@#$%^&*(),.?":{}|<>]/.test(password.value)
);
const passwordsMatch = computed(
  () =>
    password.value &&
    confirmPassword.value &&
    password.value === confirmPassword.value
);

const router = useRouter();

// Handle submit
const onSubmit = async () => {
  usernameError.value = "";
  passwordError.value = "";
  nameError.value = "";
  confirmPasswordError.value = "";
  isLoading.value = true;

  try {
    if (isSignup.value) {
      // Handle signup
      await signupSchema.validate(
        {
          name: name.value,
          username: username.value,
          password: password.value,
        },
        { abortEarly: false }
      );
      // Simulate a successful signup process
      MyToaster({
        message: "Registration successful! You can now log in.",
        type: "success",
      });

      // Reset fields after successful signup
      name.value = "";
      username.value = null;
      password.value = null;
      confirmPassword.value = null;

      // Switch to login form after signup
      isSignup.value = false;
    } else {
      // Handle login
      await loginSchema.validate(
        { username: username.value, password: password.value },
        { abortEarly: false }
      );
      await handleLogin({
        username: username.value,
        password: password.value,
        router,
      });
    }
  } catch (error) {
    if (error.inner) {
      error.inner.forEach((err) => {
        if (err.path === "username") {
          usernameError.value = err.message;
        } else if (err.path === "password") {
          passwordError.value = err.message;
        } else if (err.path === "name") {
          nameError.value = err.message;
        } else if (err.path === "confirmPassword") {
          confirmPasswordError.value = err.message;
        }
      });
    }
    // Use toaster for error message
    MyToaster({
      message: "An error occurred. Please try again.",
      type: "error",
    });
  } finally {
    isLoading.value = false;
  }
};

// Function to toggle between Login and Sign Up forms
const toggleForm = (formType) => {
  isSignup.value = formType === "signup";
};

// Watch for changes to isSignup and clear the form fields
watch(isSignup, (newValue) => {
  if (!newValue) {
    // If switching to login, reset the fields
    username.value = null;
    password.value = null;
    confirmPassword.value = null;
    name.value = "";
    usernameError.value = "";
    passwordError.value = "";
    nameError.value = "";
    confirmPasswordError.value = "";
  }
});

// Reset email and password to null when the component is mounted
onMounted(() => {
  username.value = null; // Set email to null on mount
  password.value = null; // Set password to null on mount
  confirmPassword.value = null; // Set confirm password to null on mount
});
</script>

<template>
  <main class="flex h-screen">
    <section
      class="w-full bg-white flex flex-col justify-center items-center p-8 md:p-12"
    >
      <div class="text-center">
        <img
          src="../../assets/images/Logo.png"
          alt="App Logo"
          class="w-209 h-32 mx-auto mb-4"
        />
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ isSignup ? "Create an account" : "Log in to your account" }}
        </h1>
        <p class="text-gray-600">
          {{
            isSignup
              ? "Create an account below"
              : "Welcome back! Please enter your details."
          }}
        </p>
      </div>

      <!-- Login / Signup Tabs -->
      <div class="flex justify-center p-4">
        <MyButtonGroupV2
          :buttons="[
            { label: 'Sign in', value: 'login' },
            { label: 'Sign up', value: 'signup' },
          ]"
          :value="isSignup ? 'signup' : 'login'"
          :onChange="(val) => toggleForm(val)"
        />
      </div>

      <!-- Login or Signup Form -->
      <form @submit.prevent="onSubmit" class="w-full max-w-sm">
        <div v-if="isSignup" class="mb-6">
          <label for="name" class="block text-sm font-medium text-gray-700"
            >Name</label
          >
          <MyTextField
            type="text"
            id="name"
            v-model="name"
            placeholder="Enter your name"
            :error-message="nameError"
          />
        </div>

        <div class="mb-6">
          <label for="username" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <MyTextField
            type="email"
            id="username"
            v-model="username"
            placeholder="Enter your email"
            :error-message="usernameError"
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <MyTextField
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            :error-message="passwordError"
          />
        </div>

        <!-- Show confirm password only for sign-up form -->
        <div v-if="isSignup" class="mb-6">
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700"
            >Confirm Password</label
          >
          <MyTextField
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="Confirm your password"
            :error-message="confirmPasswordError"
          />
        </div>

        <!-- Password validation requirements -->
        <div v-if="isSignup" class="flex flex-col gap-y-3">
          <div class="flex flex-row gap-2 items-center">
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
          <div class="flex flex-row gap-2 items-center">
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
          <div class="flex flex-row gap-2 items-center">
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

        <div class="flex justify-end items-center mb-6" v-if="!isSignup">
          <router-link
            to="/forgot-password"
            class="text-sm-semibold text-purple-600 hover:underline"
            >Forgot password</router-link
          >
        </div>

        <div class="flex justify-center mt-4">
          <MyButton
            expanded=""
            class="w-full py-3 rounded-lg"
            color="primary"
            variant="filled"
            :disabled="
              isLoading ||
              (isSignup
                ? !isLongEnough || !hasSpecialChar || !passwordsMatch
                : !username || !password)
            "
            type="submit"
          >
            <p class="text-md-semibold">
              {{ isSignup ? "Get started" : "Sign in" }}
            </p>
          </MyButton>
        </div>
      </form>
    </section>
  </main>
</template>
