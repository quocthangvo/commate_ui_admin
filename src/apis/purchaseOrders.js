import http from "../configs/http";

const purchaseOrdersApi = {
  getAllPurchaseOrders: (page = 1, limit = 5) => {
    return http.get(`purchase_orders?page=${page}&limit=${limit}`);
  },
  getPurchaseOrderById: (id) => http.get(`purchase_orders/${id}`),
  createPurchaseOrder: (data) => http.post("purchase_orders", data),
  deletePurchaseOrder: (id) => http.delete(`purchase_orders/delete/${id}`),
  updatePurchaseOrder: (id, data) =>
    http.put(`purchase_orders/update/${id}`, data),
  searchPurchaseOrder: (code) =>
    http.get(`purchase_orders/search?code=${code}`),
};

export default purchaseOrdersApi;
