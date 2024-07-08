import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Table } from "react-bootstrap";

import ConfirmModal from "../../components/ConfirmModal";
import { toast } from "react-toastify";
import purchaseOrdersApi from "../../apis/purchaseOrders";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";

export default function PurchaseOrderList() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [purchaseOrderId, setPurchaseOrderId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const fetchPurchaseOrders = () => {
    purchaseOrdersApi
      .getAllPurchaseOrders()
      .then((response) => {
        setPurchaseOrders(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const handleDelete = () => {
    purchaseOrdersApi
      .deletePurchaseOrder(purchaseOrderId)
      .then((response) => {
        if (response.status === 200) {
          toast(response.data.message);
          fetchPurchaseOrders();
        } else {
          showErrorMessage("Không thể xóa");
        }
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
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
          toast("Đơn hàng đã được xác nhận thành công.");
          fetchPurchaseOrders();
        } else {
          showErrorMessage("Không thể xác nhận đơn hàng.");
        }
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
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
          setPurchaseOrders(response.data);
        }
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchPurchaseOrder(searchValue);
    }
  };
  const handleRefresh = () => {
    window.location.reload();
  };
  const clearFilter = () => {
    setSearchValue("");
    const params = new URLSearchParams();
    window.history.replaceState(null, null, `?${params.toString()}`);
    fetchPurchaseOrders(); // Fetch all products again
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
                  <td>{purchaseOrder.supplier?.name}</td>
                  <td style={{ width: 1, whiteSpace: "nowrap" }}>
                    <button
                      className="btn btn-success ms-2"
                      onClick={() => handleConfirmOrder(purchaseOrder.id)}
                    >
                      Xác nhận
                    </button>
                    {/* <button
                      className="btn btn-danger ms-2"
                      onClick={() => {
                        setPurchaseOrderId(purchaseOrder.id);
                        setShowConfirmModal(true);
                      }}
                    >
                      Hủy đơn hàng
                    </button> */}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
