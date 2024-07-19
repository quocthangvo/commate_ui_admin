import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import pricesApi from "../../apis/pricesApi";
import ConfirmModal from "../../components/ConfirmModal";
import { Alert, Button, Pagination, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { format } from "date-fns";
export default function PriceList() {
  const [prices, setPrices] = useState([]);
  const [priceId, setPriceId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  useEffect(() => {
    fetchPrices(currentPage);
  }, [fetchPrices, currentPage]);

  const handleDelete = () => {
    pricesApi
      .deletePrice(priceId)
      .then((response) => {
        if (response.status === 200) {
          toast(response.data.message);
          fetchPrices();
        } else {
          showErrorMessage("Không thể xóa");
        }
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
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
    }, 3000); // 3 giây
  };

  const handleRefresh = () => {
    window.location.reload();
  };
  //format ngày
  const formatDate = (date) => {
    if (!date) return "Vĩnh viễn";
    return format(new Date(date), "dd/MM/yyyy HH:mm");
  };
  //format giá
  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
            {prices &&
              prices.length > 0 &&
              prices.map((price, index) => (
                <tr key={price.id}>
                  <td>{index + 1}</td>
                  <td>{price.product_detail?.versionName}</td>
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
