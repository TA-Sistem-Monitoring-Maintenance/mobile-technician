import { post } from "../../utils/networkUtils";
import { signupSchema } from "./schema";

export const Service = {
  login: async (data) => await post("/v1/auth/", data),
  signup: async (data) => await post("/v1/auth/", data),
};
