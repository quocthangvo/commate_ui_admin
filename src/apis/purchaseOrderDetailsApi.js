import http from "../configs/http";

const purchaseOrderDetailsApi = {
  getAllPurchaseOrderDetails: (page = 1, limit = 5) => {
    return http.get(`purchase_order_details?page=${page}&limit=${limit}`);
  },
  getByPurchaseOrderById: (id) =>
    http.get(`purchase_order_details/purchase_order/${id}`),
  createPurchaseOrderDetail: (data) =>
    http.post("purchase_order_details", data),
  deletePurchaseOrderDetail: (id) =>
    http.delete(`purchase_order_details/delete/${id}`),
  updatePurchaseOrderDetail: (id, data) =>
    http.put(`purchase_order_details/update/${id}`, data),
};

export default purchaseOrderDetailsApi;
