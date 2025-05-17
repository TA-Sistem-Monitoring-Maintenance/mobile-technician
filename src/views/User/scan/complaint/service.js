import { download, get, post, remove } from "../../../../utils/networkUtils";

export const Service = {
    showComplaintRoom: (id) => get(`/mobile/complaint/room/${id}`),
    searchAsset: (params) => get("/option/asset-list/", params),
    submitComplaint: (body) => post('/mobile/complaint/', body, 'form-data'),

};
