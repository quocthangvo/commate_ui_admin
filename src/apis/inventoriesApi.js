import http from "../configs/http";

const inventoriesApi = {
  getAllInventories: (page = 1, limit = 5) => {
    return http.get(`inventories?page=${page}&limit=${limit}`);
  },
  getInventoryById: (id) => http.get(`inventories/${id}`),
  searchVersionName: (productDetailId) =>
    http.get(`inventories/search?productDetailId=${productDetailId}`),
};

export default inventoriesApi;
