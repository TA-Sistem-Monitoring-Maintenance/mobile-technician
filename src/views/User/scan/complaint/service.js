import { download, get, post, remove } from "../../../../utils/networkUtils";

export const Service = {
    showComplaintRoom: (id) => get(`/mobile/complaint/room/${id}`),
};
