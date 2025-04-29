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
