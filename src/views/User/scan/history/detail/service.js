import { download, get, post, remove } from "../../../../../utils/networkUtils";

export const Service = {
  getRooms: (params) => get("/mobile/complaint", params),
  detaildata: (id) => get(`/mobile/complaint/${id}`),
//   checkRoom: (id, body) => post(`/mobile/complaint/check/${id}`, body),
};
