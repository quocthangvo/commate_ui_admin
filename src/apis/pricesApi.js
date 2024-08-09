import http from "../configs/http";

const pricesApi = {
  getAllPrices: (page = 1, limit = 5) => {
    return http.get(`prices?page=${page}&limit=${limit}`);
  },
  getPriceById: (id) => http.get(`prices/${id}`),
  createPrice: (data) => http.post("prices", data),
  deletePrice: (id) => http.delete(`prices/delete/${id}`),
  updatePrice: (id, data) => http.put(`prices/update/${id}`, data),
  getAllPriceDistinct: (page = 1, limit = 5) =>
    http.get(`prices/price_distinct?page=${page}&limit=${limit}`),
  searchPricesByVersionName: (versionName, page = 1, limit = 5) =>
    http.get(
      `prices/search?versionName=${versionName}&page=${page}&limit=${limit}`
    ),
};

export default pricesApi;
