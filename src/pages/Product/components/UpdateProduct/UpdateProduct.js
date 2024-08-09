import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import categoriesApi from "../../../../apis/categoriesApi";
import productsApi from "../../../../apis/productsApi";
import { createNameSchema } from "../../../../validations/nameSchema";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { CloseButton } from "react-bootstrap";

export default function UpdateProduct() {
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const [categories, setCategories] = useState([]);
  const [messageError, setMessageError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState();
  const [currentCategoryId, setCurrentCategoryId] = useState();
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createNameSchema),
  });

  useEffect(() => {
    categoriesApi.getAllCategories().then((response) => {
      setCategories(response.data.data);
    });
  }, []);

  useEffect(() => {
    productsApi.getProductById(productId).then((response) => {
      const productData = response.data;
      setValue("name", productData.name);
      setValue("description", productData.description);
      setValue("sku", productData.sku);
      setCurrentCategoryId(productData.category_id);
      setSelectedCategory(productData.category_id);
      setExistingImages(productData.product_images);
    });
  }, [productId, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("sku", data.sku);
    formData.append("category_id", selectedCategory || currentCategoryId);

    try {
      const response = await productsApi.updateProduct(productId, formData);
      if (response.status === 200) {
        const id = response.data.data.id;
        handleUploadImages(id);
      }
    } catch (error) {
      setMessageError(error.response.data.message);
    }
  });

  const handleSelectedCategory = (e) => {
    setSelectedCategory(e.target.value);
  };

  const onFileUploadImage = (e) => {
    setImages(e.target.files);
  };

  const removeExistingImage = (index) => {
    const updatedImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedImages);
  };

  const insertImage = () => {
    return (
      <div className="image-grid">
        {existingImages.map((image, index) => (
          <div key={index} className="image-item mt-5">
            <img
              src={`http://localhost:8080/uploads/${image.imageUrl}`}
              alt=""
              style={{ width: "100px", height: "100px" }}
            />
            <CloseButton
              type="button"
              className="btn"
              onClick={() => removeExistingImage(index)}
            ></CloseButton>
          </div>
        ))}
        {[...images].map((image, index) => (
          <div key={index + existingImages.length} className="image-item mt-5">
            <img
              src={URL.createObjectURL(image)}
              alt=""
              style={{ width: "100px", height: "100px" }}
            />
          </div>
        ))}
      </div>
    );
  };

  const handleUploadImages = async (id) => {
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append("files", images[i]);
    }

    try {
      console.log("Uploading images with formData: ", formData);
      const response = await productsApi.uploadImages(id, formData);
      console.log("Upload response: ", response);

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate(-1); // Redirect after successful image upload
      }
    } catch (error) {
      console.error("Upload error: ", error);
      setMessageError(
        error.response
          ? error.response.data.message
          : "Đã xảy ra lỗi khi gửi yêu cầu."
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <div style={{ width: "648px" }}>
        <form onSubmit={onSubmit} style={{ width: "100%" }}>
          <h2>Cập nhật sản phẩm</h2>
          {messageError && (
            <div className="alert alert-danger" role="alert">
              {messageError}
            </div>
          )}

          <div className="">
            <label htmlFor="name" className="form-label">
              Tên sản phẩm
            </label>
            <input
              {...register("name")}
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              id="name"
            />
            <div className="invalid-feedback">{errors.name?.message}</div>
          </div>

          <div className="">
            <label htmlFor="sku" className="form-label">
              Mã sku
            </label>
            <input
              {...register("sku")}
              type="text"
              className={`form-control ${errors.sku ? "is-invalid" : ""}`}
            />
            <div className="invalid-feedback">{errors.sku?.message}</div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Mô tả
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <CKEditor
                  editor={ClassicEditor}
                  data={field.value}
                  onChange={(event, editor) => field.onChange(editor.getData())}
                  onBlur={field.onBlur}
                />
              )}
            />
            <div className="invalid-feedback">
              {errors.description?.message}
            </div>
          </div>

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
            {insertImage()}
          </div>

          <div className="mt-4">
            Danh mục
            <select
              {...register("category_id")}
              value={selectedCategory || currentCategoryId}
              onChange={handleSelectedCategory}
              className={`form-select ${
                errors.category_id ? "is-invalid" : ""
              }`}
              aria-label="Default select example"
            >
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
    </div>
  );
}
