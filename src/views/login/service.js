import { post } from "../../utils/networkUtils";

export const Service = {
  login: async (data) => await post("/v1/auth/", data),
};
