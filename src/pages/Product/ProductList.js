import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Alert, Button, Table } from "react-bootstrap";
import productsApi from "../../apis/productsApi";
import ConfirmModal from "../../components/ConfirmModal";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import "../../css/ProductList.css";
import { useForm } from "react-hook-form";
import categoriesApi from "../../apis/categoriesApi";
import errorImage from "../../uploads/error_image.png";

export default function ProductList() {
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [categoryId, setCategoryId] = useState(""); // Ensure this is a string
  const [categories, setCategories] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const {
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search") || "";
    const categoryParam = params.get("category") || "";
    setSearchValue(searchParam);
    setCategoryId(categoryParam);
    fetchProducts(searchParam, categoryParam); // Fetch products based on initial URL params
    fetchCategories();
  }, [location.search]);

  const fetchProducts = (search = "", category = "") => {
    // Fetch products based on search and category params
    if (search !== "" || category !== "") {
      if (search !== "") {
        searchProduct(search);
      } else {
        findByCategoryId(category);
      }
    } else {
      // Fetch all products if no params are provided
      productsApi
        .getAllProducts()
        .then((response) => {
          setProducts(response.data.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const fetchCategories = () => {
    categoriesApi.getAllCategories().then((response) => {
      setCategories(response.data.data);
    });
  };

  const handleDelete = () => {
    productsApi
      .deleteProduct(productId)
      .then((response) => {
        if (response.status === 200) {
          fetchProducts(searchValue, categoryId); // Re-fetch products after deletion
          toast.success(response.data.message);
        } else {
          showErrorMessage("Không thể xóa");
        }
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
      })
      .finally(() => {
        setShowConfirmModal(false);
        setProductId(null);
      });
  };

  const searchProduct = (name) => {
    const params = new URLSearchParams();
    params.append("search", name);
    window.history.replaceState(null, null, `?${params.toString()}`);
    productsApi
      .searchProduct(name)
      .then((response) => {
        if (response.status === 200) {
          setProducts(response.data);
        }
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
      });
  };

  const findByCategoryId = (categoryId) => {
    const params = new URLSearchParams();
    params.append("category", categoryId);
    window.history.replaceState(null, null, `?${params.toString()}`);
    productsApi
      .findByCategoryId(categoryId)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.data.length > 0) {
            setProducts(response.data.data);
          } else {
            setProducts([]);
          }
        }
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
      });
  };

  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    setCategoryId(selectedCategoryId); // Ensure this is a scalar value
    const params = new URLSearchParams();
    if (selectedCategoryId !== "") {
      params.append("category", selectedCategoryId);
    } else {
      params.delete("category");
    }
    window.history.replaceState(null, null, `?${params.toString()}`);
    fetchProducts(searchValue, selectedCategoryId);
  };

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setErrorMessage("");
    }, 3000); // 3 seconds
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const clearFilter = () => {
    setSearchValue("");
    setCategoryId(""); // Clear categoryId filter
    const params = new URLSearchParams();
    window.history.replaceState(null, null, `?${params.toString()}`);
    fetchProducts(); // Fetch all products again
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
        <h2 className="text-center mb-4">Sản phẩm</h2>
        {showError && <Alert variant="danger">{errorMessage}</Alert>}
        <div className="row mb-3">
          <div className="col">
            <Link
              className="btn btn-primary me-1"
              to="/products/create"
              role="button"
            >
              Thêm sản phẩm
            </Link>
            <Button variant="outline-primary" onClick={handleRefresh}>
              Refresh
            </Button>
          </div>
        </div>

        <div className="d-flex">
          <div className="input-gr search-input-container">
            <input
              type="text"
              className="form-control border-1 search-input"
              placeholder="Tìm kiếm..."
              value={searchValue}
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
            <select
              {...register("category_id")}
              value={categoryId}
              onChange={handleCategoryChange}
              className={`form-select ${errors.categories ? "is-invalid" : ""}`}
            >
              <option value="" disabled>
                Chọn danh mục
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
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

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Mô tả</th>
              <th>Danh mục</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.length > 0 &&
              products.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={
                        product.productImages &&
                        product.productImages.length > 0
                          ? `http://localhost:8080/uploads/${product.productImages[0]?.imageUrl}`
                          : errorImage
                      }
                      style={{ width: "50px", height: "50px" }}
                      alt="images"
                    />
                  </td>

                  <td className="">
                    <Link
                      className="text-decoration-none text-dark"
                      to={`/productDetails/product/${product.id}`}
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td>{product.description}</td>
                  <td>{product?.categoryId?.name}</td>
                  <td style={{ width: 1, whiteSpace: "nowrap" }}>
                    <Link
                      className="btn btn-success btn-sm me-1"
                      to={`/products/${product.id}`}
                    >
                      Chỉnh sửa
                    </Link>
                    <button
                      className="btn btn-danger ms-2"
                      onClick={() => {
                        setProductId(product.id);
                        setShowConfirmModal(true);
                      }}
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

// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, ".public/uploads");
//   },
//   filename: (req, file, callback) => {
//     callback(null, file.oringinalname);
//   },
// });
// const uploadFile = multer({ storage: storage });

// module.exports = uploadFile;
