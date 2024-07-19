import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Table, Pagination } from "react-bootstrap";
import pricesApi from "../../apis/pricesApi";
import { toast } from "react-toastify";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";

export default function PriceAllList() {
  const [prices, setPrices] = useState([]);
  const [priceId, setPriceId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPrices = useCallback((page = 1, limit = 5) => {
    pricesApi
      .getAllPrices(page, limit)
      .then((response) => {
        setPrices(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
        setShowError(false);
      })
      .catch((error) => {
        console.error("Error fetching prices:", error);
        showErrorMessage("Failed to fetch prices.");
      });
  }, []);

  useEffect(() => {
    fetchPrices(currentPage);
  }, [fetchPrices, currentPage]);

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setErrorMessage("");
    }, 3000);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Danh sách giá</h2>
      {showError && <Alert variant="danger">{errorMessage}</Alert>}
      <Link className="btn btn-primary mb-3" to={"/prices"}>
        Giá sản phẩm
      </Link>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Giá bán</th>
            <th>Giá khuyến mãi</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((price, index) => (
            <tr key={price.price_id}>
              <td>{index + 1}</td>
              <td>{price.product_detail?.versionName}</td>
              <td>{formatCurrency(price?.price_selling)}</td>
              <td>{formatCurrency(price?.promotion_price)}</td>
              <td>{formatDate(price?.start_date)}</td>
              <td>{formatDate(price?.end_date)}</td>
              <td>
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
  );
}
