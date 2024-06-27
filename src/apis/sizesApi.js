import http from "../configs/http";

const sizesApi = {
  getAllSizes: (page = 1, limit = 5) => {
    return http.get(`sizes?page=${page}&limit=${limit}`);
  },
  getSizeById: (id) => http.get(`sizes/${id}`),
  createSize: (data) => http.post("sizes", data),
  deleteSize: (id) => http.delete(`sizes/delete/${id}`),
  updateSize: (id, data) => http.put(`sizes/${id}`, data),
};

export default sizesApi;
