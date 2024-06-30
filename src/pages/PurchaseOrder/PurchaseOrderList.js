import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Table } from "react-bootstrap";

import ConfirmModal from "../../components/ConfirmModal";
import { toast } from "react-toastify";
import purchaseOrdersApi from "../../apis/purchaseOrders";

export default function PurchaseOrderList() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [purchaseOrderId, setPurchaseOrderId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

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
        <h2 className="text-center mb-4">Purchase Orders</h2>
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
                  <td>{purchaseOrder.code}</td>
                  <td>{purchaseOrder.orderDate}</td>
                  <td>{purchaseOrder.shippingDate}</td>
                  <td>{purchaseOrder.status}</td>
                  <td>{purchaseOrder.supplier_name}</td>
                  <td style={{ width: 1, whiteSpace: "nowrap" }}>
                    <Link
                      className="btn btn-success btn-sm me-1"
                      to={`/purchase-orders/${purchaseOrder.id}`}
                    >
                      Chỉnh sửa
                    </Link>
                    <button
                      className="btn btn-danger ms-2"
                      onClick={() => {
                        setPurchaseOrderId(purchaseOrder.id);
                        setShowConfirmModal(true);
                      }}
                    >
                      Xóa
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
