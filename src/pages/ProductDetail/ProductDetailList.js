import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Table } from "react-bootstrap";
import productDetailsApi from "../../apis/productDetailsApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";

export default function ProductDetailList() {
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const [productDetails, setProductDetails] = useState([]); // lưu sp
  const [productDetailId, setProductDetailId] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const { setValue } = useForm();

  useEffect(() => {
    fetchProductDetails(); // dùng để trả load lại trang khi thực hiện hđ
  }, []);

  const fetchProductDetails = () => {
    productDetailsApi
      .getByProductId(productId)
      .then((response) => {
        setProductDetails(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (productDetails.length > 0) {
      //detail > id 0, thiết lập các trường
      setValue("name", productDetails[0]?.product?.name || "");
      setValue("size", productDetails[0]?.size?.name);
      setValue("color", productDetails[0]?.color?.name);
    }
  }, [productDetails, setValue]);

  const handleDelete = () => {
    productDetailsApi
      .deleteProductDetail(productDetailId)
      .then((response) => {
        if (response.status === 200) {
          fetchProductDetails();
          toast.success(response.data.message);
        }
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
      })
      .finally(() => {
        setShowConfirmModal(false);
        setProductDetailId(null);
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
      <div className="container my-3">
        <Link className="btn btn-link" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} className="icon-size" />
        </Link>
        <h2 className="text-center mb-4">Chi tiết sản phẩm</h2>
        {showError && <Alert variant="danger">{errorMessage}</Alert>}

        <div className="row mb-3">
          <div className="col">
            <Button variant="outline-primary" onClick={handleRefresh}>
              Refresh
            </Button>
          </div>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Hình ảnh</th>
              <th>Màu sắc</th>
              <th>Kích thước</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {productDetails &&
              productDetails.length > 0 &&
              productDetails.map((productDetail, index) => (
                <tr key={productDetail.id}>
                  <td>{index + 1}</td>
                  <td>{productDetail.product.name}</td>
                  <td>
                    <img
                      src={productDetail.product.image}
                      alt="images"
                      style={{ maxWidth: "100px", maxHeight: "100px" }}
                    />
                  </td>
                  <td>{productDetail.color.name}</td>
                  <td>{productDetail.size.name}</td>
                  <td style={{ width: 1, whiteSpace: "nowrap" }}>
                    <Link
                      to={`/productDetails/${productDetail.id}`}
                      className="btn btn-success btn-sm me-1"
                    >
                      Chỉnh sửa
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setProductDetailId(productDetail.id);
                        setShowConfirmModal(true);
                      }}
                      showErrorMessage
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
