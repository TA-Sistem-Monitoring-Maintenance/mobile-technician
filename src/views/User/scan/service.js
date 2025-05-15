import { download, get, post, remove } from "../../../utils/networkUtils";

export const Service = {
  getRooms: (params) => get("/mobile/technician", params),
  createRoom: (body) => post("/master/room", body, {}, "form-data"),
  downloadTemplateImport: () => download(`/master/room/example`),
  searchLocation: async (params) => await get("/option/location-list", params),
  searchCategory: async (params) => await get("/option/category-list", params),
  importRoom: async (data) =>
    await post("/master/room/import", data, "form-data", null),
  deleteRoom: async (body) =>
    remove("master/room/delete", body, {}, "form-data"),
  showRoom: async (id) => await get("/master/room/" + id),
  updateRoom: async (id, data) =>
    await post("/master/room/" + id, data, {}, "form-data"),
};
