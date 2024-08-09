import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Table, Pagination } from "react-bootstrap";
import pricesApi from "../../apis/pricesApi";

import { format } from "date-fns";

export default function PriceAllList() {
  const [prices, setPrices] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
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
    fetchPrices(pageNumber);
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
    <div className="container my-4">
      <h2 className="text-center mb-4">Danh sách lịch sử giá</h2>
      {showError && <Alert variant="danger">{errorMessage}</Alert>}
      <Link className="btn btn-primary mb-3" to={"/prices"}>
        Giá sản phẩm
      </Link>

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
          {prices.map((price, index) => (
            <tr key={price.price_id}>
              <td>{index + 1}</td>
              <td>{price.product_detail_id?.versionName}</td>
              <td>{price.product_detail_id.version_sku}</td>
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
  );
}
