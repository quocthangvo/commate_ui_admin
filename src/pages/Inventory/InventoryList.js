// File: InventoryList.js

import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Pagination, Table } from "react-bootstrap";
import ConfirmModal from "../../components/ConfirmModal";
import inventoriesApi from "../../apis/inventoriesApi";
import productDetailsApi from "../../apis/productDetailsApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";

export default function InventoryList() {
  const [inventories, setInventories] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInventories = useCallback((page = 1, limit = 2) => {
    inventoriesApi
      .getAllInventories(page, limit)
      .then((response) => {
        setInventories(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetchInventories(currentPage);
  }, [fetchInventories, currentPage]);

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

  const searchByVersionName = (productDetailId) => {
    productDetailsApi
      .getProductDetail(productDetailId) // Assuming an API call to get product details
      .then((response) => {
        const versionName = response.data.versionName;
        inventoriesApi
          .searchVersionName(versionName)
          .then((response) => {
            if (response.status === 200) {
              setInventories(response.data.data);
            }
          })
          .catch((error) => {
            showErrorMessage(error.response.data.message);
          });
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message); // Handle error if product detail not found
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchByVersionName(searchValue);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const clearFilter = () => {
    setSearchValue("");
    const params = new URLSearchParams();
    window.history.replaceState(null, null, `?${params.toString()}`);
    fetchInventories();
  };

  return (
    <div>
      <ConfirmModal
        title="Confirm Delete"
        content="Bạn có muốn xóa không?"
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
      />
      <div className="container my-4">
        <h2 className="text-center mb-4">Kho hàng</h2>
        {showError && <Alert variant="danger">{errorMessage}</Alert>}
        <div className="row mb-3">
          <div className="col">
            <Link
              className="btn btn-primary me-1"
              to="/inventories/create"
              role="button"
            >
              Thêm kho hàng
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
              placeholder="Tìm kiếm theo productDetailId..."
              value={searchValue}
              onKeyPress={handleKeyPress}
              onChange={(e) => setSearchValue(e.target.value)}
              aria-label="Search"
              aria-describedby="basic-addon2"
            />
            <button
              className="btn search-btn"
              type="button"
              onClick={() => searchByVersionName(searchValue)}
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
              <th>Tên sản phẩm</th>
              <th>Số lượng tồn kho</th>
              <th>Số lượng tổng</th>
            </tr>
          </thead>
          <tbody>
            {inventories &&
              inventories.length > 0 &&
              inventories.map((inventory, index) => (
                <tr key={inventory.id}>
                  <td>{index + 1}</td>
                  <td>{inventory.productDetail.versionName}</td>
                  <td>{inventory.inventoryQuantity}</td>
                  <td>{inventory.quantity}</td>
                </tr>
              ))}
          </tbody>
        </Table>
        <Pagination>
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </div>
  );
}
