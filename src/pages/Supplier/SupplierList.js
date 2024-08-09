import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Alert, Pagination, Table } from "react-bootstrap";
import ConfirmModal from "../../components/ConfirmModal";
import { toast } from "react-toastify";
import suppliersApi from "../../apis/suppliersApi";
import "../../css/Pagination.css";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [supplierId, setSupplierId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSuppliers = useCallback((page = 1, limit = 5) => {
    suppliersApi
      .getAllSuppliers(page, limit)
      .then((response) => {
        setSuppliers(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetchSuppliers(currentPage);
  }, [fetchSuppliers, currentPage]);

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

  const searchNameSupllier = (name) => {
    const params = new URLSearchParams();
    params.append("search", name);
    window.history.replaceState(null, null, `?${params.toString()}`);
    suppliersApi
      .searchSupplier(name)
      .then((response) => {
        if (response.status === 200) {
          setSuppliers(response.data.data);
        }
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
      });
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchNameSupllier(searchValue);
    }
  };
  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setErrorMessage("");
    }, 3000); // 3 giây
  };

  const clearFilter = () => {
    setSearchValue("");
    const params = new URLSearchParams();
    window.history.replaceState(null, null, `?${params.toString()}`);
    fetchSuppliers();
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
              onClick={() => searchNameSupllier(searchValue)}
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
                  <td>{supplier?.phoneNumber}</td>
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
        <Pagination>
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </div>
  );
}
