import http from "../configs/http";

const categoriesApi = {
  getAllCategories: (page = 0, limit = 10) => {
    return http.get(`categories?page=${page}&limit=${limit}`);
  },
  getCategoryById: (id) => http.get(`categories/${id}`),
  createCategory: (data) => http.post("categories", data),
  deleteCategory: (id) => http.delete(`categories/delete/${id}`),
  updateCategory: (id, data) => http.put(`categories/${id}`, data),
};

export default categoriesApi;
