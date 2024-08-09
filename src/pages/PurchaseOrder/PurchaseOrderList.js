import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Pagination, Table } from "react-bootstrap";
import ConfirmModal from "../../components/ConfirmModal";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import purchaseOrdersApi from "../../apis/purchaseOrdersApi";

export default function PurchaseOrderList() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [purchaseOrderId, setPurchaseOrderId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPurchaseOrders = useCallback((page = 1, limit = 10) => {
    purchaseOrdersApi
      .getAllPurchaseOrders(page, limit)
      .then((response) => {
        setPurchaseOrders(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetchPurchaseOrders(currentPage);
  }, [fetchPurchaseOrders, currentPage]);

  const handleDelete = () => {
    purchaseOrdersApi
      .deletePurchaseOrder(purchaseOrderId)
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
          fetchPurchaseOrders(currentPage);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setShowConfirmModal(false);
        setPurchaseOrderId(null);
      });
  };

  const handleConfirmOrder = (orderId) => {
    purchaseOrdersApi
      .updatePurchaseOrder(orderId, { status: "DELIVERED" })
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
          fetchPurchaseOrders(currentPage);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
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

  const searchPurchaseOrder = (code) => {
    const params = new URLSearchParams();
    params.append("search", code);
    window.history.replaceState(null, null, `?${params.toString()}`);
    purchaseOrdersApi
      .searchPurchaseOrder(code)
      .then((response) => {
        if (response.status === 200) {
          setPurchaseOrders(response.data.data);
        }
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
      });
  };

  const filterByOrderDate = () => {
    if (orderDate) {
      purchaseOrdersApi
        .getOrderDate(orderDate)
        .then((response) => {
          setPurchaseOrders(response.data.data);
        })
        .catch((error) => {
          showErrorMessage(error.response.data.message);
        });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchPurchaseOrder(searchValue);
    }
  };

  const clearFilter = () => {
    setSearchValue("");
    setOrderDate("");
    const params = new URLSearchParams();
    window.history.replaceState(null, null, `?${params.toString()}`);
    fetchPurchaseOrders(currentPage); // Fetch all products again
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const generatePageItems = () => {
    const pageItems = [];
    const maxPagesToShow = 5;

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
    <div>
      <ConfirmModal
        title="Confirm Delete"
        content="Bạn có muốn xóa không?"
        onClick={handleDelete}
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
      />
      <div className="container my-4">
        <h2 className="text-center mb-4">Đơn đặt hàng</h2>
        {showError && <Alert variant="danger">{errorMessage}</Alert>}

        <div className="row mb-3">
          <div className="col">
            <Link
              className="btn btn-primary me-1"
              to="/purchaseOrders/create"
              role="button"
            >
              Đặt đơn hàng
            </Link>
            <Button variant="outline-primary" onClick={handleRefresh}>
              Refresh
            </Button>
          </div>
        </div>
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
              onClick={() => searchPurchaseOrder(searchValue)}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>

          <div className="form-gr">
            <input
              type="date"
              className="form-control"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
            />
          </div>

          <div className="form-gr">
            <button
              className="btn border-black"
              type="button"
              onClick={filterByOrderDate}
            >
              <FontAwesomeIcon icon={faFilter} /> Lọc theo ngày
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
              <th>Ngày đặt hàng</th>
              <th>Ngày dự kiến giao</th>
              <th>Trạng thái</th>
              <th>Nhà cung cấp</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders &&
              purchaseOrders.length > 0 &&
              purchaseOrders.map((purchaseOrder, index) => (
                <tr key={purchaseOrder.id}>
                  <td>{index + 1}</td>
                  <td>
                    <Link
                      to={`/purchaseOrderDetails/purchaseOrder/${purchaseOrder.id}`}
                      className="underline"
                    >
                      {purchaseOrder.code}
                    </Link>
                  </td>
                  <td>{purchaseOrder.orderDate}</td>
                  <td>{purchaseOrder.shippingDate}</td>
                  <td>{purchaseOrder.status}</td>
                  <td>{purchaseOrder.supplier_name}</td>
                  <td style={{ width: 1, whiteSpace: "nowrap" }}>
                    <button
                      className="btn btn-primary ms-2"
                      onClick={() => handleConfirmOrder(purchaseOrder.id)}
                    >
                      Xác nhận
                    </button>
                    <button
                      className="btn btn-danger ms-2"
                      onClick={() => {
                        setPurchaseOrderId(purchaseOrder.id);
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
        <Pagination>
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {generatePageItems()}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </div>
  );
}
