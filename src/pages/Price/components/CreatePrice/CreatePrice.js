import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFilter,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { FormCheck, Table } from "react-bootstrap";
import pricesApi from "../../../../apis/pricesApi";
import productDetailsApi from "../../../../apis/productDetailsApi";
import inventoriesApi from "../../../../apis/inventoriesApi";
import { createPriceSchema } from "../../../../validations/priceSchema";
import errorImage from "../../../../assets/img/error/error_image.png";

export default function CreatePrice() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [messageError, setMessageError] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { handleSubmit } = useForm({
    resolver: yupResolver(createPriceSchema),
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchValue = params.get("search");
    if (searchValue) {
      setSearchValue(searchValue);
      searchProduct(searchValue);
    }
  }, []);

  const onSubmit = handleSubmit(async () => {
    if (selectedProductIds.length > 0) {
      const promises = selectedProducts.map((product) =>
        pricesApi.createPrice({
          product_detail_id: product.id,
          price_selling: product.priceSelling || null,
          promotion_price: product.promotionPrice || null,
          start_date: product.startDate || null,
          end_date: product.endDate || null,
        })
      );

      try {
        const responses = await Promise.all(promises);
        const successResponses = responses.filter((res) => res.status === 200);
        if (successResponses.length > 0) {
          toast.success("Thêm giá thành công!");
          navigate(-1);
        } else {
          toast.error("Thêm giá không thành công!");
        }
      } catch (error) {
        setMessageError(error.response.data.message);
      }
    } else {
      setMessageError("Vui lòng chọn ít nhất một sản phẩm để thêm giá.");
    }
  });

  const searchProduct = async (versionName) => {
    const params = new URLSearchParams();
    params.append("search", versionName);
    window.history.replaceState(null, null, `?${params.toString()}`);

    try {
      const productDetailsResponse =
        await productDetailsApi.searchProductDetail(versionName);

      if (productDetailsResponse.status === 200) {
        const products = productDetailsResponse.data.data;
        const inventoryPromises = products.map((product) =>
          inventoriesApi.getProductDetailId(product.id)
        );

        const inventoryResponses = await Promise.all(inventoryPromises);

        const filteredProducts = products.filter((product, index) => {
          const inventoryData = inventoryResponses[index];
          return (
            inventoryData.status === 200 && inventoryData.data.data.length > 0
          );
        });

        setProductDetails(filteredProducts);
        setShowSearchResults(true);
      }
    } catch (error) {
      setMessageError(error.response?.data?.message || "Đã xảy ra lỗi.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchProduct(searchValue);
    }
  };

  const clearFilter = () => {
    setSearchValue("");
    const params = new URLSearchParams();
    window.history.replaceState(null, null, `?${params.toString()}`);
    setProductDetails([]);
    setShowSearchResults(false);
  };

  const toggleSelectProduct = (product) => {
    if (selectedProductIds.includes(product.id)) {
      setSelectedProductIds((prevSelected) =>
        prevSelected.filter((id) => id !== product.id)
      );
      setSelectedProducts((prevSelected) =>
        prevSelected.filter((p) => p.id !== product.id)
      );
    } else {
      // Fetch the cost price from the inventory API
      inventoriesApi
        .getProductDetailId(product.id)
        .then((response) => {
          if (response.status === 200 && response.data.data.length > 0) {
            const inventory = response.data.data[0];
            const updatedProduct = { ...product, costPrice: inventory.price };

            setSelectedProductIds((prevSelected) => [
              ...prevSelected,
              product.id,
            ]);
            setSelectedProducts((prevSelected) => [
              ...prevSelected,
              updatedProduct,
            ]);
          }
        })
        .catch((error) => {
          setMessageError(error.response.data.message);
        });
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

  const handleProductPriceChange = (productId, field, value) => {
    const updatedProducts = selectedProducts.map((product) =>
      product.id === productId
        ? { ...product, [field]: parseFloat(value) || null }
        : product
    );
    setSelectedProducts(updatedProducts);
  };

  const handleProductDateChange = (productId, field, value) => {
    const updatedProducts = selectedProducts.map((product) =>
      product.id === productId
        ? { ...product, [field]: value || null }
        : product
    );
    setSelectedProducts(updatedProducts);
  };

  return (
    <div>
      <Link className="btn btn-link" to={"/prices"}>
        <FontAwesomeIcon icon={faArrowLeft} className="icon-size" />
      </Link>
      <div className="">
        <h3 className="text-center mt-5">Tạo giá bán</h3>
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
              <th></th>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Mã sku</th>
            </tr>
          </thead>
          {showSearchResults && (
            <tbody>
              {productDetails.map((productDetail, index) => (
                <tr key={productDetail.id}>
                  <td>
                    <FormCheck
                      type="checkbox"
                      checked={selectedProductIds.includes(productDetail.id)}
                      onChange={() => toggleSelectProduct(productDetail)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={
                        productDetail.images && productDetail.images.length > 0
                          ? `http://localhost:8080/uploads/${productDetail.images[0]}`
                          : errorImage
                      }
                      style={{ width: "50px", height: "50px" }}
                      alt="images"
                    />
                  </td>
                  <td>{productDetail.version_name}</td>
                  <td>{productDetail.version_sku}</td>
                </tr>
              ))}
            </tbody>
          )}
        </Table>
      </div>
      <form className="form-container" onSubmit={onSubmit}>
        {messageError && (
          <div className="alert alert-danger" role="alert">
            {messageError}
          </div>
        )}
        <div className="form-group">
          <h4>Sản phẩm đã chọn</h4>
          {selectedProducts.length > 0 && (
            <Table bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá nhập hàng</th>
                  <th>Giá bán</th>
                  <th>Giá khuyến mãi</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={
                          product.images && product.images.length > 0
                            ? `http://localhost:8080/uploads/${product.images[0]}`
                            : errorImage
                        }
                        style={{ width: "50px", height: "50px" }}
                        alt="images"
                      />
                    </td>
                    <td>{product.version_name}</td>
                    <td>{product.costPrice ? product.costPrice : "N/A"}</td>
                    <td>
                      <input
                        type="number"
                        className="input-field"
                        value={product.priceSelling || ""}
                        onChange={(e) =>
                          handleProductPriceChange(
                            product.id,
                            "priceSelling",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="input-field"
                        value={product.promotionPrice || ""}
                        onChange={(e) =>
                          handleProductPriceChange(
                            product.id,
                            "promotionPrice",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={product.startDate || ""}
                        onChange={(e) =>
                          handleProductDateChange(
                            product.id,
                            "startDate",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={product.endDate || ""}
                        onChange={(e) =>
                          handleProductDateChange(
                            product.id,
                            "endDate",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td className="action">
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
          )}
        </div>
        <div className="mt-5 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-secondary px-4 me-2"
            onClick={() => navigate("/prices")}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="btn btn-primary px-4"
            disabled={selectedProducts.length === 0}
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}
