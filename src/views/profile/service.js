import { get, patch } from "../../utils/networkUtils";

export const Service = {
  // Ambil data profil
  showProfile: async () => await get("/mobile/auth/show"),

  update: (params) => patch("/mobile/auth/update", params, {}, "form-data"),
};
