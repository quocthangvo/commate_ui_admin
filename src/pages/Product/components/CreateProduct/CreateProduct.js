import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../../../css/CreateProduct.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import categoriesApi from "../../../../apis/categoriesApi";
import { toast } from "react-toastify";
import colorsApi from "../../../../apis/colorsApi";
import sizesApi from "../../../../apis/sizesApi";
import productsApi from "../../../../apis/productsApi";
import { createProductSchema } from "../../../../validations/productSchema";
import { MultiSelect } from "react-multi-select-component";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function CreateProduct() {
  const navigate = useNavigate();
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [messageError, setMessageError] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [images, setImages] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createProductSchema),
  });

  useEffect(() => {
    categoriesApi.getAllCategories().then((response) => {
      setCategories(response.data.data);
    });
    sizesApi.getAllSizes().then((response) => {
      setSizes(response.data.data);
    });
    colorsApi.getAllColors().then((response) => {
      setColors(response.data.data);
    });
  }, []);

  const handleSizeChange = (select) => {
    setSelectedSizes(select);
  };

  const handleColorChange = (select) => {
    setSelectedColors(select);
  };

  const onFileUploadImage = (e) => {
    setImages((prevImages) => [...prevImages, ...e.target.files]);
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const insertImage = () => {
    return [...images].map((image, index) => (
      <div key={index} className="image-item">
        <img src={URL.createObjectURL(image)} alt={`preview-${index}`} />
        <FontAwesomeIcon
          icon={faTimes}
          className="remove-icon"
          onClick={() => removeImage(index)}
        />
      </div>
    ));
  };

  const onSubmit = handleSubmit((data) => {
    const productData = {
      ...data,
      sizes: selectedSizes.map((size) => size.value),
      colors: selectedColors.map((color) => color.value),
    };
    productsApi
      .createProduct(productData)
      .then((response) => {
        if (response.status === 200) {
          const id = response.data.data.id;
          handleUploadImages(id);
        }
      })
      .catch((error) => {
        setMessageError(error.response.data.message);
      });
  });

  const handleUploadImages = (id) => {
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append("files", images[i]);
    }

    productsApi
      .uploadImages(id, formData)
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate(-1); // Redirect after successful image upload
        }
      })
      .catch((error) => {
        if (error.response) {
          setMessageError(error.response.data.message);
        } else {
          setMessageError("Đã xảy ra lỗi khi gửi yêu cầu.");
        }
      });
  };

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
              <label htmlFor="sku" className="form-label">
                Mã sku
              </label>
              <input
                {...register("sku")}
                className="form-control"
                required
                placeholder="Nhập mã sku"
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

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Mô tả
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <CKEditor
                    editor={ClassicEditor}
                    {...field}
                    onChange={(event, editor) => {
                      field.onChange(editor.getData());
                    }}
                    data={field.value}
                  />
                )}
              />
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
              <MultiSelect
                options={sizes.map((size) => ({
                  key: size.id,
                  label: size.name,
                  value: size.id,
                }))}
                value={selectedSizes}
                onChange={handleSizeChange}
              />
              <div className="invalid-feedback">{errors.sizes?.message}</div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="colors">
                Màu sắc:
              </label>
              <MultiSelect
                options={colors.map((color) => ({
                  key: color.id,
                  label: color.name,
                  value: color.id,
                }))}
                value={selectedColors}
                onChange={handleColorChange}
              />
              <div className="invalid-feedback">{errors.colors?.message}</div>
            </div>
          </form>

          <form
            className="form-container mt-5 justify-content-start"
            style={{ height: "300px", overflowY: "auto" }}
          >
            <h2 className="form-header">Cập nhật ảnh</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="sizes">
                Hình ảnh
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={onFileUploadImage}
                className="form-control"
              />
              <div className="image-grid">{insertImage()}</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
