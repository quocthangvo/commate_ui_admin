import http from "../configs/http";

const usersApi = {
  login: (phone_number, password) => {
    return http.post(`users/login`, { phone_number, password });
  },
  // register: (phone_number, password, fullname) => {
  //   return http.post(`users/register`, { phone_number, password, fullname });
  // },
  getAllUsers: (page = 0, limit = 10) => {
    return http.get(`users?page=${page}&limit=${limit}`);
  },
  getUserById: (id) => http.get(`users/${id}`),
  createUser: (data) => http.post("users/register", data),
  deleteUser: (id) => http.delete(`users/delete/${id}`),
  lockUser: (id) => http.delete(`users/${id}`),
  unlockUser: (id) => http.put(`users/${id}`),
};

export default usersApi;
