import http from "../configs/http";

const ordersApi = {
  getAllOrders: (page = 0, limit = 5) => {
    return http.get(`orders?page=${page}&limit=${limit}`);
  },
  getOrderById: (id) => http.get(`orders/${id}`),
  createOrder: (data) => http.post("orders", data),
  deleteOrder: (id) => http.delete(`orders/delete/${id}`),
  updateOrder: (id, data) => http.put(`orders/update/${id}`, data),
  searchOrderCode: (orderCode) =>
    http.get(`orders/search?orderCode=${orderCode}`),
};

export default ordersApi;
