import http from "../configs/http";

const productDetailsApi = {
  getAllProductDetails: (page = 1, limit = 10) => {
    return http.get(`product_details?page=${page}&limit=${limit}`);
  },
  getByProductId: (productId) =>
    http.get(`product_details/product/${productId}`),
  deleteProductDetail: (id) => http.delete(`product_details/delete/${id}`),
};

export default productDetailsApi;
