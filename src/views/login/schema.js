import * as yup from "yup";

export const roomSchema = yup.object({
  name: yup.string().required("Nama ruangan wajib diisi"),
  location: yup.string().required("Lokasi wajib diisi"),
  description: yup.string().max(500, "Maksimal 500 karakter"),
});

// Define login schema
export const loginSchema = yup.object({
  username: yup.string().required("Username wajib diisi"),
  password: yup.string().required("Password wajib diisi"),
});

// Define signup schema
export const signupSchema = yup.object({
  name: yup.string().required("Name is required"),
  
  username: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    // .required("Confirm Password confirmation is required"),
});

export const validationSchema = (isSignup) => {
  // Return the appropriate schema based on whether it's login or signup
  return isSignup ? signupSchema : loginSchema;
};