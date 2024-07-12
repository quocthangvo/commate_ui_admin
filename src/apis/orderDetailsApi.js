import http from "../configs/http";

const orderDetailsApi = {
  getAllOrderDetails: (page = 1, limit = 5) => {
    return http.get(`order_details?page=${page}&limit=${limit}`);
  },
  getOrderDetailById: (id) => http.get(`order_details/order/${id}`),
  deleteOrderDetail: (id) => http.delete(`order_details/delete/${id}`),
  updateOrderDetail: (id, data) => http.put(`order_details/${id}`, data),
};

export default orderDetailsApi;
