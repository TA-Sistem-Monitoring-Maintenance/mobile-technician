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
const successMessage = ref(""); // success message after signup

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
  successMessage.value = ""; // Reset success message

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

      // Handle sign-up request
      const encryptedPassword = CryptoJS.AES.encrypt(
        password.value,
        import.meta.env.VITE_APP_SECRET_KEY
      ).toString();

      const formData = new FormData();
      formData.append("name", name.value);
      formData.append("email", username.value);
      formData.append("password", encryptedPassword);

      const response = await axios.post(
        "http://localhost:3000/monitoring/v1/mobile/auth/register", // Correct endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Time-Zone": timeZone,
          },
        }
      );

      // Show success toaster
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
