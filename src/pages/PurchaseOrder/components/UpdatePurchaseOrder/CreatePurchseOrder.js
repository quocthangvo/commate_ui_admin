import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFilter,
  faSearch,
  faShoppingCart,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import purchaseOrdersApi from "../../../../apis/purchaseOrders";
import suppliersApi from "../../../../apis/suppliersApi";
import productDetailsApi from "../../../../apis/productDetailsApi";
import { purchaseOrderSchema } from "../../../../validations/purchaseOrderSchema";
import { FormCheck, Table } from "react-bootstrap";
import "../../../../css/CreateProduct.css";
import "../../../../css/PurchaseOrder.css";

export default function CreatePurchaseOrder() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [messageError, setMessageError] = useState("");
  const [productDetails, setProductDetails] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]); // State to store selected products
  const [searchValue, setSearchValue] = useState("");
  const [quantityMap, setQuantityMap] = useState({}); // State to store quantity for each product
  const [showSearchResults, setShowSearchResults] = useState(false); // State to control displaying search results

  const location = useLocation();

  const fetchProductDetails = useCallback((search = "") => {
    if (search !== "") {
      searchProduct(search);
    } else {
      productDetailsApi
        .getAllProductDetails()
        .then((response) => {
          setProductDetails(response.data.data);
          setShowSearchResults(false); // Reset to show full product list
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const toggleSelectProduct = (product) => {
    setSelectedProductIds((prevSelected) =>
      prevSelected.includes(product.id)
        ? prevSelected.filter((id) => id !== product.id)
        : [...prevSelected, product.id]
    );
    setSelectedProducts((prevSelected) =>
      prevSelected.find((p) => p.id === product.id)
        ? prevSelected.filter((p) => p.id !== product.id)
        : [...prevSelected, product]
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search") || "";
    setSearchValue(searchParam);
    fetchProductDetails(searchParam); // Fetch products based on initial URL params
  }, [location.search, fetchProductDetails]); // Include fetchProductDetails here

  const onSubmit = handleSubmit((data) => {
    data.products = selectedProducts.map((product) => ({
      product_id: product.id,
      quantity: quantityMap[product.id] || 1,
    }));

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

  const searchProduct = (name) => {
    const params = new URLSearchParams();
    params.append("search", name);
    window.history.replaceState(null, null, `?${params.toString()}`);
    productDetailsApi
      .searchProductDetail(name)
      .then((response) => {
        if (response.status === 200) {
          setProductDetails(response.data);
          setShowSearchResults(true); // Show search results
        }
      })
      .catch((error) => {
        setMessageError(error.response.data.message);
      });
  };

  const clearFilter = () => {
    setSearchValue("");
    const params = new URLSearchParams();
    window.history.replaceState(null, null, `?${params.toString()}`);
    fetchProductDetails(); // Fetch all products again
    setShowSearchResults(false); // Reset to show full product list
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantityMap((prevMap) => ({
      ...prevMap,
      [productId]: newQuantity,
    }));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchProduct(searchValue);
    }
  };

  const removeSelectedProduct = (productId) => {
    setSelectedProductIds((prevSelected) =>
      prevSelected.filter((id) => id !== productId)
    );
    setSelectedProducts((prevSelected) =>
      prevSelected.filter((p) => p.id !== productId)
    );
  };

  return (
    <div>
      <Link className="btn btn-link" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} className="icon-size" />
      </Link>
      <div className="">
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
            <label className="form-label" htmlFor="note">
              Ghi chú:
            </label>
            <textarea
              {...register("note")}
              className="form-input"
              style={{ height: "100px" }}
            />
            <div className="invalid-feedback">{errors.note?.message}</div>
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

          <div className="form-group">
            <h3 className="form-header">Sản phẩm đã chọn</h3>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên sản phẩm</th>
                  <th>Hình ảnh</th>
                  <th>Màu sắc</th>
                  <th>Kích thước</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>{product.product?.name}</td>
                    <td>
                      <img
                        src={product.product?.image}
                        alt="images"
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    </td>
                    <td>{product.color.name}</td>
                    <td>{product.size.name}</td>
                    <td>100.000</td>
                    <td>
                      <input
                        type="number"
                        className="quantity-field"
                        value={quantityMap[product.id] || 1}
                        onChange={(e) =>
                          handleQuantityChange(
                            product.id,
                            parseInt(e.target.value, 10)
                          )
                        }
                        min="1"
                      />
                    </td>
                    <td>{(quantityMap[product.id] || 1) * 100000}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeSelectedProduct(product.id)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="text-end">
            <button
              type="button"
              className="btn btn-secondary px-4 me-2"
              onClick={() => navigate(-1)}
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
              Đặt hàng
            </button>
          </div>
        </form>
      </div>
      <div className="">
        <h3 className="text-center mt-5">Chi tiết sản phẩm</h3>
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
              onClick={() => searchProduct(searchValue)}
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
              <th>
                <FormCheck
                  checked={selectedProductIds.length === productDetails.length}
                />
              </th>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Hình ảnh</th>
              <th>Màu sắc</th>
              <th>Kích thước</th>

              <th>Thành tiền</th>
            </tr>
          </thead>
          {showSearchResults && (
            <tbody>
              {productDetails.map((productDetail, index) => (
                <tr key={productDetail.id}>
                  <td>
                    <FormCheck
                      checked={selectedProductIds.includes(productDetail.id)}
                      onChange={() => toggleSelectProduct(productDetail)}
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
                  <td>100.000</td>
                </tr>
              ))}
            </tbody>
          )}
        </Table>
      </div>
    </div>
  );
}
