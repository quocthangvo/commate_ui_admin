import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Alert, Button, Table } from "react-bootstrap";
import ConfirmModal from "../../components/ConfirmModal";
import { toast } from "react-toastify";
import suppliersApi from "../../apis/suppliersApi";

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [supplierId, setSupplierId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const fetchSuppliers = () => {
    suppliersApi
      .getAllSuppliers()
      .then((response) => {
        setSuppliers(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = () => {
    suppliersApi
      .deleteSupplier(supplierId)
      .then((response) => {
        if (response.status === 200) {
          toast(response.data.message);
          fetchSuppliers();
        }
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
      })
      .finally(() => {
        setShowConfirmModal(false);
        setSupplierId(null);
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
        title="Xác nhận xóa"
        content="Bạn có muốn xóa không?"
        onClick={handleDelete}
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
      />
      <div className="container my-4">
        <h2 className="text-center mb-4">Nhà cung cấp</h2>
        {showError && <Alert variant="danger">{errorMessage}</Alert>}
        <div className="row mb-3">
          <div className="col">
            <Link
              className="btn btn-primary me-1"
              to="/suppliers/create"
              role="button"
            >
              Thêm nhà cung cấp
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
              <th>Nhà cung cấp</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {suppliers &&
              suppliers.length > 0 &&
              suppliers.map((supplier, index) => (
                <tr key={supplier.id}>
                  <td>{index + 1}</td>
                  <td>{supplier?.name}</td>
                  <td>{supplier?.phone_number}</td>
                  <td>{supplier?.address}</td>
                  <td style={{ width: 1, whiteSpace: "nowrap" }}>
                    <Link
                      className="btn btn-success btn-sm me-1"
                      to={`/suppliers/${supplier.id}`}
                    >
                      Chỉnh sửa
                    </Link>
                    <button
                      className="btn btn-danger ms-2"
                      onClick={() => {
                        setSupplierId(supplier.id);
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
