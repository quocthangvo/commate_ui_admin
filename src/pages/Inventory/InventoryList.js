import React, { useCallback, useEffect, useState } from "react";
import { Alert, Pagination, Table } from "react-bootstrap";
import ConfirmModal from "../../components/ConfirmModal";
import inventoriesApi from "../../apis/inventoriesApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import errorImage from "../../assets/img/error/error_image.png";

// Debounce function
const debounce = (func, delay) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => func(...args), delay);
  };
};

export default function InventoryList() {
  const [inventories, setInventories] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch inventories or search results
  const fetchInventories = useCallback((page = 1, limit = 5) => {
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

  const searchInventories = useCallback(
    (page = 1, limit = 5) => {
      inventoriesApi
        .searchInventoriesByVersionName(searchValue, page, limit)
        .then((response) => {
          setInventories(response.data.data.content);
          setTotalPages(response.data.data.totalPages);
        })
        .catch((error) => {
          showErrorMessage(error.response.data.message);
        });
    },
    [searchValue]
  );

  // Debounced version of searchInventories
  const debouncedSearch = useCallback(
    debounce((page = 1, limit = 5) => {
      searchInventories(page, limit);
    }, 500), // 300ms debounce delay
    [searchInventories] // Add searchInventories as dependency
  );

  useEffect(() => {
    if (isSearching) {
      debouncedSearch(currentPage);
    } else {
      fetchInventories(currentPage);
    }
  }, [fetchInventories, debouncedSearch, currentPage, isSearching]);

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setErrorMessage("");
    }, 3000); // 3 seconds
  };

  const searchByVersionName = () => {
    setIsSearching(true);
    debouncedSearch(); // Use debounced search
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchByVersionName();
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (isSearching) {
      debouncedSearch(pageNumber);
    } else {
      fetchInventories(pageNumber);
    }
  };

  const clearFilter = () => {
    setSearchValue("");
    setIsSearching(false);
    const params = new URLSearchParams();
    window.history.replaceState(null, null, `?${params.toString()}`);
    fetchInventories(); // Fetch first page of inventories
  };

  const generatePageItems = () => {
    const pages = [];
    const maxPagesToShow = 5; // Number of pages to show at once

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer pages than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
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
      // Show pages with ellipses
      if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
        // Show pages from the beginning
        for (let i = 1; i <= maxPagesToShow - 1; i++) {
          pages.push(
            <Pagination.Item
              key={i}
              active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Pagination.Item>
          );
        }
        pages.push(<Pagination.Ellipsis key="ellipsis-start" />);
        pages.push(
          <Pagination.Item
            key={totalPages}
            active={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </Pagination.Item>
        );
      } else if (currentPage >= totalPages - Math.floor(maxPagesToShow / 2)) {
        // Show pages from the end
        pages.push(
          <Pagination.Item
            key={1}
            active={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </Pagination.Item>
        );
        pages.push(<Pagination.Ellipsis key="ellipsis-end" />);
        for (let i = totalPages - (maxPagesToShow - 2); i <= totalPages; i++) {
          pages.push(
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
        // Show a range of pages around the current page
        pages.push(
          <Pagination.Item
            key={1}
            active={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </Pagination.Item>
        );
        pages.push(<Pagination.Ellipsis key="ellipsis-start" />);
        for (
          let i = currentPage - Math.floor(maxPagesToShow / 2);
          i <= currentPage + Math.floor(maxPagesToShow / 2);
          i++
        ) {
          pages.push(
            <Pagination.Item
              key={i}
              active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Pagination.Item>
          );
        }
        pages.push(<Pagination.Ellipsis key="ellipsis-end" />);
        pages.push(
          <Pagination.Item
            key={totalPages}
            active={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </Pagination.Item>
        );
      }
    }

    return pages;
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

        <div className="d-flex mb-3">
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
              onClick={searchByVersionName}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <div className="form-gr ms-2">
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
              <th>Hình ảnh</th>
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
                  <td>
                    <img
                      src={
                        inventory.productDetail.images &&
                        inventory.productDetail.images.length > 0
                          ? `http://localhost:8080/uploads/${inventory.productDetail.images[0]}`
                          : errorImage
                      }
                      style={{ width: "50px", height: "50px" }}
                      alt="images"
                    />
                  </td>
                  <td>{inventory.productDetail.version_name}</td>
                  <td>{inventory.inventoryQuantity}</td>
                  <td>{inventory.quantity}</td>
                </tr>
              ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-end">
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
    </div>
  );
}
