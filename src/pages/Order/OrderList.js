import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Table } from "react-bootstrap";
import ordersApi from "../../apis/ordersApi";
import { toast } from "react-toastify";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const fetchOrders = useCallback(() => {
    ordersApi
      .getAllOrders()
      .then((response) => {
        setOrders(response.data.data);
        setShowError(false); // Clear error state on successful fetch
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        showErrorMessage("Failed to fetch orders."); // Show error message on fetch failure
      });
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  const handleUpdateStatus = (orderId, newStatus) => {
    ordersApi
      .updateOrder(orderId, { status: newStatus })
      .then((response) => {
        toast.success(response.data.message);
        fetchOrders();
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
      });
  };

  const searchOrderCode = (orderCode) => {
    const params = new URLSearchParams();
    params.append("search", orderCode);
    window.history.replaceState(null, null, `?${params.toString()}`);
    ordersApi
      .searchOrderCode(orderCode)
      .then((response) => {
        if (response.status === 200) {
          setOrders(response.data.data);
        }
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
      });
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchOrderCode(searchValue);
    }
  };

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setErrorMessage("");
    }, 3000); // Clear error message after 3 seconds
  };

  const clearFilter = () => {
    setSearchValue("");
    const params = new URLSearchParams();
    window.history.replaceState(null, null, `?${params.toString()}`);
    fetchOrders();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Danh sách đơn hàng</h2>
      {showError && <Alert variant="danger">{errorMessage}</Alert>}
      <Button variant="outline-primary mb-3" onClick={handleRefresh}>
        Refresh
      </Button>
      <div className="d-flex">
        <div className="input-gr search-input-container">
          <input
            type="text"
            className="form-control border-1 search-input"
            placeholder="Tìm kiếm..."
            value={searchValue}
            onKeyPress={handleKeyPress}
            onChange={(e) => setSearchValue(e.target.value)}
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
          <button
            className="btn search-btn"
            type="button"
            onClick={() => searchOrderCode(searchValue)}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        <div className="form-gr">
          <button
            className="btn border-black"
            type="button"
            onClick={clearFilter}
          >
            <FontAwesomeIcon icon={faFilter} /> Xóa bộ lọc
          </button>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Mã đơn hàng</th>
            <th>Tên khách hàng</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
            <th>Ngày đặt hàng</th>
            <th>Ngày giao hàng</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>
                <Link
                  to={`/orders/orderDetail/${order.id}`}
                  className="underline"
                >
                  {order.orderCode}
                </Link>
              </td>
              <td>{order.fullName}</td>
              <td>{order.address}</td>
              <td>{order.phoneNumber}</td>
              <td>{order.orderDate}</td>
              <td>{order.shippingDate}</td>
              <td>
                <div className="mt-2">
                  <select
                    className="form-select"
                    value={order.status}
                    onChange={(e) =>
                      handleUpdateStatus(order.id, e.target.value)
                    }
                  >
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="PROCESSING">Xác nhận</option>
                    <option value="SHIPPING">Đang giao hàng</option>
                    <option value="DELIVERED">Đã giao hàng</option>
                    <option value="CANCELLED">Hủy</option>
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
