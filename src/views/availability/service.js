import { patch, post } from "../../utils/networkUtils";

export const Service = {
  sendOTP: (body) => post("/forgot-password/", body, {}, "form-data"),
  checkOTP: (body) => post("/forgot-password/check-otp", body, {}, "form-data"),
  resetPassword: (body) =>
    patch("/forgot-password/update", body, {}, "form-data"),
};
