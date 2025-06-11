import { get } from "../../utils/networkUtils";

export const Service = {
  // Ambil data profil
  showProfile: async () => await get("/mobile/auth/show"),
};
