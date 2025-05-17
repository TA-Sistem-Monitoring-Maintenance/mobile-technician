import { download, get, post, remove } from "../../../utils/networkUtils";

export const Service = {
    getRoomInfo: (id) => get(`/mobile/complaint/room/${id}`),
      
};
