import { download, get, post, remove } from "../../../../utils/networkUtils";

export const Service = {
  getTask: (params) => get("/mobile/complaint", params),
  detaildata: (id) => get(`/mobile/complaint/${id}`),
};
