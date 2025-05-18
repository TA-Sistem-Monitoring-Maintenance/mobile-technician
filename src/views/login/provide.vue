<script setup>
import { ref, computed, watch, onMounted, provide } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import CryptoJS from "crypto-js";
import VueCookies from "vue-cookies";
import MyToaster from "@components/Toaster/MyToaster"; // Assuming you have a toaster component for messages

// Define form fields and errors
const email = ref("");
const password = ref("");
const confirmPassword = ref(""); // for password confirmation (only for signup)
const name = ref(""); // For sign-up: User's name
const usernameError = ref("");
const passwordError = ref("");
const nameError = ref(""); // for sign-up name error
const confirmPasswordError = ref(""); // for signup confirm password error
const isLoading = ref(false);
const isSignup = ref(false); // Toggle between login and signup

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

// Handle login function
async function handleLogin() {
  try {
    const encryptedPassword = CryptoJS.AES.encrypt(
      password.value,
      import.meta.env.VITE_APP_SECRET_KEY
    ).toString();

    // Prepare form data
    const formData = new FormData();
    formData.append("email", email.value);
    formData.append("password", encryptedPassword);

    // Get the timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const response = await axios.post(
      "http://localhost:3000/monitoring/v1/auth/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Time-Zone": timeZone,
        },
      }
    );

    VueCookies.set("tokenMonitoringMobile", response.data.token, "1d");
    MyToaster({ message: "Login successful!", type: "success" });
    router.push("/task");
  } catch (error) {
    MyToaster({
      message: error.response?.data?.message || error.message || "Login failed",
      type: "error",
    });
    console.error("Login failed:", error.response?.data || error.message);
  }
}

// Handle sign-up function
async function handleSignUp() {
  try {
    const encryptedPassword = CryptoJS.AES.encrypt(
      password.value,
      import.meta.env.VITE_APP_SECRET_KEY
    ).toString();

    // Prepare form data
    const formData = new FormData();
    formData.append("email", email.value);
    formData.append("password", encryptedPassword);
    formData.append("name", name.value); // Send user's name

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const response = await axios.post(
      "http://localhost:3000/monitoring/v1/mobile/auth/register", // Adjust your URL for sign-up
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Time-Zone": timeZone,
        },
      }
    );

    MyToaster({
      message: "Registration successful! You can now log in.",
      type: "success",
    });
    VueCookies.set("tokenMonitoringMobile", response.data.token, "1d");
    router.push("/login"); // Redirect to login after successful registration
  } catch (error) {
    MyToaster({
      message:
        error.response?.data?.message || error.message || "Sign-Up failed",
      type: "error",
    });
    console.error("Sign-Up failed:", error.response?.data || error.message);
  }
}

// Handle submit function for both login and sign-up
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
          username: email.value, // Using email as username
          password: password.value,
        },
        { abortEarly: false }
      );

      // Call handleSignUp to trigger the sign-up action
      await handleSignUp({
        username: email.value,
        password: password.value,
        name: name.value,
        router,
      });

      // Reset fields after successful signup
      name.value = "";
      email.value = "";
      password.value = "";
      confirmPassword.value = "";

      // Switch to login form after signup
      isSignup.value = false;
    } else {
      // Handle login
      await loginSchema.validate(
        { username: email.value, password: password.value },
        { abortEarly: false }
      );
      await handleLogin({
        username: email.value,
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
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
    name.value = "";
    usernameError.value = "";
    passwordError.value = "";
    nameError.value = "";
    confirmPasswordError.value = "";
  }
});

// Reset email and password to null when the component is mounted
onMounted(() => {
  email.value = ""; // Set email to null on mount
  password.value = ""; // Set password to null on mount
  confirmPassword.value = ""; // Set confirm password to null on mount
});

// Provide login and signup functionality and data to child components
provide("auth", {
  email,
  password,
  confirmPassword,
  name,
  isSignup,
  isLongEnough,
  hasSpecialChar,
  passwordsMatch,
  handleLogin,
  handleSignUp,
  onSubmit,
  toggleForm,
});
</script>

<template>
  <div>
    <Index />
  </div>
</template>
