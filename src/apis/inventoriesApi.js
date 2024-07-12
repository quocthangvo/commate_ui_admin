import http from "../configs/http";

const inventoriesApi = {
  getAllInventories: (page = 1, limit = 5) => {
    return http.get(`inventories?page=${page}&limit=${limit}`);
  },
  getInventoryById: (id) => http.get(`inventories/${id}`),
  createColor: (data) => http.post("inventories", data),
  deleteColor: (id) => http.delete(`inventories/delete/${id}`),
  updateColor: (id, data) => http.put(`inventories/${id}`, data),
};

export default inventoriesApi;
