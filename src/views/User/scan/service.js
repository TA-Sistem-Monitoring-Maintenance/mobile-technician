import { download, get, post, remove } from "../../../utils/networkUtils";

export const Service = {
  getRooms: (params) => get("/mobile/technician", params),
  detaildata: (id) => get(`/mobile/technician/${id}`),
  checkRoom: (id, body) => post(`/mobile/technician/check/${id}`, body),
};
