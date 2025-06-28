import { download, get, patch, post, remove } from "../../utils/networkUtils";

export const Service = {
  getRooms: (params) => get("/mobile/technician", params),
  detaildata: (id) => get(`/mobile/technician/${id}`),
  checkRoom: (id, body) => post(`/mobile/technician/check/${id}`, body),
  approveMaintenance: (id, body) => patch(`/mobile/technician/${id}`, body),
  submitForm: (id, body) =>
    post(`/mobile/technician/upload/${id}`, body, "form-data"),
  getAllAssets: (id) => get(`/mobile/technician/${id}/assets`),
};
