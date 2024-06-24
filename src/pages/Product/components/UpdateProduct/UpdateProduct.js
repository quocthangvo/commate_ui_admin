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
  const [product, setProduct] = useState({});
  const [categories, setCategories] = useState([]);

  const [messageError, setMessageError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState();
  const [currentCategoryId, setCurrentCategoryId] = useState();

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
      setProduct(response.data);
      setCurrentCategoryId(response.data.category_id);
    });
  }, [productId]);
  useEffect(() => {
    // console.log(   );
    setValue("name", product.name || "");
    setSelectedCategory(product.category_id);
  }, [product, setValue]);

  const onSubmit = handleSubmit((data) => {
    data.category_id = selectedCategory || currentCategoryId;
    productsApi
      .updateProduct(productId, data)
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

  const handleSelectedCategory = (e) => {
    setSelectedCategory(e.target.value); //chọn id khác
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
