import http from "../configs/http";

const colorsApi = {
  getAllColors: (page = 0, limit = 5) => {
    return http.get(`colors?page=${page}&limit=${limit}`);
  },
  getColorById: (id) => http.get(`colors/${id}`),
  createColor: (data) => http.post("colors", data),
  deleteColor: (id) => http.delete(`colors/delete/${id}`),
  updateColor: (id, data) => http.put(`colors/${id}`, data),
};

export default colorsApi;
