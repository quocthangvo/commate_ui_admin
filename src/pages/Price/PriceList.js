import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import pricesApi from "../../apis/pricesApi";
import ConfirmModal from "../../components/ConfirmModal";
import { Alert, Pagination, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PriceList() {
  const [prices, setPrices] = useState([]);
  const [priceId, setPriceId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const fetchPrices = useCallback((page = 1, limit = 5) => {
    pricesApi
      .getAllPriceDistinct(page, limit)
      .then((response) => {
        setPrices(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const searchVersionName = useCallback((versionName, page = 1, limit = 5) => {
    pricesApi
      .searchPricesByVersionName(versionName, page, limit)
      .then((response) => {
        if (response.status === 200) {
          setPrices(response.data.data.content);
          setTotalPages(response.data.data.totalPages);
          setCurrentPage(page);
        }
      })
      .catch((error) => {
        showErrorMessage("Error fetching search results.");
      });
  }, []);

  const handleDelete = () => {
    pricesApi
      .deletePrice(priceId)
      .then((response) => {
        if (response.status === 200) {
          toast(response.data.message);
          if (searchPerformed) {
            searchVersionName(searchValue, currentPage); // Fetch current page after deletion
          } else {
            fetchPrices(currentPage); // Fetch current page after deletion
          }
        } else {
          showErrorMessage("Cannot delete.");
        }
      })
      .catch((error) => {
        showErrorMessage("Error deleting price.");
      })
      .finally(() => {
        setShowConfirmModal(false);
        setPriceId(null);
      });
  };

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setErrorMessage("");
    }, 3000); // 3 seconds
  };

  const formatDate = (date) => {
    if (!date) return "Vĩnh viễn";
    return format(new Date(date), "dd/MM/yyyy HH:mm");
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      performSearch();
    }
  };

  const performSearch = () => {
    if (searchValue.trim()) {
      setSearchPerformed(true);
      searchVersionName(searchValue.trim().toLowerCase(), 1); // Reset to first page on search
    }
  };

  const clearFilter = () => {
    setSearchValue("");
    setSearchPerformed(false);
    fetchPrices(currentPage); // Fetch default prices
  };

  const generatePageItems = () => {
    const pages = [];
    const maxPagesToShow = 4; // Number of pages to show at once

    if (totalPages <= maxPagesToShow) {
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
      if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
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

  useEffect(() => {
    if (searchPerformed) {
      searchVersionName(searchValue, currentPage);
    } else {
      fetchPrices(currentPage);
    }
  }, [
    currentPage,
    fetchPrices,
    searchPerformed,
    searchValue,
    searchVersionName,
  ]);

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
        <h2 className="text-center mb-4">Giá sản phẩm</h2>
        {showError && <Alert variant="danger">{errorMessage}</Alert>}

        <div className="row mb-3">
          <div className="col">
            <Link
              className="btn btn-primary me-2"
              to="/prices/create"
              role="button"
            >
              Thêm giá
            </Link>
            <Link
              className="btn btn-outline-primary me-2"
              to="/prices/allPrices"
            >
              Lịch sử tạo giá
            </Link>
          </div>
        </div>
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
              onClick={performSearch}
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
              <th>Tên sản phẩm</th>
              <th>Mã sku</th>
              <th>Giá bán</th>
              <th>Giá khuyến mãi</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {prices &&
              prices.length > 0 &&
              prices.map((price, index) => (
                <tr key={price.id}>
                  <td>{index + 1}</td>
                  <td>{price.product_detail_id?.versionName}</td>
                  <td>{price.product_detail_id.version_sku}</td>
                  <td>{formatCurrency(price?.price_selling)}</td>
                  <td>{formatCurrency(price?.promotion_price)}</td>
                  <td>{formatDate(price?.start_date)}</td>
                  <td>{formatDate(price?.end_date)}</td>
                  <td style={{ width: 1, whiteSpace: "nowrap" }}>
                    <Link
                      className="btn btn-success btn-sm me-1"
                      to={`/prices/update/${price.price_id}`}
                    >
                      Chỉnh sửa
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>

        <Pagination>
          <Pagination.Prev
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          />
          {generatePageItems()}
          <Pagination.Next
            onClick={() =>
              currentPage < totalPages && handlePageChange(currentPage + 1)
            }
          />
        </Pagination>
      </div>
    </div>
  );
}
