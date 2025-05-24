import { get, patch, post } from "../../utils/networkUtils";

export const Service = {
  createAvailability: (body) =>
    post("/mobile/technician/", body, {}, "form-data"),
  getAvailability: (body) =>
    get("/mobile/technician/show", body, {}, "form-data"),
  resetPassword: (body) =>
    patch("/forgot-password/update", body, {}, "form-data"),
};
