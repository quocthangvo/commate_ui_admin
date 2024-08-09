import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Alert, Button, Pagination, Table } from "react-bootstrap";
import productsApi from "../../apis/productsApi";
import ConfirmModal from "../../components/ConfirmModal";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import categoriesApi from "../../apis/categoriesApi";
import errorImage from "../../assets/img/error/error_image.png";
import "../../css/ProductList.css";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    fetchProducts(searchParam, categoryParam, 1); // Fetch products based on initial URL params
    fetchCategories();
  }, [location.search]);

  const fetchProducts = useCallback(
    (search = "", category = "", page = currentPage) => {
      const limit = 5; // Set the limit for the number of products per page
      if (search !== "" || category !== "") {
        if (search !== "") {
          searchProduct(search, page);
        } else {
          findByCategoryId(category, page);
        }
      } else {
        // Fetch all products if no params are provided
        productsApi
          .getAllProducts(page, limit)
          .then((response) => {
            setProducts(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    [currentPage]
  );

  useEffect(() => {
    fetchProducts(searchValue, categoryId, currentPage);
  }, [fetchProducts, currentPage, searchValue, categoryId]);

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
          fetchProducts(searchValue, categoryId, currentPage); // Re-fetch products after deletion
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

  const searchProduct = (name, page = 1) => {
    productsApi
      .searchProduct(name, page)
      .then((response) => {
        if (response.status === 200) {
          setProducts(response.data.data.content);
          setTotalPages(response.data.data.totalPages);
        }
      })
      .catch((error) => {
        showErrorMessage(error.response.data.message);
      });
  };

  const findByCategoryId = (categoryId, page = 1) => {
    productsApi
      .findByCategoryId(categoryId, page)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.data.length > 0) {
            setProducts(response.data.data);
          } else {
            setProducts([]);
          }
          setTotalPages(response.data.totalPages);
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
    fetchProducts(searchValue, selectedCategoryId, 1); // Fetch first page
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchProducts(searchValue, categoryId, pageNumber);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchProduct(searchValue, 1); // Fetch first page
    }
  };

  const clearFilter = () => {
    setSearchValue("");
    setCategoryId(""); // Clear categoryId filter
    const params = new URLSearchParams();
    window.history.replaceState(null, null, `?${params.toString()}`);
    fetchProducts(); // Fetch all products again
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

        <div className="d-flex mb-3">
          <div className="input-gr search-input-container">
            <input
              type="text"
              className="form-control border-1 search-input"
              placeholder="Tìm kiếm..."
              onKeyPress={handleKeyPress}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              aria-label="Search"
              aria-describedby="basic-addon2"
            />
            <button
              className="btn search-btn"
              type="button"
              onClick={() => searchProduct(searchValue, 1)}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>

          <div className="form-gr ms-2">
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
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Mã sku</th>
              <th style={{ width: "80px" }}>Mô tả</th>
              <th style={{ width: "100px" }}>Danh mục</th>
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
                  <td style={{ width: "80px" }}>{product?.sku}</td>
                  <td className="description">{product.description}</td>
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

        <div className="d-flex justify-content-end">
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {generatePageItems()}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      </div>
    </div>
  );
}
