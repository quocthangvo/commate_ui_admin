import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Table, FormCheck } from "react-bootstrap";
import productDetailsApi from "../../apis/productDetailsApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";

export default function ProductDetailList() {
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const [productDetails, setProductDetails] = useState([]);

  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const { setValue } = useForm();

  const fetchProductDetails = useCallback(() => {
    productDetailsApi
      .getByProductId(productId)
      .then((response) => {
        setProductDetails(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [productId]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  useEffect(() => {
    if (productDetails.length > 0) {
      setValue("name", productDetails[0]?.product?.name || "");
      setValue("size", productDetails[0]?.size?.name);
      setValue("color", productDetails[0]?.color?.name);
    }
  }, [productDetails, setValue]);

  const handleDelete = () => {
    Promise.all(
      selectedProductIds.map((id) => productDetailsApi.deleteProductDetail(id))
    )
      .then((responses) => {
        const allSuccessful = responses.every(
          (response) => response.status === 200
        );
        if (allSuccessful) {
          setProductDetails((prevDetails) =>
            prevDetails.filter(
              (detail) => !selectedProductIds.includes(detail.id) // xóa sp cuối trả về rỗng
            )
          );
          toast.success("Selected products deleted successfully.");
        }
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
      })
      .finally(() => {
        setShowConfirmModal(false);
        setSelectedProductIds([]);
      });
  };

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setErrorMessage("");
    }, 3000);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const toggleSelectProduct = (productId) => {
    setSelectedProductIds(
      (prevSelected) =>
        prevSelected.includes(productId)
          ? prevSelected.filter((id) => id !== productId)
          : [...prevSelected, productId]
      //chọn xóa theo id
    );
  };

  const toggleSelectAllProducts = () => {
    setSelectedProductIds(
      (prevSelected) =>
        prevSelected.length === productDetails.length
          ? []
          : productDetails.map((product) => product.id)
      //chọn xóa all
    );
  };

  return (
    <div>
      <ConfirmModal
        title="Confirm Delete"
        content="Bạn có muốn xóa các sản phẩm đã chọn không?"
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
        {productDetails.length === 0 ? (
          <p className="text-center">Không có chi tiết sản phẩm nào.</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>
                  <FormCheck
                    checked={
                      selectedProductIds.length === productDetails.length
                    }
                    onChange={toggleSelectAllProducts}
                  />
                </th>
                <th>ID</th>
                <th>Tên sản phẩm</th>
                <th>Hình ảnh</th>
                <th>Màu sắc</th>
                <th>Kích thước</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {productDetails.map((productDetail, index) => (
                <tr key={productDetail.id}>
                  <td>
                    <FormCheck
                      checked={selectedProductIds.includes(productDetail.id)}
                      onChange={() => toggleSelectProduct(productDetail.id)}
                    />
                  </td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {selectedProductIds.length > 0 && (
          <Button
            variant="danger"
            className="mt-3"
            onClick={() => setShowConfirmModal(true)}
          >
            Xóa các sản phẩm đã chọn
          </Button>
        )}
      </div>
    </div>
  );
}
