import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Table, Pagination } from "react-bootstrap";
import ordersApi from "../../apis/ordersApi";
import { toast } from "react-toastify";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns"; // Import format from date-fns
import "../../css/Status.css";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback((page = 1, limit = 8) => {
    ordersApi
      .getAllOrders(page, limit) // Page number in backend starts from 0
      .then((response) => {
        setOrders(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
        setShowError(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        showErrorMessage("Failed to fetch orders."); // Show error message on fetch failure
      });
  }, []);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [fetchOrders, currentPage]);

  const handleUpdateStatus = (orderId, newStatus) => {
    ordersApi
      .updateOrder(orderId, { status: newStatus })
      .then((response) => {
        toast.success(response.data.message);
        fetchOrders(currentPage);
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
          setTotalPages(response.data.data.totalPages);
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
    fetchOrders(currentPage);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status-pending";
      case "PROCESSING":
        return "status-processing";
      case "SHIPPING":
        return "status-shipping";
      case "DELIVERED":
        return "status-delivered";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm"); // Định dạng ngày theo định dạng 'dd/MM/yyyy HH:mm'
  };

  const generatePageItems = () => {
    const pageItems = [];
    const maxPagesToShow = 4;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageItems.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxPagesToShow - 1; i++) {
          pageItems.push(
            <Pagination.Item
              key={i}
              active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Pagination.Item>
          );
        }
        pageItems.push(<Pagination.Ellipsis key="ellipsis-1" />);
        pageItems.push(
          <Pagination.Item
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </Pagination.Item>
        );
      } else if (currentPage > totalPages - 3) {
        pageItems.push(
          <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
            {1}
          </Pagination.Item>
        );
        pageItems.push(<Pagination.Ellipsis key="ellipsis-2" />);
        for (let i = totalPages - (maxPagesToShow - 2); i <= totalPages; i++) {
          pageItems.push(
            <Pagination.Item
              key={i}
              active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Pagination.Item>
          );
        }
      } else {
        pageItems.push(
          <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
            {1}
          </Pagination.Item>
        );
        pageItems.push(<Pagination.Ellipsis key="ellipsis-3" />);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageItems.push(
            <Pagination.Item
              key={i}
              active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Pagination.Item>
          );
        }
        pageItems.push(<Pagination.Ellipsis key="ellipsis-4" />);
        pageItems.push(
          <Pagination.Item
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </Pagination.Item>
        );
      }
    }
    return pageItems;
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Danh sách đơn hàng</h2>
      {showError && <Alert variant="danger">{errorMessage}</Alert>}
      <Button
        variant="outline-primary mb-3"
        onClick={() => fetchOrders(currentPage)}
      >
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
      <Table bordered hover>
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
          {orders.map((order, index) => (
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
              <td>{order.address}</td>
              <td>{order.phoneNumber}</td>
              <td>{formatDate(order.orderDate)}</td>
              <td>{formatDate(order.shippingDate)}</td>
              <td>
                <div className="mt-2">
                  <select
                    className={`form-select form-select-no-border 
                      ${getStatusClass(order.status)}`}
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
      <Pagination>
        <Pagination.Prev
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        />
        {generatePageItems()}
        <Pagination.Next
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
}
