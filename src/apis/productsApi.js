import http from "../configs/http";

const productsApi = {
  getAllProducts: (page = 1, limit = 5) => {
    return http.get(`products?page=${page}&limit=${limit}`);
  },
  getProductById: (id) => http.get(`products/${id}`),
  createProduct: (data) => http.post("products", data),
  updateProduct: (id, data) => http.put(`products/${id}`, data),
  deleteProduct: (id) => http.delete(`products/delete/${id}`),
  searchProduct: (name) => http.get(`products/search?name=${name}`),
  findByCategoryId: (id) => http.get(`products/category/${id}`),
};

export default productsApi;
