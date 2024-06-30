import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import purchaseOrdersApi from "../../../../apis/purchaseOrders";
import suppliersApi from "../../../../apis/suppliersApi";
import "../../../../css/CreateProduct.css";
import { purchaseOrderSchema } from "../../../../validations/purchaseOrderSchema";
import { FormCheck, Table } from "react-bootstrap";
import productDetailsApi from "../../../../apis/productDetailsApi";
import "../../../../css/PurchaseOrder.css";

export default function CreatePurchaseOrder() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);

  const [messageError, setMessageError] = useState("");

  const [productDetails, setProductDetails] = useState([]);

  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const fetchProductDetails = useCallback(() => {
    productDetailsApi
      .getAllProductDetails()
      .then((response) => {
        setProductDetails(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(purchaseOrderSchema),
    defaultValues: {
      role_id: "2", // Set default value for role here
    },
  });

  useEffect(() => {
    suppliersApi.getAllSuppliers().then((response) => {
      setSuppliers(response.data.data);
    });
  }, []);

  const onSubmit = handleSubmit((data) => {
    purchaseOrdersApi
      .createPurchaseOrder(data)
      .then((response) => {
        if (response.status === 200) {
          toast(response.data.message);
          navigate(-1);
        }
      })
      .catch((error) => {
        setMessageError(error.response.data.message);
      });
  });

  const [quantity, setQuantity] = useState(1); // Giá trị mặc định là 1

  // Hàm xử lý khi thay đổi số lượng từ input
  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10); // Lấy giá trị nhập vào và chuyển thành số nguyên
    setQuantity(newQuantity);
  };

  // Hàm xử lý khi nhấn nút cộng số lượng
  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // Hàm xử lý khi nhấn nút trừ số lượng
  const decrementQuantity = () => {
    if (quantity > 0) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };
  return (
    <div>
      <Link className="btn btn-link " onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} className="icon-size " />
      </Link>
      <div className="row">
        <div className="col-md-6">
          <form className="form-container" onSubmit={onSubmit}>
            <h2 className="form-header">Đặt đơn hàng</h2>
            {messageError && (
              <div className="alert alert-danger" role="alert">
                {messageError}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="supplier_id">
                Nhà cung cấp:
              </label>
              <select
                {...register("supplier_id")}
                className={`form-select ${
                  errors.supplier_id ? "is-invalid" : ""
                }`}
              >
                <option value="">-- Chọn nhà cung cấp --</option>
                {suppliers.length > 0 &&
                  suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
              </select>
              <div className="invalid-feedback">
                {errors.supplier_id?.message}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="role_id">
                Người đặt hàng:
              </label>
              <input
                {...register("role_id")}
                className="form-input"
                value="Admin"
                defaultValue="2"
                disabled
              />
              <div className="invalid-feedback">{errors.role_id?.message}</div>
            </div>

            <div className="text-end mt-5">
              <button
                type="button"
                className="btn btn-secondary px-4 me-2"
                onClick={() => navigate(-1)}
              >
                Hủy
              </button>
              <button type="submit" className="btn btn-primary  px-5">
                Lưu
              </button>
            </div>
          </form>
        </div>

        <div className="col-md-6"></div>
        <div className="">
          <h3 className="text-center mt-5">Chi tiết sản phẩm</h3>
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
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
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
                  <td>{productDetail.product?.name}</td>
                  <td>
                    <img
                      src={productDetail.product?.image}
                      alt="images"
                      style={{ maxWidth: "100px", maxHeight: "100px" }}
                    />
                  </td>
                  <td>{productDetail.color.name}</td>
                  <td>{productDetail.size.name}</td>
                  <td>{productDetail.price?.name}</td>
                  <td>
                    <div className="product-quantity">
                      <button
                        className="quantity-button"
                        onClick={decrementQuantity}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="quantity-field"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="0"
                      />
                      <button
                        className="quantity-button"
                        onClick={incrementQuantity}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{}</td>
                  <td>X</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
