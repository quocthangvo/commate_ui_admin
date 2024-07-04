import http from "../configs/http";

const productDetailsApi = {
  getAllProductDetails: (page = 1, limit = 10) => {
    return http.get(`product_details?page=${page}&limit=${limit}`);
  },
  getByProductId: (productId) =>
    http.get(`product_details/product/${productId}`),
  deleteProductDetail: (id) => http.delete(`product_details/delete/${id}`),
  searchProductDetail: (name) =>
    http.get(`product_details/search?name=${name}`),
  findBySizeId: (id) => http.get(`product_details/size/${id}`),
  findByColorId: (id) => http.get(`product_details/color/${id}`),
  findBySizeAndColorId: (sizeId, colorId) =>
    http.get(`product_details/${sizeId}/${colorId}`),
};

export default productDetailsApi;
