import { toast } from "react-toastify";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { createNameSchema } from "../../../../validations/nameSchema";
import { useForm } from "react-hook-form";
import categoriesApi from "../../../../apis/categoriesApi";

export default function UpdateCategory() {
  const navigate = useNavigate();
  const { id: categoryId } = useParams();
  const [category, setCategory] = useState({});
  const [messageError, setMessageError] = useState("");

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createNameSchema),
  });

  useEffect(() => {
    categoriesApi.getCategoryById(categoryId).then((response) => {
      setCategory(response.data.data);
    });
  }, [categoryId]);

  useEffect(() => {
    setValue("name", category.name || ""); // Handle undefined category.name gracefully
  }, [category, setValue]);

  const onSubmit = handleSubmit((data) => {
    categoriesApi
      .updateCategory(categoryId, data)
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate(-1);
        }
      })
      .catch((error) => {
        setMessageError(error.response.data.message);
      });
  });

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
          <h2>Cập nhật danh mục</h2>
          {messageError && (
            <div className="alert alert-danger" role="alert">
              {messageError}
            </div>
          )}
          <div>
            <label htmlFor="name" className="form-label">
              Tên danh mục
            </label>
            <input
              {...register("name")}
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              id="name"
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name.message}</div>
            )}
          </div>
          <div className="text-end d-flex justify-content-end mt-3">
            <button
              type="button"
              className="btn btn-secondary px-4 me-2"
              onClick={() => navigate(-1)}
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-primary px-5">
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
