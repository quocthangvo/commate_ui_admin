import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Alert, Button, Table } from "react-bootstrap";

import ConfirmModal from "../../components/ConfirmModal";
import { toast } from "react-toastify";
import ordersApi from "../../apis/ordersApi";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const fetchOrders = () => {
    ordersApi
      .getAllOrders()
      .then((response) => {
        setOrders(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = () => {
    ordersApi
      .deleteOrder(orderId)
      .then((response) => {
        if (response.status === 200) {
          toast(response.data.message);
          fetchOrders();
        } else {
          showErrorMessage("Không thể xóa");
        }
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
      })
      .finally(() => {
        setShowConfirmModal(false);
        setOrderId(null);
      });
  };

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setErrorMessage("");
    }, 3000); // 3 giây
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div>
      <ConfirmModal
        title="Confirm Delete"
        content="Bạn có muốn xóa không?"
        onClick={handleDelete}
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
      />
      <div className="container my-4">
        <h2 className="text-center mb-4">Đơn hàng</h2>
        {showError && <Alert variant="danger">{errorMessage}</Alert>}
        <div className="row mb-3">
          <div className="col">
            <Link
              className="btn btn-primary me-1"
              to="/orders/create"
              role="button"
            >
              Thêm đơn hàng
            </Link>
            <Button variant="outline-primary" onClick={handleRefresh}>
              Refresh
            </Button>
          </div>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã đơn hàng</th>
              <th>Tên khách hàng</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Ngày đặt hàng</th>
              <th>Ngày giao hàng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.length > 0 &&
              orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>
                    <Link
                      to={`/orders/orderDetail/${order.id}`}
                      className="underline"
                    >
                      {order.orderCode}
                    </Link>
                  </td>
                  <td>{order.fullName}</td>
                  <td>{order.phoneNumber}</td>
                  <td>{order.address}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.shippingDate}</td>
                  <td>{order.status}</td>
                  <td style={{ width: 1, whiteSpace: "nowrap" }}>
                    <Link
                      className="btn btn-success btn-sm me-1"
                      to={`/orders/${order.id}`}
                    >
                      Xác nhận
                    </Link>
                    <button
                      className="btn btn-danger ms-2"
                      onClick={() => {
                        setOrderId(order.id);
                        setShowConfirmModal(true);
                      }}
                    >
                      Hủy
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
