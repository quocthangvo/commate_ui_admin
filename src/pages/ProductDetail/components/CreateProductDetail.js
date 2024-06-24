import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import "../../../css/CreateProduct.css";
import productDetailsApi from "../../../apis/productDetailsApi";
import sizesApi from "../../../apis/sizesApi";
import colorsApi from "../../../apis/colorsApi";
import categoriesApi from "../../../apis/categoriesApi";
import { createNameSchema } from "../../../validations/nameSchema";

export default function CreateProductDetail() {
  const navigate = useNavigate();
  const [sizes, setSizes] = useState([]); // State để lưu thông tin
  const [colors, setColors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [messageError, setMessageError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createNameSchema),
  });

  useEffect(() => {
    Promise.all([
      sizesApi.getAllSizes(),
      colorsApi.getAllColors(),
      categoriesApi.getAllCategories(),
    ])
      .then(([sizesResponse, colorsResponse, categoriesResponse]) => {
        setSizes(sizesResponse.data.data);
        setColors(colorsResponse.data.data);
        setCategories(categoriesResponse.data.data);
      })
      .catch((error) => {
        console.error("Lỗi truyển dữ liệu:", error);
      });
  }, []);

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("image", data.image[0]);
    formData.append("categoryId", data.category_id);
    formData.append("sizeId", data.size_id);
    formData.append("colorId", data.color_id);

    productDetailsApi
      .createProductDetail(formData)
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate(-1); // Navigate back về trang trước
        }
      })
      .catch((error) => {
        setMessageError(error.response.data.message);
      });
  });

  return (
    <div className="container">
      <Link className="btn btn-link" to="/productDetails">
        <FontAwesomeIcon icon={faArrowLeft} className="icon-size" />
      </Link>

      <div className="row">
        <div className="col-md-6">
          <form className="form-container" onSubmit={onSubmit}>
            <h2 className="form-header">Thông tin chi tiết</h2>
            {messageError && (
              <div className="alert alert-danger" role="alert">
                {messageError}
              </div>
            )}
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Tên sản phẩm:
              </label>
              <input
                {...register("name", {
                  required: "Tên sản phẩm chưa nhập",
                })}
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                type="text"
                id="name"
                placeholder="Nhập tên sản phẩm"
              />
              <div className="invalid-feedback">{errors.name?.message}</div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Mô tả:
              </label>
              <textarea
                {...register("description", {
                  required: "Mô tả sản phẩm không được để trống",
                })}
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
                id="description"
                placeholder="Nhập mô tả sản phẩm"
                rows="4"
              />
              <div className="invalid-feedback">
                {errors.description?.message}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="image">
                Hình ảnh:
              </label>
              <input
                {...register("image", {
                  required: "Vui lòng chọn hình ảnh",
                })}
                className={`form-control ${errors.image ? "is-invalid" : ""}`}
                type="file"
                id="image"
                accept="image/*"
              />
              <div className="invalid-feedback">{errors.image?.message}</div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category_id">
                Danh mục:
              </label>
              <select
                {...register("category_id", {
                  required: "Vui lòng chọn danh mục",
                })}
                className={`form-select ${
                  errors.category_id ? "is-invalid" : ""
                }`}
                id="category"
                aria-label="Default select example"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.length > 0 &&
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
              <div className="invalid-feedback">
                {errors.category_id?.message}
              </div>
            </div>

            <div className="text-end mt-5">
              <button
                type="button"
                className="btn btn-secondary px-4 me-2"
                onClick={() => navigate(-1)}
              >
                Hủy
              </button>
              <button type="submit" className="btn btn-primary px-4">
                Lưu
              </button>
            </div>
          </form>
        </div>

        <div className="col-md-6">
          <form className="form-container">
            <h2 className="form-header">Thuộc tính</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="size_id">
                Kích thước:
              </label>
              <select
                {...register("size_id", {
                  required: "Vui lòng chọn kích thước",
                })}
                className={`form-select ${errors.size_id ? "is-invalid" : ""}`}
                id="sizeId"
              >
                <option value="">-- Chọn kích thước --</option>
                {sizes.length > 0 &&
                  sizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.name}
                    </option>
                  ))}
              </select>
              <div className="invalid-feedback">{errors.size_id?.message}</div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="color_id">
                Màu sắc:
              </label>
              <select
                {...register("color_id", {
                  required: "Vui lòng chọn màu sắc",
                })}
                className={`form-select ${errors.color_id ? "is-invalid" : ""}`}
                id="colorId"
              >
                <option value="">-- Chọn màu sắc --</option>
                {colors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">{errors.color_id?.message}</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
