import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import categoriesApi from "../../../../apis/categoriesApi";
import productsApi from "../../../../apis/productsApi";
import { createNameSchema } from "../../../../validations/nameSchema";
import { toast } from "react-toastify";

export default function UpdateProduct() {
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const [categories, setCategories] = useState([]);
  const [messageError, setMessageError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState();
  const [currentCategoryId, setCurrentCategoryId] = useState();
  const [images, setImages] = useState([]);

  const {
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
      setCurrentCategoryId(productData.category_id);
      setSelectedCategory(productData.category_id);
    });
  }, [productId, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
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
    console.log(e.target.files);
  };

  const insertImage = () => {
    return [...images].map((image, index) => (
      <div key={index} className="image-item mt-5">
        <img src={URL.createObjectURL(image)} alt="" />
      </div>
    ));
  };

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
      className=""
    >
      <div
        style={{
          width: "648px",
        }}
      >
        <form
          onSubmit={onSubmit}
          style={{
            width: "100%",
          }}
        >
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
              className={`form-control ${errors.name ? "is-invalid" : false}`}
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
              className={`form-control ${errors.sku ? "is-invalid" : false}`}
            />
            <div className="invalid-feedback">{errors.sku?.message}</div>
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
            <div className="image-grid">{insertImage()}</div>
          </div>

          <div className=" mt-4 ">
            Danh mục
            <select
              {...register("category_id")}
              value={selectedCategory || currentCategoryId}
              onChange={handleSelectedCategory}
              className={`form-select ${
                errors.category_id ? "is-invalid" : false
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
