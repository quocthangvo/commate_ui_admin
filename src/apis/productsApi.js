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
  uploadImages: (id, formData) =>
    http.post(`products/uploads/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getImageByProductId: (id) => http.get(`products/images/${id}`),
};

export default productsApi;
