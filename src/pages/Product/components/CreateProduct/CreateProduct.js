import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../../../../css/CreateProduct.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MultiSelect } from "react-multi-select-component";
import categoriesApi from "../../../../apis/categoriesApi";
import { toast } from "react-toastify";
import colorsApi from "../../../../apis/colorsApi";
import sizesApi from "../../../../apis/sizesApi";
import productsApi from "../../../../apis/productsApi";
import { createProductSchema } from "../../../../validations/productSchema";

export default function CreateProduct() {
  const navigate = useNavigate();
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [messageError, setMessageError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createProductSchema),
  });

  useEffect(() => {
    categoriesApi
      .getAllCategories()
      .then((response) => {
        setCategories(response.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching categories: ", error);
        setCategories([]);
      });

    sizesApi
      .getAllSizes()
      .then((response) => {
        setSizes(response.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching sizes: ", error);
        setSizes([]);
      });

    colorsApi
      .getAllColors()
      .then((response) => {
        setColors(response.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching colors: ", error);
        setColors([]);
      });
  }, []);

  const onSubmit = handleSubmit((data) => {
    productsApi
      .createProduct({
        ...data,
        sizes: data.sizes ? data.sizes.map((size) => size.value) : [],
        colors: data.colors ? data.colors.map((color) => color.value) : [],
      })
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

  const sizeOptions = sizes.map((size) => ({
    value: size.id,
    label: size.name,
  }));
  const colorOptions = colors.map((color) => ({
    value: color.id,
    label: color.name,
  }));

  return (
    <div className="container">
      <Link className="btn btn-link mt-3" to="/products">
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
                {...register("name")}
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                type="text"
                placeholder="Nhập tên sản phẩm"
                required
              />
              <div className="invalid-feedback">{errors.name?.message}</div>
            </div>

            <div className="form-group">
              <label htmlFor="image" className="form-label">
                Hình ảnh
              </label>
              <input
                {...register("image")}
                type="file"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Mô tả
              </label>
              <textarea
                {...register("description")}
                type="text"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category_id">
                Danh mục:
              </label>
              <select
                {...register("category_id")}
                className={`form-select ${
                  errors.category_id ? "is-invalid" : ""
                }`}
                id="category_id"
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
              <button type="submit" className="btn btn-primary px-5">
                Lưu
              </button>
            </div>
          </form>
        </div>

        <div className="col-md-6">
          <form className="form-container">
            <h2 className="form-header">Thuộc tính</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="sizes">
                Kích thước:
              </label>
              <Controller
                name="sizes"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    {...field}
                    options={sizeOptions}
                    className={`form-select ${
                      errors.sizes ? "is-invalid" : ""
                    }`}
                    labelledBy="Chọn kích thước"
                  />
                )}
              />
              <div className="invalid-feedback">{errors.sizes?.message}</div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="colors">
                Màu sắc:
              </label>
              <Controller
                name="colors"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    {...field}
                    options={colorOptions}
                    className={`form-select ${
                      errors.colors ? "is-invalid" : ""
                    }`}
                    labelledBy="Chọn màu sắc"
                  />
                )}
              />
              <div className="invalid-feedback">{errors.colors?.message}</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
